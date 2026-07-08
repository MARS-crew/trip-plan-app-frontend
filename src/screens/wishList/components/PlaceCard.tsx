import React from 'react';
import { View, Text, Image, TouchableOpacity, type ImageSourcePropType } from 'react-native';
import { CategoryChip, WishContentContainer } from '@/screens/wishList/components';
import { PlaceIcon, HeartIcon, ActiveHeartIcon, VectorIcon } from '@/assets/icons';
import type { PlaceCardProps } from '@/types/wishlist';

interface PlaceImageThumbnailProps {
  hasImage: boolean;
  image?: ImageSourcePropType;
}

const DEFAULT_IMAGE = require('@/assets/images/place_default.png');

const PlaceImageThumbnail: React.FC<PlaceImageThumbnailProps> = ({ hasImage, image }) => (
  <View className="h-28 w-28 shrink-0 overflow-hidden rounded-l-lg">
    {hasImage ? (
      <Image source={image} className="h-full w-full" resizeMode="cover" />
    ) : (
      <View className="h-full w-full items-center justify-center bg-white">
        <Image source={DEFAULT_IMAGE} style={{ width: 64, height: 64 }} resizeMode="contain" />
      </View>
    )}
  </View>
);

export const PlaceCard = React.memo<PlaceCardProps>(
  ({ place, isLiked, onToggleLike, onPress, isTrending = false }) => {
    const hasImage = Boolean(place.image);
    const Container = onPress ? TouchableOpacity : View;
    const containerProps = onPress ? { activeOpacity: 0.85, onPress } : {};

    if (isTrending) {
      return (
        <Container {...containerProps} className="mx-[1px] mb-3">
          <WishContentContainer>
            <View className="flex-row items-center">
              <PlaceImageThumbnail hasImage={hasImage} image={place.image} />
              <View className="ml-3 flex-1 pr-5">
                <Text className="font-pretendardSemiBold text-h3 text-black">{place.title}</Text>
                <View className="mt-[2px]">
                  <Text className="text-p text-gray" numberOfLines={2}>
                    {place.description}
                  </Text>
                </View>
                {/* 카테고리 칩 */}
                {place.categories && (
                  <View className="mt-[6px] flex-row">
                    {place.categories.map((cat, idx) => (
                      <CategoryChip
                        key={idx}
                        label={cat}
                        className="mr-2 rounded-2xl px-2 py-[2px]"
                      />
                    ))}
                  </View>
                )}
              </View>
              <TouchableOpacity className="mr-4" onPress={() => onToggleLike(place.id)}>
                <VectorIcon />
              </TouchableOpacity>
            </View>
          </WishContentContainer>
        </Container>
      );
    }
    return (
      <Container {...containerProps} className="mx-[1px] pb-3">
        <WishContentContainer>
          <View className="flex-row items-center">
            <PlaceImageThumbnail hasImage={hasImage} image={place.image} />
            <View className="ml-3 flex-1 pr-8">
              <Text className="font-pretendardSemiBold text-h3 text-black">{place.title}</Text>
              <View className="mt-1 flex-row">
                <View className="top-[2px] mr-1 h-3 w-3">
                  <PlaceIcon />
                </View>
                <Text className="font-pretendardRegular text-p text-gray">{place.location}</Text>
              </View>
              <View className="mt-2">
                <Text className="font-pretendardRegular text-p text-gray" numberOfLines={2}>
                  {place.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="mr-4 mt-4 shrink-0 self-start"
              onPress={() => onToggleLike(place.id)}>
              {isLiked ? <ActiveHeartIcon /> : <HeartIcon />}
            </TouchableOpacity>
          </View>
        </WishContentContainer>
      </Container>
    );
  },
);

PlaceCard.displayName = 'PlaceCard';
export default PlaceCard;
