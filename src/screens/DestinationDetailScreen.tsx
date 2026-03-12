import React, { useCallback } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IconButton } from '@/screens/destinationDetail/components';
import { Chip, TabNavigation, ContentContainer } from '@/components/ui';
import {
  LeftArrowIcon,
  SaveIcon,
  ShareIcon,
  StarIcon,
  ScheduleIcon,
  MarkerIcon,
  InfoIcon,
  ReviewIcon,
  ActiveInfoIcon,
  ActiveReviewIcon,
  TimeIcon,
  AddressIcon,
  PlaceIcon,
  VectorIcon,
} from '@/assets/icons';
import type { SearchStackParamList } from '@/navigation/SearchStackNavigator';

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;

// ============ Component ============
const DestinationDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Hooks
  const [activeTab, setActiveTab] = React.useState('info');

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSave = useCallback(() => {
    // TODO: 저장 기능 구현
  }, []);

  const handleShare = useCallback(() => {
    // TODO: 공유 기능 구현
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleAddToSchedule = useCallback(() => {
    navigation.navigate('SelectTrip');
  }, [navigation]);

  // 파생 값
  const tabs = React.useMemo(
    () => [
      { id: 'info', icon: InfoIcon, activeIcon: ActiveInfoIcon, label: '정보' },
      { id: 'review', icon: ReviewIcon, activeIcon: ActiveReviewIcon, label: '리뷰' },
    ],
    [],
  );

  // 렌더링
  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 헤더 이미지 영역 */}
        <View className="relative w-full">
          <Image
            source={require('@/assets/images/thumnail.png')}
            className="w-full"
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
          <View className="absolute left-4 bottom-[19px]">
            <Text className="text-title text-white font-bold mb-[7px]">센소지 아사쿠사</Text>
            <View className="flex-row items-center">
              <MarkerIcon />
              <Text className="text-p text-white ml-[6px] font-medium">도쿄, 일본</Text>
            </View>
          </View>
        </View>
          {/* 별 아이콘, 평점, 리뷰, 일정 추가하기 버튼*/}
          <View className="mt-6 px-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <StarIcon />
              <Text className="text-h2 ml-1 font-bold">4.6</Text>
              <Text className="text-p text-gray ml-3 font-medium">리뷰 56,789개</Text>
            </View>

            <TouchableOpacity
              className="w-[108px] h-9 bg-main rounded-[6px] flex-row items-center justify-center"
              onPress={handleAddToSchedule}>
              <ScheduleIcon />
              <Text className="text-p text-white ml-[6px] font-regular">일정 추가하기</Text>
            </TouchableOpacity>
          </View>

          {/* 카테고리 Chip */}
          <View className="mt-6 px-4 flex-row">
            <Chip label="관광지" className="mr-2" />
            <Chip label="문화" className="mr-2" />
            <Chip label="역사" />
          </View>

          {/* 탭 네비게이션 */}
          <View className="mt-9 px-4 mb-5">
            <TabNavigation
              tabs={tabs}
              activeTabId={activeTab}
              onTabChange={handleTabChange}
            />
          </View>

          {/* 컨텐츠 영역 */}
          <View className="px-4">
            {activeTab === 'info' ? (
              <>
                <ContentContainer className="p-4">
                  <Text className="text-h4 font-semibold mb-2">소개</Text>
                  <Text className="text-p text-gray font-medium">
                    도쿄에서 가장 오래된 불교 사원으로, 웅장한 카미나리몬과 나카미세 거리가 유명합니다.
                  </Text>
                </ContentContainer>
            <View className="mt-5">
              <ContentContainer className="w-[181px]">
                <View className="flex-row items-center ml-4 mt-[14px] mb-[14px]">
                  <View className="w-9 h-9 bg-contentBackground rounded-lg items-center justify-center">
                    <TimeIcon />
                  </View>
                  <View className="ml-[13px]">
                    <Text className="text-p text-gray font-regular">영업시간</Text>
                    <View className="mt-1">
                      <Text className="text-p text-black font-regular">06:00 - 17:00</Text>
                    </View>
                  </View>
                </View>
              </ContentContainer>
            </View>
            <View className="mt-5">
              <ContentContainer>
                <View className="flex-row items-center ml-4 mt-[14px] mb-[14px]">
                  <View className="w-9 h-9 bg-contentBackground rounded-lg items-center justify-center">
                    <AddressIcon />
                  </View>
                  <View className="ml-[13px]">
                    <Text className="text-p text-gray font-regular">주소</Text>
                    <View className="mt-1">
                      <Text className="text-p text-black font-regular">2 Chrome-3-1 Asakusa, Taito City, Tokyo</Text>
                    </View>
                  </View>
                </View>
              </ContentContainer>
            </View>
            <View className="mt-5">
              <Text className="text-h4 text-black font-semibold">주변 추천 장소</Text>
            </View>
            <View className="mt-3">
              <ContentContainer>
                <View className="flex-row items-center justify-between ml-4 my-3">
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 bg-chip rounded-lg items-center justify-center">
                      <PlaceIcon />
                    </View>
                    <View className="ml-3">
                      <Text className="text-p1 text-black font-medium">도쿄 스카이트리</Text>
                    </View>
                  </View>
                  <View className="mr-4">
                    <VectorIcon />
                  </View>
                </View>
              </ContentContainer>
            </View>
            <View className="mt-2">
              <ContentContainer>
                <View className="flex-row items-center justify-between ml-4 my-3">
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 bg-chip rounded-lg items-center justify-center">
                      <PlaceIcon />
                    </View>
                    <View className="ml-3">
                      <Text className="text-p1 text-black font-medium">우에노 공원</Text>
                    </View>
                  </View>
                  <View className="mr-4">
                    <VectorIcon />
                  </View>
                </View>
              </ContentContainer>
            </View>
            <View className="mt-2 mb-[26px]">
              <ContentContainer>
                <View className="flex-row items-center justify-between ml-4 my-3">
                  <View className="flex-row items-center">
                    <View className="w-9 h-9 bg-chip rounded-lg items-center justify-center">
                      <PlaceIcon />
                    </View>
                    <View className="ml-3">
                      <Text className="text-p1 text-black font-medium">아메요코 시장</Text>
                    </View>
                  </View>
                  <View className="mr-4">
                    <VectorIcon />
                  </View>
                </View>
              </ContentContainer>
            </View>
              </>
            ) : (
              // TODO: 리뷰 탭 컨텐츠 구현 필요
              <View>
                <Text className="text-p text-gray">여기에 리뷰 작성 고고싱</Text>
              </View>
            )}
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

DestinationDetailScreen.displayName = 'DestinationDetailScreen';

export default DestinationDetailScreen;
export { DestinationDetailScreen };