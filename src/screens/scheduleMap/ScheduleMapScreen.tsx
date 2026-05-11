import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  PanResponder,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/colors';
import Geolocation from '@react-native-community/geolocation';
import { getDistanceMeters } from '@/utils/location';

import { TopBar } from '@/components';
import TripDetailCard from '@/components/ui/TripDetailCard';
import { fetchKoreanAddress, fetchNearestKoreanPlaceName } from '@/services/mapPlaceService';
import IndexMarker from './components/IndexMarker';
import MapPlaceCard from './components/MapPlaceCard';

import type { RoutePoint } from './types';
import {
  createDayColorMap,
  getPreviewPoint,
  getSelectedDayColor,
  groupRoutePointsByDay,
} from './utils';
import { getTripScheduleLocations, postVisitedPlace } from '@/services';

type ScheduleMapScreenNavigation = NativeStackNavigationProp<RootStackParamList>;
type ScheduleMapRoute = RouteProp<RootStackParamList, 'ScheduleMap'>;

const FALLBACK_REGION: Region = {
  latitude: 35.6762,
  longitude: 139.6503,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const EMPTY_ROUTE_POINTS: RoutePoint[] = [];

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
  const cardTranslate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dragAxisRef = useRef<'horizontal' | 'vertical' | null>(null);
  const [currentCardHeight, setCurrentCardHeight] = useState(0);
  const [shouldTrackMarkers, setShouldTrackMarkers] = useState(true);
  const [tripTitle, setTripTitle] = useState('');
  const DRAG_RESISTANCE = 0.42;
  const MAX_DRAG_DISTANCE = 72;
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(EMPTY_ROUTE_POINTS);

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
    setShouldTrackMarkers(true);
    const timer = setTimeout(() => setShouldTrackMarkers(false), 300);
    return () => clearTimeout(timer);
  }, [dayPoints.length, selectedDayIndex]);

  useEffect(() => {
    if (!tripId) {
      setRoutePoints(EMPTY_ROUTE_POINTS);
      return;
    }

    const abortController = new AbortController();
    const loadScheduleLocations = async (): Promise<void> => {
      const result = await getTripScheduleLocations({
        tripId,
        signal: abortController.signal,
      });
      if (abortController.signal.aborted || result.error?.code === 'REQUEST_ABORTED') return;
      if (result.error || !result.data) {
        showToast('일정 정보를 불러오는 데 실패했습니다.');
        setRoutePoints(EMPTY_ROUTE_POINTS);
        setTripTitle('');
        return;
      }

      const nextPoints: RoutePoint[] = result.data.schedules.map((schedule) => ({
        id: String(schedule.tripScheduleId),
        placeId: schedule.placeId,
        day: schedule.dayNo,
        order: schedule.pinOrder,
        latitude: schedule.latitude,
        longitude: schedule.longitude,
        title: schedule.placeName || schedule.title,
        location: schedule.address,
        description: schedule.description ?? '',
        placeCardDescription: schedule.memo ?? '',
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        image: schedule.imageUrl ? { uri: schedule.imageUrl } : null,
        categories: [],
        current: schedule.current,
        canAddVisitedPlace: schedule.canAddVisitedPlace,
        visited: schedule.visited,
      }));

      setRoutePoints(nextPoints);
      setTripTitle(result.data.tripTitle);
    };

    loadScheduleLocations();

    return () => {
      abortController.abort();
    };
  }, [tripId]);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const showToast = (message: string): void => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }
    Alert.alert(message);
  };

  const handleVerifyLocation = useCallback(async () => {
    if (!currentPoint || !tripId) return;

    try {
      const { placeId } = currentPoint;
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        showToast('위치 권한을 허용해주세요.');
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const distance = getDistanceMeters(
              latitude,
              longitude,
              currentPoint.latitude,
              currentPoint.longitude,
            );

            if (distance > 1000) {
              showToast(`해당 장소에서 ${Math.round(distance)}m 떨어져 있습니다.`);
              return;
            }

            const result = await postVisitedPlace({
              tripId,
              payload: {
                placeId,
                tripScheduleId: Number(currentPoint.id),
              },
            });

            if (result.error) {
              showToast('저장에 실패했습니다. 다시 시도해주세요.');
              return;
            }

            setRoutePoints((prev) =>
              prev.map((point) =>
                point.id === currentPoint.id
                  ? { ...point, visited: true, canAddVisitedPlace: false }
                  : point,
              ),
            );

            showToast('방문지가 저장되었습니다!');
          } catch {
            showToast('위치 확인 중 오류가 발생했습니다.');
          }
        },
        () => {
          showToast('GPS를 확인해주세요.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } catch {
      showToast('위치 인증을 시작하지 못했습니다.');
    }
  }, [currentPoint, tripId]);

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
      placeId: 0,
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
      current: false,
      canAddVisitedPlace: false,
      visited: false,
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
      <TopBar title={tripTitle || '일정 지도'} onPress={() => navigation.goBack()} />

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
            key={point.id}
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
            {previewPoint && previewPoint.id !== currentPoint?.id && (
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
                  actionLabel={
                    currentPoint.visited || !currentPoint.canAddVisitedPlace
                      ? '이미 저장된 장소입니다.'
                      : '여행지 기록하기'
                  }
                  actionDisabled={currentPoint.visited || !currentPoint.canAddVisitedPlace}
                  onPressAction={handleVerifyLocation}
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
