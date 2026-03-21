import React from 'react';
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import LinearGradient from 'react-native-linear-gradient';

import { MarkerGrayIcon, ScheduleIcon, VectorGrayIcon } from '@/assets/icons';
import { COLORS } from '@/constants';
import { TripStatusChip } from '@/components/ui';

export interface TripDateItem {
  date: string;
  day: string;
}

export interface TripSelectionCardProps {
  cardIndex: number;
  expandedCardIndex: number | null;
  animatedHeight: Animated.Value;
  animatedOpacity: Animated.Value;
  scrollPosition: number;
  selectedDateIndex: number | null;
  dates: TripDateItem[];
  onCardPress: (index: number) => void;
  onDatePress: (cardIndex: number, dateIndex: number) => void;
  onScroll: (index: number, event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const TripSelectionCard: React.FC<TripSelectionCardProps> = ({
  cardIndex,
  expandedCardIndex,
  animatedHeight,
  animatedOpacity,
  scrollPosition,
  selectedDateIndex,
  dates,
  onCardPress,
  onDatePress,
  onScroll,
}) => {
  return (
    <View className="mt-4 mx-4">
      <View className="bg-white overflow-hidden" style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
        <TouchableOpacity activeOpacity={0.9} onPress={(): void => onCardPress(cardIndex)}>
          <View
            className="overflow-hidden relative"
            style={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Image source={require('@/assets/images/thumnail2.png')} className="w-full" resizeMode="cover" />
            {cardIndex === 0 ? (
              <View className="absolute top-[13px] left-[15px]">
                <TripStatusChip status="traveling" />
              </View>
            ) : null}
            <View className="absolute bottom-[14px] left-3">
              <Text className="text-h1 text-white font-bold mb-1">도쿄</Text>
              <View className="flex-row items-center">
                <ScheduleIcon width={12} height={12} />
                <Text className="text-p text-white font-regular ml-1">일정</Text>
                <Text className="text-p text-white font-regular ml-[2px]">2026.02.28 ~ 2026.03.03</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Shadow
        distance={2}
        startColor="#00000025"
        endColor="#00000000"
        offset={[0, 0]}
        paintInside={false}
        containerStyle={{ width: '100%', alignSelf: 'stretch' }}
        style={{
          borderRadius: 8,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          width: '100%',
        }}
      >
        <View
          className="bg-white overflow-hidden"
          style={{
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={(): void => onCardPress(cardIndex)}>
            <View className={`${expandedCardIndex === cardIndex ? 'border-b border-chip' : 'rounded-b-lg'}`}>
              <View className="p-4 flex-row items-center">
                <MarkerGrayIcon />
                <Text className="text-p text-gray font-regular ml-1">5개의 일정</Text>
                <Text className="text-p text-gray font-regular ml-3">4일간</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Animated.View
            className="bg-white flex-row items-center relative overflow-hidden rounded-b-lg"
            style={{
              height: animatedHeight,
              opacity: animatedOpacity,
            }}
          >
            <View className="absolute left-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
              <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
                <View style={{ transform: [{ rotate: '180deg' }] }}>
                  <VectorGrayIcon />
                </View>
              </View>
              {scrollPosition > 0 ? (
                <LinearGradient
                  colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
                  locations={[0, 0.13, 0.61, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ width: 12, height: '100%', zIndex: 1 }}
                />
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 40, paddingRight: 16, gap: 8, alignItems: 'center', paddingVertical: 13 }}
              style={{ flex: 1, height: 64 }}
              nestedScrollEnabled
              scrollEventThrottle={16}
              onScroll={(event): void => onScroll(cardIndex, event)}
            >
              {dates.map((item, index) => {
                const isSelected = selectedDateIndex === index;
                return (
                  <TouchableOpacity
                    key={`${item.date}-${item.day}-${index}`}
                    onPress={(): void => onDatePress(cardIndex, index)}
                    className={`w-[85px] h-[38px] rounded-lg items-center justify-center ${
                      isSelected ? 'border' : 'border border-borderGray'
                    }`}
                    style={{
                      borderColor: isSelected ? COLORS.main : undefined,
                      backgroundColor: isSelected ? 'rgba(223, 108, 32, 0.102)' : 'transparent',
                    }}
                  >
                    <Text className="text-p1 font-medium" style={{ color: isSelected ? COLORS.main : COLORS.gray }}>
                      {item.date}({item.day})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View className="absolute right-0 top-0 bottom-0 flex-row items-center z-10" pointerEvents="none">
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,1)']}
                locations={[0, 0.39, 0.87, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ width: 12, height: '100%', zIndex: 1 }}
              />
              <View className="w-10 h-full bg-white justify-center items-center" style={{ zIndex: 2 }}>
                <VectorGrayIcon />
              </View>
            </View>
          </Animated.View>
        </View>
      </Shadow>
    </View>
  );
};

TripSelectionCard.displayName = 'TripSelectionCard';
