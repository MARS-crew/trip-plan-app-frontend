import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { MarkerGrayIcon } from '@/assets/icons';

export interface TripDetailCardProps {
  order: number;
  title: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  isCurrentSchedule?: boolean;
  currentStatusText?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  onPressCard?: () => void;
}

const TripDetailCard: React.FC<TripDetailCardProps> = ({
  order,
  title,
  location,
  description,
  startTime,
  endTime,
  isCurrentSchedule = false,
  currentStatusText = '현재 진행되는 일정입니다',
  actionLabel = '방문지 저장',
  onPressAction,
  onPressCard,
}) => {
  return (
    <Pressable
      onPress={onPressCard}
      disabled={!onPressCard}
      className="w-[370px] rounded-[8px] border border-borderGray bg-white px-3 py-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-start">
          <View className="mr-4 h-9 w-9 items-center justify-center rounded-full bg-main">
            <Text className="text-h3 font-semibold text-white">{order}</Text>
          </View>

          <View className="flex-1 pr-4">
            <Text className="text-h3 font-semibold text-black">{title}</Text>

            <View className="mt-1 flex-row items-center">
              <MarkerGrayIcon width={12} height={12} />
              <Text className="ml-1 text-p text-gray">{location}</Text>
            </View>

            <Text className="mt-1 text-p text-gray">{description}</Text>
          </View>
        </View>

        <View className="mt-2 items-end justify-center">
          <Text className="text-p font-bold text-main">{startTime}</Text>
          <Text className="mt-1 text-p text-gray">{endTime}</Text>
        </View>
      </View>

      {isCurrentSchedule ? (
        <View className="mt-5 flex-row items-center justify-between">
          <Text className="text-p text-gray">{currentStatusText}</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressAction}
            className="h-[36px] w-[75px] items-center justify-center rounded-[6px] bg-main">
            <Text className="text-p text-white">{actionLabel}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </Pressable>
  );
};

TripDetailCard.displayName = 'TripDetailCard';

export default TripDetailCard;
export { TripDetailCard };