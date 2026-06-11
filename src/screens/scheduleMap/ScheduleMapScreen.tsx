import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, ToastAndroid, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/colors';

import { TopBar } from '@/components';
import TripDetailCard from '@/components/ui/TripDetailCard';
import {
  fetchKoreanAddress,
  fetchNearestKoreanPlaceName,
  getTripScheduleLocations,
} from '@/services';
import IndexMarker from './components/IndexMarker';
import MapPlaceCard from './components/MapPlaceCard';

import type { RoutePoint } from './types';
import {
  createDayColorMap,
  getPreviewPoint,
  getSelectedDayColor,
  groupRoutePointsByDay,
} from './utils';

type ScheduleMapScreenNavigation = NativeStackNavigationProp<RootStackParamList>;
type ScheduleMapRoute = RouteProp<RootStackParamList, 'ScheduleMap'>;

const FALLBACK_REGION: Region = {
  latitude: 35.6762,
  longitude: 139.6503,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const EMPTY_ROUTE_POINTS: RoutePoint[] = [];

const formatScheduleTime = (time?: string | null): string => {
  if (!time) return '';
  return time.slice(0, 5);
};

const ScheduleMapScreen: React.FC = () => {
  const navigation = useNavigation<ScheduleMapScreenNavigation>();
  const route = useRoute<ScheduleMapRoute>();
  const tripId = route.params?.tripId;
  const mapRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedItemIndexByDay, setSelectedItemIndexByDay] = useState<Record<number, number>>({});
  const [isMapPlaceCardVisible, setIsMapPlaceCardVisible] = useState(false);
  const [mapPlaceCardPoint, setMapPlaceCardPoint] = useState<RoutePoint | null>(null);
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(EMPTY_ROUTE_POINTS);
  const [tripTitle, setTripTitle] = useState('일정 지도');
  const cardTranslate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dragAxisRef = useRef<'horizontal' | 'vertical' | null>(null);
  const [currentCardHeight, setCurrentCardHeight] = useState(0);
  const DRAG_RESISTANCE = 0.42;
  const MAX_DRAG_DISTANCE = 72;

  const groupedDays = useMemo(() => groupRoutePointsByDay(routePoints), [routePoints]);
  const initialRegion = useMemo<Region>(() => {
    const firstPoint = groupedDays[0]?.points[0];

    if (!firstPoint) {
      return FALLBACK_REGION;
    }

    return {
      latitude: firstPoint.latitude,
      longitude: firstPoint.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [groupedDays]);
  const dayColorMap = useMemo(() => createDayColorMap(groupedDays), [groupedDays]);

  const selectedDay = groupedDays[selectedDayIndex];
  const dayPoints = useMemo(() => selectedDay?.points ?? [], [selectedDay]);
  const selectedItemIndex = selectedItemIndexByDay[selectedDay?.day ?? -1] ?? 0;
  const currentPoint = dayPoints[selectedItemIndex] ?? dayPoints[0];
  const selectedDayColor = getSelectedDayColor(selectedDay, dayColorMap);
  const showTravelLogAction = currentPoint?.current === true;
  const previewPoint = useMemo(
    () =>
      getPreviewPoint(dayPoints, selectedItemIndex, groupedDays, selectedDayIndex, currentPoint),
    [currentPoint, dayPoints, groupedDays, selectedDayIndex, selectedItemIndex],
  );

  useEffect(() => {
    if (!tripId) return;

    const abortController = new AbortController();

    const loadScheduleLocations = async (): Promise<void> => {
      const result = await getTripScheduleLocations({
        tripId,
        signal: abortController.signal,
      });

      if (abortController.signal.aborted || result.error?.code === 'REQUEST_ABORTED') return;
      if (result.error || !result.data) {
        setRoutePoints(EMPTY_ROUTE_POINTS);
        ToastAndroid.show('일정 위치를 불러오지 못했습니다.', ToastAndroid.SHORT);
        return;
      }

      const nextRoutePoints: RoutePoint[] = result.data.schedules
        .filter(
          (schedule) =>
            schedule.hasLocation &&
            typeof schedule.latitude === 'number' &&
            Number.isFinite(schedule.latitude) &&
            typeof schedule.longitude === 'number' &&
            Number.isFinite(schedule.longitude),
        )
        .map((schedule) => ({
          id: String(schedule.tripScheduleId),
          tripScheduleId: schedule.tripScheduleId,
          placeId: schedule.placeId,
          day: schedule.dayNo,
          order: schedule.pinOrder ?? schedule.scheduleOrder,
          latitude: schedule.latitude as number,
          longitude: schedule.longitude as number,
          title: schedule.title || schedule.placeName || '일정',
          location: schedule.placeName || schedule.address || '위치 정보 없음',
          description: schedule.memo || schedule.description || '',
          placeCardDescription: schedule.description || schedule.memo || '',
          startTime: formatScheduleTime(schedule.startTime),
          endTime: formatScheduleTime(schedule.endTime),
          image: schedule.imageUrl ? { uri: schedule.imageUrl } : null,
          imageText: schedule.imageUrl ? undefined : '이미지를 불러올 수 없습니다.',
          categories: [],
          current: schedule.current,
          canAddVisitedPlace: schedule.canAddVisitedPlace,
          visited: schedule.visited,
        }));

      setTripTitle(result.data.tripTitle || '일정 지도');
      setRoutePoints(nextRoutePoints);

      const currentSchedule = nextRoutePoints.find((point) => point.current);
      if (!currentSchedule) {
        setSelectedDayIndex(0);
        setSelectedItemIndexByDay({});
        return;
      }

      const nextGroupedDays = groupRoutePointsByDay(nextRoutePoints);
      const currentDayIndex = nextGroupedDays.findIndex(
        (dayGroup) => dayGroup.day === currentSchedule.day,
      );
      const currentItemIndex =
        nextGroupedDays[currentDayIndex]?.points.findIndex(
          (point) => point.id === currentSchedule.id,
        ) ?? 0;

      if (currentDayIndex >= 0) {
        setSelectedDayIndex(currentDayIndex);
        setSelectedItemIndexByDay({ [currentSchedule.day]: Math.max(currentItemIndex, 0) });
      }
    };

    void loadScheduleLocations();

    return () => {
      abortController.abort();
    };
  }, [tripId]);

  useEffect(() => {
    if (!mapRef.current || dayPoints.length < 2) return;

    mapRef.current.fitToCoordinates(
      dayPoints.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      })),
      {
        edgePadding: {
          top: insets.top + 96,
          right: 32,
          bottom: insets.bottom + 220,
          left: 32,
        },
        animated: true,
      },
    );
  }, [dayPoints, insets.bottom, insets.top]);

  useEffect(() => {
    if (!currentPoint) return;

    setSelectedPointId(currentPoint.id);
    mapRef.current?.animateToRegion(
      {
        latitude: currentPoint.latitude,
        longitude: currentPoint.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      250,
    );
  }, [currentPoint]);

  const updateVerticalIndex = useCallback(
    (next: boolean) => {
      if (!selectedDay || dayPoints.length === 0) return;

      setSelectedItemIndexByDay((prev) => {
        const current = prev[selectedDay.day] ?? 0;
        const lastIndex = dayPoints.length - 1;
        const nextIndex = next
          ? (current + 1) % dayPoints.length
          : current === 0
            ? lastIndex
            : current - 1;

        if (nextIndex === current) return prev;
        return { ...prev, [selectedDay.day]: nextIndex };
      });
    },
    [dayPoints.length, selectedDay],
  );

  const updateHorizontalDay = useCallback(
    (next: boolean) => {
      setSelectedDayIndex((prev) => {
        if (next) return Math.min(prev + 1, groupedDays.length - 1);
        return Math.max(prev - 1, 0);
      });
    },
    [groupedDays.length],
  );

  const animateCardToCenter = useCallback(() => {
    Animated.spring(cardTranslate, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      speed: 14,
      bounciness: 0,
    }).start();
  }, [cardTranslate]);

  const animateCardSwitch = useCallback(
    (axis: 'horizontal' | 'vertical', direction: number) => {
      const toValue =
        axis === 'horizontal' ? { x: direction * 140, y: 0 } : { x: 0, y: direction * 140 };

      Animated.timing(cardTranslate, {
        toValue,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        if (axis === 'horizontal') {
          updateHorizontalDay(direction < 0);
        } else {
          updateVerticalIndex(direction < 0);
        }

        cardTranslate.setValue(
          axis === 'horizontal' ? { x: -direction * 24, y: 0 } : { x: 0, y: -direction * 24 },
        );
        animateCardToCenter();
      });
    },
    [animateCardToCenter, cardTranslate, updateHorizontalDay, updateVerticalIndex],
  );

  const handlePressMarker = useCallback(async (point: RoutePoint) => {
    setSelectedPointId(point.id);
    setMapPlaceCardPoint(point);
    setIsMapPlaceCardVisible(true);

    try {
      const [placeResult, addressResult] = await Promise.all([
        fetchNearestKoreanPlaceName(point.latitude, point.longitude),
        fetchKoreanAddress(point.latitude, point.longitude),
      ]);

      const nextPoint: RoutePoint = {
        ...point,
        title: placeResult.error ? point.title : (placeResult.name ?? point.title),
        placeCardDescription: placeResult.summary ?? point.placeCardDescription,
        categories: placeResult.types.length > 0 ? placeResult.types : point.categories,
        image: placeResult.photoUrl ? { uri: placeResult.photoUrl } : point.image,
        location: addressResult.error ? point.location : addressResult.address,
      };

      setMapPlaceCardPoint(nextPoint);
    } catch (error) {
      console.error('handlePressMarker Error:', error);
    }
  }, []);

  const createTempPoint = useCallback(
    (coordinate: { latitude: number; longitude: number }, titleOverride?: string): RoutePoint => ({
      id: `${titleOverride ? 'poi' : 'map'}-${Date.now()}`,
      day: 0,
      order: 0,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      title: titleOverride ?? '주변 장소 불러오는 중...',
      location: '주소 불러오는 중...',
      description: '',
      placeCardDescription: '주변 장소 정보를 불러오는 중입니다.',
      startTime: '',
      endTime: '',
      image: null,
      imageText: '이미지를 불러오는 중입니다.',
      categories: [],
    }),
    [],
  );

  const handleSelectPoint = useCallback(
    async (
      coordinate: { latitude: number; longitude: number },
      titleOverride?: string,
    ): Promise<void> => {
      const tempPoint = createTempPoint(coordinate, titleOverride);

      setSelectedPointId(null);
      setMapPlaceCardPoint(tempPoint);
      setIsMapPlaceCardVisible(true);

      const [placeResult, addressResult] = await Promise.all([
        fetchNearestKoreanPlaceName(coordinate.latitude, coordinate.longitude),
        fetchKoreanAddress(coordinate.latitude, coordinate.longitude),
      ]);

      const nextPoint: RoutePoint = {
        ...tempPoint,
        title:
          titleOverride ??
          (placeResult.error ? tempPoint.title : (placeResult.name ?? tempPoint.title)),
        placeCardDescription: placeResult.summary ?? tempPoint.placeCardDescription,
        categories: placeResult.types.length > 0 ? placeResult.types : tempPoint.categories,
        image: placeResult.photoUrl ? { uri: placeResult.photoUrl } : tempPoint.image,
        imageText: placeResult.photoUrl ? undefined : tempPoint.imageText,
        location: addressResult.error ? tempPoint.location : addressResult.address,
      };

      setMapPlaceCardPoint(nextPoint);
    },
    [createTempPoint],
  );

  const handlePressMap = useCallback(
    async (coordinate: { latitude: number; longitude: number }) => {
      try {
        await handleSelectPoint(coordinate);
      } catch (error) {
        console.error('handlePressMap Error:', error);
      }
    },
    [handleSelectPoint],
  );

  const handlePressPoi = useCallback(
    async (event: {
      nativeEvent: { coordinate?: { latitude: number; longitude: number }; name?: string };
    }) => {
      const { coordinate, name } = event.nativeEvent ?? {};

      if (!coordinate) return;

      try {
        await handleSelectPoint(coordinate, name);
      } catch (error) {
        console.error('handlePressPoi Error:', error);
      }
    },
    [handleSelectPoint],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8,
        onPanResponderGrant: () => {
          dragAxisRef.current = null;
          cardTranslate.stopAnimation();
        },
        onPanResponderMove: (_, gestureState) => {
          const { dx, dy } = gestureState;
          const dampedDx = Math.max(
            -MAX_DRAG_DISTANCE,
            Math.min(MAX_DRAG_DISTANCE, dx * DRAG_RESISTANCE),
          );
          const dampedDy = Math.max(
            -MAX_DRAG_DISTANCE,
            Math.min(MAX_DRAG_DISTANCE, dy * DRAG_RESISTANCE),
          );

          if (!dragAxisRef.current) {
            dragAxisRef.current = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
          }

          if (dragAxisRef.current === 'horizontal') {
            cardTranslate.setValue({ x: dampedDx, y: 0 });
          } else {
            cardTranslate.setValue({ x: 0, y: dampedDy });
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dx, dy } = gestureState;
          const isHorizontal = dragAxisRef.current === 'horizontal';
          const threshold = 42;

          if (isHorizontal && Math.abs(dx) > threshold) {
            const toNextDay = dx < 0;
            const canMove = toNextDay
              ? selectedDayIndex < groupedDays.length - 1
              : selectedDayIndex > 0;

            if (canMove) {
              animateCardSwitch('horizontal', toNextDay ? -1 : 1);
              return;
            }
          }

          if (!isHorizontal && Math.abs(dy) > threshold) {
            if (dayPoints.length > 1) {
              const toNextSchedule = dy < 0;
              animateCardSwitch('vertical', toNextSchedule ? -1 : 1);
              return;
            }
          }

          animateCardToCenter();
          dragAxisRef.current = null;
        },
        onPanResponderTerminate: () => {
          animateCardToCenter();
          dragAxisRef.current = null;
        },
      }),
    [
      animateCardSwitch,
      animateCardToCenter,
      cardTranslate,
      dayPoints.length,
      groupedDays.length,
      selectedDayIndex,
    ],
  );

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <TopBar title={tripTitle} onPress={() => navigation.goBack()} />

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onPress={(event) => handlePressMap(event.nativeEvent.coordinate)}
        onPoiClick={handlePressPoi}>
        {dayPoints.length >= 2 && (
          <Polyline
            coordinates={dayPoints.map((p) => ({
              latitude: p.latitude,
              longitude: p.longitude,
            }))}
            strokeColor={selectedDayColor}
            strokeWidth={5}
            lineDashPattern={[10, 10]}
            lineCap="butt"
          />
        )}

        {dayPoints.map((point) => (
          <Marker
            key={`${point.id}-${selectedPointId === point.id ? 'selected' : 'default'}`}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            onPress={() => handlePressMarker(point)}
            tracksViewChanges>
            <IndexMarker
              index={point.order}
              day={point.day}
              selected={selectedPointId === point.id}
              color={dayColorMap[point.day] ?? COLORS.main}
            />
          </Marker>
        ))}
      </MapView>

      {isMapPlaceCardVisible ? (
        <View
          className="absolute bottom-0 left-0 right-0 z-10 border-t border-borderGray bg-white"
          style={{ paddingBottom: insets.bottom }}>
          <View className="h-[160px] w-full items-center px-4 py-6">
            {mapPlaceCardPoint && <MapPlaceCard place={mapPlaceCardPoint} />}
          </View>
        </View>
      ) : (
        <View className="absolute left-4 right-4 z-10" style={{ bottom: insets.bottom + 10 }}>
          <View
            style={{
              minHeight: currentCardHeight + (previewPoint ? 10 : 0),
            }}>
            {previewPoint && (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  transform: [{ scale: 0.985 }],
                  opacity: 0.68,
                }}>
                <TripDetailCard
                  order={previewPoint.order}
                  title={previewPoint.title}
                  location={previewPoint.location}
                  description={previewPoint.description}
                  startTime={previewPoint.startTime}
                  endTime={previewPoint.endTime}
                  accentColor={dayColorMap[previewPoint.day] ?? COLORS.main}
                />
              </View>
            )}

            <Animated.View
              onLayout={(event) => {
                const nextHeight = event.nativeEvent.layout.height;
                if (nextHeight !== currentCardHeight) {
                  setCurrentCardHeight(nextHeight);
                }
              }}
              style={{
                transform: [{ translateX: cardTranslate.x }, { translateY: cardTranslate.y }],
              }}
              {...panResponder.panHandlers}>
              {currentPoint && (
                <TripDetailCard
                  order={currentPoint.order}
                  title={currentPoint.title}
                  location={currentPoint.location}
                  description={currentPoint.description}
                  startTime={currentPoint.startTime}
                  endTime={currentPoint.endTime}
                  isCurrentSchedule={showTravelLogAction}
                  actionLayout="fullWidth"
                  actionLabel="여행지 기록하기"
                  onPressAction={() =>
                    navigation.navigate('MainTabs', {
                      screen: 'Search',
                    })
                  }
                  accentColor={selectedDayColor}
                />
              )}
            </Animated.View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ScheduleMapScreen;
export { ScheduleMapScreen };
