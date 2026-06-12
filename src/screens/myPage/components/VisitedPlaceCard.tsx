import React, { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import MarkerGrayIcon from '@/assets/icons/marker-gray.svg';
import VectorGrayIcon from '@/assets/icons/vectorgray.svg';
import { CARD_SHADOW_SUBTLE } from '@/constants';
import type { VisitedPlaceCardProps } from '../types/myPage.types';

const PLACEHOLDER_IMAGE = require('@/assets/images/thumnail.png');

const VisitedPlaceCard: React.FC<VisitedPlaceCardProps> = ({
  item,
  onPressDetail,
  onPressReview,
}) => {
  const handlePressDetail = useCallback((): void => {
    onPressDetail(item);
  }, [item, onPressDetail]);

  const handlePressReview = useCallback((): void => {
    onPressReview(item);
  }, [item, onPressReview]);

  return (
    <View className="overflow-hidden rounded-lg bg-white" style={CARD_SHADOW_SUBTLE}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePressDetail}
        className="flex-row px-3 py-3">
        <Image
          source={item.imageUrl ? { uri: item.imageUrl } : PLACEHOLDER_IMAGE}
          className="h-28 w-28 rounded-lg"
          resizeMode="cover"
        />

        <View className="ml-3 flex-1 justify-center">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-2">
              <Text className="font-pretendardSemiBold text-h3 text-black">{item.title}</Text>
              <View className="mb-2 mt-0.5 flex-row items-center">
                <MarkerGrayIcon width={12} height={12} className="mt-px" />
                <Text className="ml-1 text-p text-gray">{item.location}</Text>
              </View>
              {item.tags.length > 0 && (
                <View className="mt-0.5 flex-row gap-1.5">
                  {item.tags.map((tag) => (
                    <View key={`${item.id}-${tag}`} className="rounded-2xl bg-chip px-2 py-0.5">
                      <Text className="text-p text-gray">{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <VectorGrayIcon width={14} height={14} />
          </View>
        </View>
      </TouchableOpacity>

      <View className="h-px bg-chip" />

      <View className="p-3">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePressReview}
          className="h-11 items-center justify-center rounded-lg border border-borderGray bg-inputBackground">
          <Text className="text-p3 text-center font-pretendardSemiBold text-black">
            {item.reviewCta}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

VisitedPlaceCard.displayName = 'VisitedPlaceCard';

const MemoizedVisitedPlaceCard = React.memo(VisitedPlaceCard);

export default MemoizedVisitedPlaceCard;
export { MemoizedVisitedPlaceCard as VisitedPlaceCard };
