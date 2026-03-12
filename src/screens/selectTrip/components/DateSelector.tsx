import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { VectorGrayIcon } from '@/assets/icons';
import { COLORS } from '@/constants';

// ============ Types ============
interface DateItem {
  date: string;
  day: string;
}

interface DateSelectorProps {
  dates: DateItem[];
  selectedDateIndex: number | null;
  scrollPosition: number;
  animatedHeight: Animated.Value;
  animatedOpacity: Animated.Value;
  onDatePress: (dateIndex: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

// ============ Component ============
const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDateIndex,
  scrollPosition,
  animatedHeight,
  animatedOpacity,
  onDatePress,
  onScroll,
}) => {
  return (
    <Animated.View
      className="bg-white flex-row items-center relative overflow-hidden rounded-b-lg"
      style={{
        height: animatedHeight,
        opacity: animatedOpacity,
      }}>
      {/* 왼쪽 아이콘 + 리니어 그라디언트 */}
      <View className="absolute left-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
        {/* 흰색 배경 + 아이콘 */}
        <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
          <View style={{ transform: [{ rotate: '180deg' }] }}>
            <VectorGrayIcon />
          </View>
        </View>
        {/* 리니어 그라디언트 */}
        {scrollPosition > 0 && (
          <LinearGradient
            colors={[
              'rgba(255,255,255,1)',
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,0.2)',
              'rgba(255,255,255,0)',
            ]}
            locations={[0, 0.13, 0.61, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 12, height: '100%', zIndex: 1 }}
          />
        )}
      </View>

      {/* 날짜 스크롤 영역 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 40, paddingRight: 16, gap: 8, alignItems: 'center', paddingVertical: 13 }}
        style={{ flex: 1, height: 64 }}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        onScroll={onScroll}>
        {dates.map((item, index) => {
          const isSelected = selectedDateIndex === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDatePress(index)}
              className={`w-[85px] h-[38px] rounded-lg items-center justify-center ${
                isSelected ? 'border' : 'border border-borderGray'
              }`}
              style={{
                borderColor: isSelected ? COLORS.main : undefined,
                backgroundColor: isSelected ? COLORS.mainLight : 'transparent',
              }}>
              <Text
                className="text-p1 font-medium"
                style={{ color: isSelected ? COLORS.main : COLORS.gray }}>
                {item.date}({item.day})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 오른쪽 리니어 그라디언트 + 아이콘 */}
      <View className="absolute right-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
        {/* 리니어 그라디언트 */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0)',
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0.9)',
            'rgba(255,255,255,1)',
          ]}
          locations={[0, 0.39, 0.87, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 12, height: '100%', zIndex: 1 }}
        />
        {/* 흰색 배경 + 아이콘 */}
        <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
          <VectorGrayIcon />
        </View>
      </View>
    </Animated.View>
  );
};

DateSelector.displayName = 'DateSelector';

export default DateSelector;
export { DateSelector };
export type { DateSelectorProps, DateItem };
