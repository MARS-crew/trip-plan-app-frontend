import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import type { PlaceCardProps } from '@/types/placeCard';

const THUMBNAIL_IMAGE = require('@/assets/images/thumnail.png');
const SaveIcon = require('@/assets/icons/activebookmark.svg').default;
const StarIcon = require('@/assets/icons/star.svg').default;
const LocationIcon = require('@/assets/icons/location.svg').default;

const PlaceCard: React.FC<PlaceCardProps> = ({
  title,
  region,
  rating,
  categoryLabel,
  imageUrl,
  onPress,
  onBookmarkPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="overflow-hidden rounded-lg bg-white"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 1,
      }}>
      <View className="relative aspect-[181/128] w-full bg-black">
        <Image
          source={imageUrl ? { uri: imageUrl } : THUMBNAIL_IMAGE}
          className="h-full w-full"
          resizeMode="cover"
        />

        <TouchableOpacity
          className="bg-bookmarkBackground absolute right-2.5 top-2.5 h-7 w-7 items-center justify-center rounded-full"
          onPress={onBookmarkPress}
          activeOpacity={0.7}>
          <View className="h-3.5 w-3.5 items-center justify-center">
            <SaveIcon width={14} height={14} />
          </View>
        </TouchableOpacity>

        <View className="absolute bottom-0 left-0 right-0 px-2.5 pb-2">
          <Text className="mb-0.5 font-pretendardSemiBold text-sm text-white">{title}</Text>
          <View className="flex-row items-center">
            <LocationIcon width={10} height={10} className="mr-1" />
            <Text className="font-pretendardRegular text-xs text-white">{region}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between bg-white px-2.5 py-2">
        <View className="rounded-full bg-chip px-2.5 py-0.5">
          <Text className="font-pretendardRegular text-p text-black">{categoryLabel}</Text>
        </View>
        <View className="flex-row items-center">
          <StarIcon width={12} height={12} className="mr-0.5" />
          <Text className="text-left text-xs text-black">{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

PlaceCard.displayName = 'PlaceCard';

export default PlaceCard;
export { PlaceCard };
