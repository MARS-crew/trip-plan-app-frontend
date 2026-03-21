import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Animated, Easing, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SelectTripHeader, TripSelectionCard } from '@/screens/selectTrip';
import type { SearchStackParamList } from '@/navigation/types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

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

  const handleCardPress = useCallback((index: number): void => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  }, [expandedCardIndex]);

  const handleScroll = useCallback((index: number, event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setScrollPositions((prev) => ({ ...prev, [index]: offsetX }));
  }, []);

  const handleDatePress = useCallback((cardIndex: number, dateIndex: number): void => {
    setSelectedDates((prev) => ({
      ...prev,
      [cardIndex]: prev[cardIndex] === dateIndex ? null : dateIndex,
    }));
  }, []);
  const handleGoBack = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  // 파생 값
  const dates = React.useMemo(
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

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="mt-[6px]">
        <SelectTripHeader onPress={handleGoBack} />
        {[0, 1].map((cardIndex) => (
          <TripSelectionCard
            key={cardIndex}
            cardIndex={cardIndex}
            expandedCardIndex={expandedCardIndex}
            animatedHeight={animatedHeights[cardIndex]}
            animatedOpacity={animatedOpacities[cardIndex]}
            scrollPosition={scrollPositions[cardIndex] ?? 0}
            selectedDateIndex={selectedDates[cardIndex] ?? null}
            dates={dates}
            onCardPress={handleCardPress}
            onDatePress={handleDatePress}
            onScroll={handleScroll}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};


export default SelectTripScreen;
export { SelectTripScreen };