import React from 'react';
import { View, Text } from 'react-native';

import { MarkerGrayIcon } from '@/assets/icons';

export interface TripDetailCardProps {
  order: number;
  title: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
}

const TripDetailCard: React.FC<TripDetailCardProps> = ({
  order,
  title,
  location,
  description,
  startTime,
  endTime,
}) => {
  return (
    <View className="h-[90px] w-[370px] flex-row items-start justify-between rounded-[16px] border border-borderGray bg-white px-4 py-4">
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

      <View className="h-full items-end justify-center">
        <Text className="text-p font-bold text-main">{startTime}</Text>
        <Text className="mt-1 text-p text-gray">{endTime}</Text>
      </View>
    </View>
  );
};

TripDetailCard.displayName = 'TripDetailCard';

export default TripDetailCard;
export { TripDetailCard };