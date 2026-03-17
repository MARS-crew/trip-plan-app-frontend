import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PlaceIcon } from '@/assets/icons';

import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  PlaceIcon,
  VectorLeftIcon,
  VectorIcon,
} from '@/assets/icons';

export interface TripTimelineItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  description?: string;
}

export interface TripTimelineProps {
  items: TripTimelineItem[];
}

const TripTimeline: React.FC<TripTimelineProps> = ({ items }) => {
  if (!items.length) {
    return null;
  }

  const dateItems = ['2/28(토)', '3/1(일)', '3/2(월)', '3/3(화)'];
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const handleSelectDate = useCallback((index: number) => {
    setSelectedDateIndex(index);
  }, []);

  const handlePressPrev = useCallback(() => {
    setSelectedDateIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handlePressNext = useCallback(() => {
    setSelectedDateIndex((prev) =>
      prev < dateItems.length - 1 ? prev + 1 : prev,
    );
  }, [dateItems.length]);

  return (
    <View className="relative pb-2">
      <View className="mb-6 flex-row items-center">
        <View className="mr-1 h-[52px] w-[20px] items-center justify-center">
          <Text className="text-[26px] text-gray">‹</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressPrev}
          className=" h-6 w-2 items-center justify-center">
          <VectorLeftIcon />
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          className="flex-1"
        >
          {dateItems.map((date, index) => {
            const isSelected = index === 0;
        <View className="relative flex-1">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="flex-1">
            {dateItems.map((date, index) => {
              const isSelected = index === selectedDateIndex;

            return (
              <View
                key={date}
                className={`h-[38px] w-[85px] items-center justify-center rounded-[8px] border ${
                  isSelected ? 'border-main  bg-[#DF6C201A]' : 'border-[#E5E0DC] bg-white'
                } ${index !== dateItems.length - 1 ? 'mr-2' : ''}`}
              >
                <Text className={`text-p1 ${isSelected ? 'text-main' : 'text-gray'}`}>
                  {date}
                </Text>
              </View>
            );
          })}
        </ScrollView>
              return (
                <TouchableOpacity
                  key={date}
                  activeOpacity={0.8}
                  onPress={() => handleSelectDate(index)}
                  className={`h-[38px] w-[85px] items-center justify-center rounded-[8px] border ${
                    isSelected ? 'border-main bg-[#DF6C201A]' : 'border-[#E5E0DC] bg-white'
                  } ${index !== dateItems.length - 1 ? 'mr-2' : ''}`}>
                  <Text className={`text-p1 ${isSelected ? 'text-main' : 'text-gray'}`}>
                    {date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,1)',
              'rgba(255,255,255,1)',
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,0.2)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 20,
            }}
          />

          <LinearGradient
            pointerEvents="none"
            colors={[
              'rgba(255,255,255,0.2)',
              'rgba(255,255,255,0.9)',
              'rgba(255,255,255,1)',
              'rgba(255,255,255,1)',
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 20,
            }}
          />
        <View className="ml-1 h-[52px] w-[20px] items-center justify-center">
          <Text className="text-[26px] text-gray">›</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressNext}
          className=" h-6 w-2 items-center justify-center">
          <VectorIcon />
        </TouchableOpacity>
      </View>

      <View className="absolute bottom-0 left-[39px] top-[78px] w-[1px] bg-[#E5E0DC]" />

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={item.id} className={`${isLast ? '' : 'mb-4'} flex-row items-start`}>
            <View className="w-[78px] items-center">
              <View className="h-[58px] w-[58px] rounded-[8px] bg-[#DF6C201A] py-3">
                <Text className="text-center text-p font-bold text-main">{item.startTime}</Text>
                <View className="items-center">
                  <View className="border-t border-[#E5E0DC] w-4" />
                </View>
                <Text className="text-center text-p text-gray">{item.endTime}</Text>
              </View>
            </View>

            <View className="ml-1 flex-1 self-start rounded-[8px] bg-[#F4F0EC80] px-4 py-3">
              <Text className="text-h3 font-semibold text-black">{item.title}</Text>

              <View className="mt-[2px] flex-row items-center">
                <PlaceIcon width={12} height={12} />
                <Text className="ml-1 text-p text-gray">{item.location}</Text>
              </View>

              {item.description ? (
                <Text className="mt-[2px] text-p text-gray">{item.description}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default TripTimeline;