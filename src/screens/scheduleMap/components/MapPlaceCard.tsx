import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ScheduleIcon } from '@/assets/icons';
import { CategoryChip } from '@/screens/wishList/components';
import type { RoutePoint } from '../types';

interface MapPlaceCardProps {
  place: RoutePoint;
  showAction?: boolean;
  onPressAction?: () => void;
}

const MapPlaceCard: React.FC<MapPlaceCardProps> = ({
  place,
  showAction = true,
  onPressAction,
}) => {
  return (
    <View
      className="h-[112px] w-full rounded-[8px] border border-borderGray bg-white"
      style={{
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="h-[112px] flex-row items-center pr-4">
        <View className="h-28 w-28 shrink-0 overflow-hidden rounded-l-lg">
          <Image source={place.image} className="h-full w-full" resizeMode="cover" />
        </View>

        <View className="ml-3 flex-1 pr-3">
          <Text className="text-h3 font-semibold text-black" numberOfLines={1}>
            {place.title}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text className="text-p text-gray w-[172px]" numberOfLines={2}>
              {place.placeCardDescription}
            </Text>
          </View>

          {place.categories && place.categories.length > 0 && (
            <View className="mt-2 flex-row">
              {place.categories.slice(0, 3).map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  className="mt-1 mr-1 rounded-2xl px-2 py-[2px]"
                />
              ))}
            </View>
          )}
        </View>

        {showAction && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressAction}
            className="px-3 h-[36px] w-[36px] items-center justify-center rounded-[6px] bg-main">
            <ScheduleIcon width={16} height={16} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

MapPlaceCard.displayName = 'MapPlaceCard';

export default MapPlaceCard;
export type { MapPlaceCardProps };
