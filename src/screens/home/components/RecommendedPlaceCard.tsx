import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

import { MainRecChip } from '@/components/ui';
import type { RecommendedPlace } from '@/types/place';

export interface RecommendedPlaceCardProps {
  place: RecommendedPlace;
}

const CARD_WIDTH = 260;
const MAX_TAGS = 3;

const DEFAULT_IMAGE = require('@/assets/images/place_default.png');

export const RecommendedPlaceCard = React.memo<RecommendedPlaceCardProps>(({ place }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Shadow
      distance={10}
      offset={[0, 0]}
      startColor="#00000025"
      endColor="#00000000"
      paintInside={false}
      style={{ borderRadius: 8, width: CARD_WIDTH }}>
      <View className="overflow-hidden rounded-lg bg-white">
        <View className="relative h-40">
          <Image
            source={place.imageUrl && !imageError ? { uri: place.imageUrl } : DEFAULT_IMAGE}
            className="h-full w-full bg-gray"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <View className="absolute bottom-3 left-4 right-4">
            <Text className="font-pretendardSemiBold text-h2 text-white" numberOfLines={1} ellipsizeMode="tail">{place.name}</Text>
            <Text className="mt-1 font-pretendardSemiBold text-p text-white" numberOfLines={1} ellipsizeMode="tail">
              {place.countryName}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="mb-4 h-8 text-p text-gray" numberOfLines={2}>
            {place.description}
          </Text>
          <View className="flex-row" style={{ minHeight: 28 }}>
            {(place.tags ?? []).slice(0, MAX_TAGS).map((tag, index) => (
              <MainRecChip key={`${place.placeId}-${tag}-${index}`} label={tag} className="mr-[6px]" />
            ))}
          </View>
        </View>
      </View>
    </Shadow>
  );
});

RecommendedPlaceCard.displayName = 'RecommendedPlaceCard';

export default RecommendedPlaceCard;
