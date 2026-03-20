import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { TripStatusChip } from '@/components/ui';
import {
  PlaceIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@/assets/icons';

export interface TripCardProps {
  city: string;
  dateText: string;
  scheduleText: string;
  imageSource: any;
  status: 'traveling' | 'scheduled' | 'completed';
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

const TripCard = ({
  city,
  dateText,
  scheduleText,
  imageSource,
  status,
  isOpen,
  onToggle,
  children,
}: TripCardProps) => {

  return (
    <View
      className="mt-6 rounded-[8px] bg-white"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <View className="overflow-hidden rounded-[8px]">
        <View className="relative">
          <Image source={imageSource} className="h-[144px] w-full" resizeMode="cover" />

          <View pointerEvents="none"/>

        {/*TripStatusChip*/}
          <View className="absolute top-2 left-2">
            <TripStatusChip status={status} />
          </View>

        {/*City*/}
          <View className="absolute bottom-5 left-4">
            <Text className="ml-[1.2px] text-h1 font-bold text-white">{city}</Text>

        {/*Date*/}
            <View className="flex-row items-center">
              <CalendarIcon width={12} height={12} />
              <Text className="ml-[4px] text-p1 text-white">{dateText}</Text>
            </View>
          </View>
        </View>

        {/*schedule*/}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
            <PlaceIcon width={14} height={14} />
            <Text className="ml-1 text-p text-gray">{scheduleText}</Text>
          </View>

        {/*Toggle*/}
          <Pressable onPress={onToggle}>
            <View className="flex-row items-center">
              <Text className="text-p text-main">
                {isOpen ? '일정 접기 ' : '전체 보기 '}
              </Text>

              {isOpen ? (
                <ChevronUpIcon width={14} height={14} />
              ) : (
                <ChevronDownIcon width={14} height={14} />
              )}
            </View>
          </Pressable>
        </View>

        {isOpen && <View className="border-t border-chip px-4 py-4">{children}</View>}
      </View>
    </View>
  );
};

export default TripCard;