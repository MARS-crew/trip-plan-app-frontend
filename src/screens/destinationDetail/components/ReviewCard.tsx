import { StarIcon, StarOffIcon } from '@/assets';
import { ContentContainer } from '@/components/ui';
import { ReviewCardProps, StarRatingProps } from '@/types/review';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const StarRating = ({ score, max = 5 }: StarRatingProps): React.JSX.Element => (
  <View className="flex-row gap-1">
    {Array.from({ length: max }, (_, i) =>
      i < score ? (
        <StarIcon key={i} className="bg-yellow-400" />
      ) : (
        <StarOffIcon key={i} className="bg-gray-300" />
      ),
    )}
  </View>
);

export const ReviewCard = React.memo<ReviewCardProps>(
  ({ nickname, visitedDate, rating, content, imageUrls }) => {
    return (
      <View className="mb-4">
        <ContentContainer>
          <View className="p-4">
            {/* Header: 프로필 + 별점 */}
            <View className="mb-4 flex-row items-center justify-between">
              {/* 프로필 영역 */}
              <View className="flex-row items-center gap-3">
                <View className="z-50 h-9 w-9 rounded-full bg-main/20" />
                <View className="gap-0.5">
                  <Text className="text-h3 text-black">{nickname}</Text>
                  <Text className="text-p text-gray">방문 날짜 {visitedDate}</Text>
                </View>
              </View>
              {/* 별점 */}
              <StarRating score={rating} />
            </View>

            {/* 리뷰 본문 */}
            {content && <Text className="text-p text-gray">{content}</Text>}

            {/* 이미지 리스트 */}
            {imageUrls?.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-2"
                contentContainerStyle={{ gap: 4 }}>
                {imageUrls.slice(0, 3).map((uri, idx) => (
                  <Image key={`${uri}-${idx}`} source={{ uri }} className="h-28 w-28 rounded-lg" />
                ))}
              </ScrollView>
            ) : null}
          </View>
        </ContentContainer>
      </View>
    );
  },
);

ReviewCard.displayName = 'ReviewCard';
