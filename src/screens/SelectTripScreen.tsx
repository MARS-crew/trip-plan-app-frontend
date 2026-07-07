import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Animated,
  Easing,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SelectTripHeader, TripSelectionCard } from '@/screens/selectTrip';
import type { TripDateItem } from '@/screens/selectTrip/components/TripSelectionCard';
import type { SearchStackParamList } from '@/navigation/types';
import { getMyTrips } from '@/services/tripService';
import type { MyTripItem } from '@/types/myTrip.types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;
type SelectTripRouteProp = RouteProp<SearchStackParamList, 'SelectTrip'>;

// ============ Helpers ============
const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const generateTripDates = (startDate: string, endDate: string): TripDateItem[] => {
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const dates: TripDateItem[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push({
      date: `${current.getMonth() + 1}/${current.getDate()}`,
      day: DAY_NAMES[current.getDay()] ?? '',
    });
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// ============ Component ============
const SelectTripScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SelectTripRouteProp>();
  const placeParams = route.params;

  const [trips, setTrips] = useState<MyTripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [scrollPositions, setScrollPositions] = useState<Record<number, number>>({});
  const [selectedDates, setSelectedDates] = useState<Record<number, number | null>>({});

  const animatedHeightsRef = useRef<Record<number, Animated.Value>>({});
  const animatedOpacitiesRef = useRef<Record<number, Animated.Value>>({});

  const getAnimatedHeight = (index: number): Animated.Value => {
    if (!animatedHeightsRef.current[index]) {
      animatedHeightsRef.current[index] = new Animated.Value(0);
    }
    return animatedHeightsRef.current[index] as Animated.Value;
  };

  const getAnimatedOpacity = (index: number): Animated.Value => {
    if (!animatedOpacitiesRef.current[index]) {
      animatedOpacitiesRef.current[index] = new Animated.Value(0);
    }
    return animatedOpacitiesRef.current[index] as Animated.Value;
  };

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const fetchTrips = async (): Promise<void> => {
      const { data, error } = await getMyTrips({
        filterStatus: 'UPCOMING',
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      if (!error) setTrips(data);
      setIsLoading(false);
    };

    void fetchTrips();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    trips.forEach((_, index) => {
      const isExpanded = expandedCardIndex === index;
      const height = getAnimatedHeight(index);
      const opacity = getAnimatedOpacity(index);
      Animated.parallel([
        Animated.timing(height, {
          toValue: isExpanded ? 64 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: isExpanded ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedCardIndex, trips]);

  const handleCardPress = useCallback((index: number): void => {
    setExpandedCardIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleScroll = useCallback(
    (index: number, event: NativeSyntheticEvent<NativeScrollEvent>): void => {
      const offsetX = event.nativeEvent.contentOffset.x;
      setScrollPositions((prev) => ({ ...prev, [index]: offsetX }));
    },
    [],
  );

  const handleDatePress = useCallback(
    (cardIndex: number, dateIndex: number): void => {
      setSelectedDates((prev) => ({
        ...prev,
        [cardIndex]: prev[cardIndex] === dateIndex ? null : dateIndex,
      }));

      const trip = trips[cardIndex];
      if (!trip) return;

      const [sy, sm, sd] = trip.startDate.split('-').map(Number);
      const date = new Date(sy, sm - 1, sd);
      date.setDate(date.getDate() + dateIndex);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      navigation.dispatch(
        CommonActions.navigate('AddSchedule', {
          tripId: trip.tripId,
          tripTitle: trip.title,
          date: dateStr,
          tripStartDate: trip.startDate,
          tripEndDate: trip.endDate,
          placeId: placeParams?.placeId,
          placeName: placeParams?.placeName,
          address: placeParams?.address,
          latitude: placeParams?.latitude,
          longitude: placeParams?.longitude,
        }),
      );
    },
    [trips, navigation, placeParams],
  );

  const handleGoBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-screenBackground"
        edges={['top']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="mt-[6px]">
        <SelectTripHeader onPress={handleGoBack} tripCount={trips.length} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {trips.map((trip, index) => (
          <TripSelectionCard
            key={trip.tripId}
            cardIndex={index}
            expandedCardIndex={expandedCardIndex}
            animatedHeight={getAnimatedHeight(index)}
            animatedOpacity={getAnimatedOpacity(index)}
            scrollPosition={scrollPositions[index] ?? 0}
            selectedDateIndex={selectedDates[index] ?? null}
            dates={generateTripDates(trip.startDate, trip.endDate)}
            onCardPress={handleCardPress}
            onDatePress={handleDatePress}
            onScroll={handleScroll}
            title={trip.title}
            imageUrl={trip.imageUrl}
            startDate={trip.startDate}
            endDate={trip.endDate}
            scheduleCount={trip.scheduleCount}
            tripDayCount={trip.tripDayCount}
            tripStatus={trip.tripStatus}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SelectTripScreen;
export { SelectTripScreen };
