import React from 'react';
import { View, Text, Image, TouchableOpacity, type ImageSourcePropType } from 'react-native';
import { ContentContainer } from '@/components/ui';
import { CategoryChip, WishContentContainer } from '@/screens/wishList/components';
import { PlaceIcon, HeartIcon, ActiveHeartIcon, VectorIcon } from '@/assets/icons';
import type { PlaceCardProps } from '@/types/wishlist';

interface PlaceImageThumbnailProps {
  hasImage: boolean;
  image?: ImageSourcePropType;
}

const PlaceImageThumbnail: React.FC<PlaceImageThumbnailProps> = ({ hasImage, image }) => (
  <View className="w-28 h-28 rounded-l-lg overflow-hidden shrink-0">
    {hasImage ? (
      <Image source={image} className="w-full h-full" resizeMode="cover" />
    ) : (
      <View className="h-full w-full items-center justify-center bg-chip px-2">
        <Text className="text-center text-p text-gray">이미지 없음</Text>
      </View>
    )}
  </View>
);

export const PlaceCard = React.memo<PlaceCardProps>(
  ({ place, isLiked, onToggleLike, isTrending = false }) => {
    const hasImage = Boolean(place.image);

    if (isTrending) {
      return (
        <View className="mx-[1px] mb-3">
          <WishContentContainer>
            <View className="flex-row items-center">
<<<<<<< HEAD
              <PlaceImageThumbnail hasImage={hasImage} image={place.image} />
              <View className="flex-1 ml-3 pr-5">
                <Text className="text-h3 text-black font-pretendardSemiBold">{place.title}</Text>
=======
              <View className="h-28 w-28 shrink-0 overflow-hidden rounded-l-lg">
                <Image source={place.image} className="h-full w-full" resizeMode="cover" />
              </View>
              <View className="ml-3 flex-1 pr-5">
                <Text className="font-pretendardSemiBold text-h3 text-black">{place.title}</Text>
>>>>>>> f6035190d7f1b55cb21b4ba84ae66fa8aa266524
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
        </View>
      );
    }
    return (
      <View className="mx-[1px] pb-3">
        <WishContentContainer>
          <View className="flex-row items-center">
<<<<<<< HEAD
            <PlaceImageThumbnail hasImage={hasImage} image={place.image} />
            <View className="flex-1 ml-3 pr-8">
              <Text className="text-h3 text-black font-pretendardSemiBold">{place.title}</Text>
              <View className="flex-row mt-1">
                <View className="w-3 h-3 top-[2px] mr-1">
=======
            <View className="h-28 w-28 shrink-0 overflow-hidden rounded-l-lg">
              <Image source={place.image} className="h-full w-full" resizeMode="cover" />
            </View>
            <View className="ml-3 flex-1 pr-8">
              <Text className="font-pretendardSemiBold text-h3 text-black">{place.title}</Text>
              <View className="mt-1 flex-row">
                <View className="top-[2px] mr-1 h-3 w-3">
>>>>>>> f6035190d7f1b55cb21b4ba84ae66fa8aa266524
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
      </View>
    );
  },
);

PlaceCard.displayName = 'PlaceCard';
export default PlaceCard;
