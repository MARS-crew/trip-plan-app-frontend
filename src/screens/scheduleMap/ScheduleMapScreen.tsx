import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, View } from 'react-native';
import MapView, { Marker, Polyline, Region } from 'react-native-maps';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants/colors';

import { TopBar } from '@/components';
import TripDetailCard from '@/components/ui/TripDetailCard';
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

const FALLBACK_REGION: Region = {
  latitude: 35.6762,
  longitude: 139.6503,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const ROUTE_POINTS: RoutePoint[] = [
  {
    id: 'p1',
    day: 1,
    order: 1,
    latitude: 35.714765,
    longitude: 139.796655,
    title: '아사쿠사 센소지',
    location: '아사쿠사, 도쿄',
    description: '도쿄에서 가장 오래된 사원 방문',
    placeCardDescription: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시...',
    startTime: '09:00',
    endTime: '11:00',
    image: require('../../assets/images/thumnail4.png'),
    categories: ['관광지', '문화', '역사'],
  },
  {
    id: 'p2',
    day: 1,
    order: 2,
    latitude: 35.665486,
    longitude: 139.770667,
    title: '츠키지 시장',
    location: '츄오구, 도쿄',
    description: '신선한 스시와 해산물 즐기기',
    placeCardDescription: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시...',
    startTime: '12:00',
    endTime: '14:00',
    image: require('../../assets/images/thumnail4.png'),
    categories: ['관광지', '문화', '역사'],
  },
  {
    id: 'p3',
    day: 2,
    order: 1,
    latitude: 35.658581,
    longitude: 139.745433,
    title: '도쿄 타워',
    location: '미나토구, 도쿄',
    description: '도쿄 전망 감상',
    placeCardDescription: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시...',
    startTime: '10:00',
    endTime: '11:30',
    image: require('../../assets/images/thumnail4.png'),
    categories: ['관광지', '문화', '역사'],
  },
  {
    id: 'p4',
    day: 2,
    order: 2,
    latitude: 35.689487,
    longitude: 139.691706,
    title: '신주쿠',
    location: '신주쿠구, 도쿄',
    description: '쇼핑',
    placeCardDescription: '도쿄는 일본의 수도이자 전통과 현대가 조화를 이루는 매력적인 도시...',
    startTime: '13:00',
    endTime: '16:00',
    image: require('../../assets/images/thumnail4.png'),
    categories: ['관광지', '문화', '역사'],
  },
];

const ScheduleMapScreen: React.FC = () => {
  const navigation = useNavigation<ScheduleMapScreenNavigation>();
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
  const DRAG_RESISTANCE = 0.42;
  const MAX_DRAG_DISTANCE = 72;

  const groupedDays = useMemo(() => groupRoutePointsByDay(ROUTE_POINTS), []);
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
  const showTravelLogAction = currentPoint?.day === 1 && currentPoint?.order === 1;
  const previewPoint = useMemo(
    () => getPreviewPoint(dayPoints, selectedItemIndex, groupedDays, selectedDayIndex, currentPoint),
    [currentPoint, dayPoints, groupedDays, selectedDayIndex, selectedItemIndex],
  );

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

  const updateVerticalIndex = useCallback((next: boolean) => {
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
  }, [dayPoints.length, selectedDay]);

  const updateHorizontalDay = useCallback((next: boolean) => {
    setSelectedDayIndex((prev) => {
      if (next) return Math.min(prev + 1, groupedDays.length - 1);
      return Math.max(prev - 1, 0);
    });
  }, [groupedDays.length]);

  const animateCardToCenter = useCallback(() => {
    Animated.spring(cardTranslate, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      speed: 14,
      bounciness: 0,
    }).start();
  }, [cardTranslate]);

  const animateCardSwitch = useCallback((axis: 'horizontal' | 'vertical', direction: number) => {
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
  }, [animateCardToCenter, cardTranslate, updateHorizontalDay, updateVerticalIndex]);

  const handlePressMarker = useCallback((point: RoutePoint) => {
    setSelectedPointId(point.id);
    setMapPlaceCardPoint(point);
    setIsMapPlaceCardVisible(true);
  }, []);

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
    [animateCardSwitch, animateCardToCenter, cardTranslate, dayPoints.length, groupedDays.length, selectedDayIndex],
  );

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <TopBar title="도쿄" onPress={() => navigation.goBack()} />

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
      >
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
            tracksViewChanges
          >
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
          style={{ paddingBottom: insets.bottom }}
        >
          <View className="h-[160px] w-full items-center px-4 py-6">
            {mapPlaceCardPoint && (
              <MapPlaceCard
                place={mapPlaceCardPoint}
                onPressAction={() => navigation.navigate('AddSchedule')}
              />
            )}
          </View>
        </View>
      ) : (
        <View
          className="absolute left-4 right-4 z-10"
          style={{ bottom: insets.bottom + 10 }}
        >
          <View
            style={{
              minHeight: currentCardHeight + (previewPoint ? 10 : 0),
            }}
          >
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
                }}
              >
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
              {...panResponder.panHandlers}
            >
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
                  onPressAction={() => {}}
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
