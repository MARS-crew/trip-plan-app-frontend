import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Text, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Animated, Easing } from 'react-native';

import type { SearchStackParamList } from '@/navigation/SearchStackNavigator';
import { TripCard } from './components';
import type { DateItem } from './components';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

interface TripData {
  id: number;
  destination: string;
  thumbnailSource: any;
  startDate: string;
  endDate: string;
  scheduleCount: number;
  duration: number;
  status?: 'traveling' | 'planned' | 'completed';
}

// ============ Component ============
const SelectTripScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Hooks
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [scrollPositions, setScrollPositions] = useState<{ [key: number]: number }>({ 0: 0, 1: 0 });
  const [selectedDates, setSelectedDates] = useState<{ [key: number]: number | null }>({ 0: null, 1: null });
  
  // 애니메이션 값
  const animatedHeights = useRef<{ [key: number]: Animated.Value }>({
    0: new Animated.Value(0),
    1: new Animated.Value(0),
  }).current;
  
  const animatedOpacities = useRef<{ [key: number]: Animated.Value }>({
    0: new Animated.Value(0),
    1: new Animated.Value(0),
  }).current;

  useEffect(() => {
    [0, 1].forEach((index) => {
      const isExpanded = expandedCardIndex === index;
      Animated.parallel([
        Animated.timing(animatedHeights[index], {
          toValue: isExpanded ? 64 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(animatedOpacities[index], {
          toValue: isExpanded ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    });
  }, [expandedCardIndex, animatedHeights, animatedOpacities]);

  const handleCardPress = useCallback((index: number) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  }, [expandedCardIndex]);

  const handleScroll = useCallback((index: number, event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setScrollPositions((prev) => ({ ...prev, [index]: offsetX }));
  }, []);

  const handleDatePress = useCallback((cardIndex: number, dateIndex: number) => {
    setSelectedDates((prev) => ({
      ...prev,
      [cardIndex]: prev[cardIndex] === dateIndex ? null : dateIndex,
    }));
  }, []);

  // 파생 값
  const dates = useMemo<DateItem[]>(
    () => [
      { date: '2/28', day: '토' },
      { date: '3/1', day: '일' },
      { date: '3/2', day: '월' },
      { date: '3/3', day: '화' },
      { date: '3/4', day: '수' },
      { date: '3/5', day: '목' },
      { date: '3/6', day: '금' },
    ],
    [],
  );

  const trips = useMemo<TripData[]>(
    () => [
      {
        id: 0,
        destination: '도쿄',
        thumbnailSource: require('@/assets/images/thumnail2.png'),
        startDate: '2026.02.28',
        endDate: '2026.03.03',
        scheduleCount: 5,
        duration: 4,
        status: 'traveling',
      },
      {
        id: 1,
        destination: '도쿄',
        thumbnailSource: require('@/assets/images/thumnail2.png'),
        startDate: '2026.02.28',
        endDate: '2026.03.03',
        scheduleCount: 5,
        duration: 4,
      },
    ],
    [],
  );

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="mt-[6px] ml-4">
        <Text className="text-h text-black font-bold">추가할 여행 선택</Text>
        <Text className="text-p text-gray font-regular">{trips.length}개의 여행이 있어요</Text>
        
        {/* 여행 정보 카드 목록 */}
        {trips.map((trip) => (
          <View key={trip.id} className="mt-4">
            <TripCard
              index={trip.id}
              isExpanded={expandedCardIndex === trip.id}
              status={trip.status}
              destination={trip.destination}
              thumbnailSource={trip.thumbnailSource}
              startDate={trip.startDate}
              endDate={trip.endDate}
              scheduleCount={trip.scheduleCount}
              duration={trip.duration}
              dates={dates}
              selectedDateIndex={selectedDates[trip.id] ?? null}
              scrollPosition={scrollPositions[trip.id] ?? 0}
              animatedHeight={animatedHeights[trip.id]}
              animatedOpacity={animatedOpacities[trip.id]}
              onCardPress={() => handleCardPress(trip.id)}
              onDatePress={(dateIndex) => handleDatePress(trip.id, dateIndex)}
              onScroll={(event) => handleScroll(trip.id, event)}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

SelectTripScreen.displayName = 'SelectTripScreen';

export default SelectTripScreen;
export { SelectTripScreen };
