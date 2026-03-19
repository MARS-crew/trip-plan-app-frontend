import { StarIcon, StarOffIcon } from '@/assets';
import { ContentContainer } from '@/components/ui';
import React from 'react';
import { Image, Text, View } from 'react-native';

// ============ Types ============
export interface ReviewCardProps {
  profileName: string;
  visitDt: string;
  scope: number;
  content?: string;
  imageList?: string[];
}

export interface StarRatingProps {
  score: number;
  max?: number;
}

// ============ Sub Component: StarRating ============
const StarRating = ({ score, max = 5 }: StarRatingProps): React.JSX.Element => (
  <View className="flex-row gap-1">
    {Array.from({ length: max }, (_, i) =>
      i < score ? <StarIcon key={i} className="bg-yellow-400" /> : <StarOffIcon key={i} className="bg-gray-300" />,
    )}
  </View>
);

// ============ Component ============
export const ReviewCard = React.memo<ReviewCardProps>(
  ({ profileName, visitDt, scope, content, imageList }) => {
    return (
      <View className="mb-4">
        <ContentContainer>
          <View className="p-4">
            {/* Header: 프로필 + 별점 */}
            <View className="flex-row items-center justify-between mb-4">
              {/* 프로필 영역 */}
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-full bg-main/20 z-50" />
                <View className="gap-0.5">
                  <Text className="text-h3 text-black">{profileName}</Text>
                  <Text className="text-p text-gray">방문 날짜 {visitDt}</Text>
                </View>
              </View>
              {/* 별점 */}
              <StarRating score={scope} />
            </View>

            {/* 리뷰 본문 */}
            {content && <Text className="text-p text-gray">{content}</Text>}

            {/* 이미지 리스트 */}
            {imageList?.length ? (
              <View className="flex-row gap-2 mt-2">
                {imageList.slice(0, 3).map((uri, idx) => (
                  <Image key={`${uri}-${idx}`} source={{ uri }} className="w-28 h-28 rounded-lg" />
                ))}
              </View>
            ) : null}
          </View>
        </ContentContainer>
      </View>
    );
  },
);

ReviewCard.displayName = 'ReviewCard';
