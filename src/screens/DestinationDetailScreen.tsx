import React, { useCallback } from 'react';
import { View, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IconButton } from '@/screens/destinationDetail/components';
import { Chip } from '@/components/ui';
import { LeftArrowIcon, SaveIcon, ShareIcon, StarIcon, ScheduleIcon, MarkerIcon } from '@/assets/icons';
import type { RootStackParamList } from '@/navigation/types';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const DestinationDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // 1. Hooks
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSave = useCallback(() => {
    // TODO: 저장 기능 구현
  }, []);

  const handleShare = useCallback(() => {
    // TODO: 공유 기능 구현
  }, []);

  // 2. 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="flex-1">
        {/* 헤더 이미지 영역 */}
        <View className="relative w-full h-[300px]">
          <Image
            source={require('@/assets/images/thumnail.png')}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* 왼쪽: 뒤로가기 버튼 */}
          <View className="absolute left-4 top-4">
            <IconButton
              icon={LeftArrowIcon}
              onPress={handleGoBack}
              accessibilityLabel="뒤로가기"
            />
          </View>

          {/* 오른쪽: 저장, 공유 버튼 */}
          <View className="absolute right-4 top-4 flex-row">
            <IconButton
              className="mr-2"
              icon={SaveIcon}
              onPress={handleSave}
              accessibilityLabel="저장"
            />
            <IconButton
              icon={ShareIcon}
              onPress={handleShare}
              accessibilityLabel="공유"
            />
          </View>

          {/* 좌측 하단: 위치 정보 */}
          <View className="absolute left-4 bottom-[19px] flex-row items-center">
            <MarkerIcon />
            <Text className="text-p text-white ml-[6px]">일본, 도쿄</Text>
          </View>
        </View>

        {/* 별 아이콘, 평점, 리뷰, 일정 추가하기 버튼*/}
        <View className="mt-7 px-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <StarIcon />
            <Text className="text-h2 ml-1 font-bold">4.6</Text>
            <Text className="text-p text-gray ml-3">리뷰 56,789개</Text>
          </View>

          <View className="w-[108px] h-9 bg-main rounded-[6px] flex-row items-center justify-center">
            <ScheduleIcon />
            <Text className="text-p text-white ml-[6px]">일정 추가하기</Text>
          </View>
        </View>

        {/* 카테고리 Chip */}
        <View className="mt-7 px-4 flex-row">
          <Chip label="관광지" className="mr-2" />
          <Chip label="문화" className="mr-2" />
          <Chip label="역사" />
        </View>
      </View>
    </SafeAreaView>
  );
};

DestinationDetailScreen.displayName = 'DestinationDetailScreen';

export default DestinationDetailScreen;
export { DestinationDetailScreen };