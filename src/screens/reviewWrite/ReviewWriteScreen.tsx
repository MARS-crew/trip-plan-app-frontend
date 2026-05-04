import { StarIconV2, StarOffIconV2 } from '@/assets';
import { PhotoUploader, TopBar } from '@/components/ui';
import { getUpLoadImageUrl, postReviewWrite, uploadToMinio } from '@/services/reviewService';
import { ReviewPhoto, ReviewWriteScreenProps, StarButtonProps } from '@/types/review';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback, useMemo, useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_PHOTOS = 3;
const MAX_CHARS = 500;
const STAR_OPTIONS = [1, 2, 3, 4, 5] as const;

const StarButton = memo(({ star, isFilled, onPress }: StarButtonProps) => {
  return (
    <Pressable
      className="mx-[5px] items-center justify-center"
      onPress={() => onPress(star)}
      accessibilityRole="button"
      accessibilityLabel={`${star}점 선택`}>
      {isFilled ? (
        <StarIconV2 className="h-[38px] w-[38px]" width={37} height={37} />
      ) : (
        <StarOffIconV2 className="h-[38px] w-[38px]" width={37} height={37} />
      )}
    </Pressable>
  );
});

StarButton.displayName = 'StarButton';

const ReviewWriteScreen = ({
  visitedPlaceId,
  placeName = '센소지 아사쿠사',
  visitedDate = '2026.02.28',
}: ReviewWriteScreenProps) => {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [photos, setPhotos] = useState<ReviewPhoto[]>([]);
  const [showRatingError, setShowRatingError] = useState<boolean>(false);

  const navigation = useNavigation();
  const reviewTextLength = reviewText.length;

  const formattedDate = useMemo(() => visitedDate.replace(/\./g, '-'), [visitedDate]);

  const handleStarPress = useCallback((selectedRating: number): void => {
    setRating(selectedRating);
    setShowRatingError(false);
  }, []);

  const handleReviewTextChange = useCallback((text: string): void => {
    setReviewText(text.slice(0, MAX_CHARS));
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (rating === 0) {
      setShowRatingError(true);
      return;
    }
    setShowRatingError(false);

    try {
      // 1. 사진 업로드 → storagePath 수집
      const storagePaths = await Promise.all(
        photos.map(async (photo) => {
          const fileName = photo.fileName ?? `${Date.now()}.jpg`;
          const { uploadUrl, storagePath } = await getUpLoadImageUrl(fileName, 'REVIEW');
          await uploadToMinio(uploadUrl, { uri: photo.uri, type: photo.type });
          return storagePath; // "reviews/1/uuid_123.png"
        }),
      );

      // 2. storagePath를 imageUrls로 전달
      await postReviewWrite({
        visitedPlaceId,
        placeName,
        visitedAt: formattedDate,
        rating,
        content: reviewText.trim(),
        imageUrls: storagePaths, // ← 수정
      });

      Alert.alert('완료', '등록되었습니다!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '리뷰 등록 중 문제가 발생했어요.');
    }
  }, [visitedPlaceId, placeName, formattedDate, rating, reviewText, photos, navigation]);

  // 4. Render
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 bg-white">
        <TopBar title="리뷰 작성" onPress={() => navigation.goBack()} />
        {/* Content */}
        <View className="flex-1 px-5 pb-6 pt-8">
          <Text className="mb-4 text-center font-pretendardBold text-h1 text-black">
            {placeName}
          </Text>

          <View className="mb-6 flex-row items-center justify-center">
            {STAR_OPTIONS.map((star) => (
              <View key={star} className="mx-1">
                <StarButton star={star} isFilled={star <= rating} onPress={handleStarPress} />
              </View>
            ))}
          </View>

          <Text className="mb-2 text-p text-gray">방문 일자 {visitedDate}</Text>

          <View className="mb-[25px] rounded-xl border border-borderGray px-4 py-2">
            <TextInput
              value={reviewText}
              onChangeText={handleReviewTextChange}
              placeholder="리뷰를 작성해주세요"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              className="min-h-[100px] text-h3 text-gray"
              maxLength={MAX_CHARS}
            />

            <Text className="mt-1 text-right text-p text-gray">
              {reviewTextLength}/{MAX_CHARS}
            </Text>
          </View>

          <PhotoUploader photos={photos} maxPhotos={MAX_PHOTOS} onChangePhotos={setPhotos} />
        </View>

        {/* Bottom Submit */}
        <View className="px-5 pb-8 pt-2">
          {showRatingError && (
            <Text className="mb-2 text-xs font-normal text-red-500">
              별점은 최소 1점부터 등록이 가능합니다.
            </Text>
          )}

          <Pressable
            className="w-full rounded-lg bg-main py-4"
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="리뷰 등록하기">
            <Text className="text-center font-pretendardMedium text-h3 tracking-wide text-white">
              등록하기
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export { ReviewWriteScreen };
export default ReviewWriteScreen;
