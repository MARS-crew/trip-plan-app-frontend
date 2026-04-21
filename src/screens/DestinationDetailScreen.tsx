import React, { useCallback } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { IconButton, InfoTabContent, ReviewCard } from '@/screens/destinationDetail/components';
import { Chip, TabNavigation, ContentContainer } from '@/components/ui';
import {
  LeftArrowIcon,
  SaveIcon,
  ActiveBookmarkIcon,
  ShareIcon,
  StarIcon,
  ScheduleIcon,
  MarkerIcon,
  InfoIcon,
  ReviewIcon,
  ActiveInfoIcon,
  ActiveReviewIcon,
} from '@/assets/icons';
import type { RootTabParamList, SearchStackParamList } from '@/navigation/types';

//예시 값
const ratings = [
  { label: '5점', count: 20000 },
  { label: '4점', count: 13000 },
  { label: '3점', count: 2500 },
  { label: '2점', count: 800 },
  { label: '1점', count: 489 },
];

// ============ Types ============
type NavigationProp = NativeStackNavigationProp<SearchStackParamList>;
type DetailRouteProp = RouteProp<SearchStackParamList, 'DestinationDetail'>;
type TabNavigationProp = BottomTabNavigationProp<RootTabParamList>;

// ============ Component ============
const DestinationDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<DetailRouteProp>();
  const origin = params?.origin ?? 'search';
  const initialTab = params?.initialTab ?? 'info';
  const placeId = Number(params?.destinationId ?? '0');

  // Hooks
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handleGoBack = useCallback((): void => {
    if (origin === 'bookmark') {
      const tabNavigation = navigation.getParent<TabNavigationProp>();
      if (tabNavigation) {
        tabNavigation.navigate('Search', { screen: 'SearchMain' });
        tabNavigation.navigate('Bookmark');
        return;
      }
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('SearchMain');
  }, [navigation, origin]);

  const handleSave = useCallback((): void => {
    setIsBookmarked((prevState) => !prevState);
  }, []);

  const handleShare = useCallback((): void => {
    // TODO: 공유 기능 구현
  }, []);

  const handleTabChange = useCallback((tabId: string): void => {
    if (tabId === 'info' || tabId === 'review') {
      setActiveTab(tabId);
    }
  }, []);

  const handleAddToSchedule = useCallback((): void => {
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

  const maxCount = Math.max(...ratings.map(r => r.count));

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
              iconSize={24}
              className="mr-2"
              icon={isBookmarked ? ActiveBookmarkIcon : SaveIcon}
              onPress={handleSave}
              accessibilityLabel="저장"
            />
            <IconButton
              iconSize={16}
              icon={ShareIcon}
              onPress={handleShare}
              accessibilityLabel="공유"
            />
          </View>

          {/* 좌측 하단: 위치 정보 */}
          <View className="absolute left-4 bottom-[19px]">
            <Text className="text-title text-white font-pretendardBold mb-[7px]">센소지 아사쿠사</Text>
            <View className="flex-row items-center">
              <MarkerIcon />
              <Text className="text-p text-white ml-[6px]">도쿄, 일본</Text>
            </View>
          </View>
        </View>
          {/* 별 아이콘, 평점, 리뷰, 일정 추가하기 버튼*/}
          <View className="mt-7 px-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <StarIcon />
              <Text className="text-h2 ml-1 font-pretendardBold">4.6</Text>
              <Text className="text-p1 text-gray ml-3 font-pretendardMedium">리뷰 56,789개</Text>
            </View>

            <TouchableOpacity
              className="w-[108px] h-9 bg-main rounded-[6px] flex-row items-center justify-center"
              onPress={handleAddToSchedule}>
              <ScheduleIcon />
              <Text className="text-p text-white ml-[6px]">일정 추가하기</Text>
            </TouchableOpacity>
          </View>

          {/* 카테고리 Chip */}
          <View className="mt-7 px-4 flex-row">
            <Chip label="관광지" className="mr-2" />
            <Chip label="문화" className="mr-2" />
            <Chip label="역사" />
          </View>

          {/* 탭 네비게이션 */}
          <View className="mt-[34px] px-4 mb-5">
            <TabNavigation
              tabs={tabs}
              activeTabId={activeTab}
              onTabChange={handleTabChange}
            />
          </View>

          {/* 컨텐츠 영역 */}
          <View className="px-4">
            {activeTab === 'info' ? (
              <InfoTabContent placeId={placeId} />
            ) : (
              <>
                <View className="mb-4">
                  <ContentContainer>
                    <View className="flex-row p-4 pb-6">
                      <View className="flex-row shrink-0 items-center gap-2">
                        <StarIcon width={20} height={20} />
                        <Text className="text-2xl font-pretendardMedium text-black">4.6</Text>
                      </View>

                      <View className="flex-1 gap-1">
                        {ratings.map((item) => (
                          <View key={item.label} className="flex-row items-center gap-2">
                            <Text className="w-7 text-p1 text-right text-black">{item.label}</Text>
                            <View className="flex-1 h-2 bg-background rounded-sm overflow-hidden">
                              <View
                                className="h-2 rounded-sm bg-main"
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                              />
                            </View>
                            <Text className="w-12 text-left text-p leading-none text-gray">
                              {item.count.toLocaleString()}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </ContentContainer>
                </View>
                <ReviewCard
                  profileName="사랑스런그녀"
                  visitDt="2025.11.03"
                  scope={4}
                  content="도시 한 가운데에 있는 사원이라니 즐길거리가 많아 좋았습니다! 근처에 음식점이나 길거리 음식이 많이 판매하고 있어 관광 후 배를 채우기 좋았어요!"
                  imageList={[
                    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
                    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
                    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
                  ]}
                />
                <ReviewCard
                  profileName="사랑스런그녀"
                  visitDt="2025.11.03"
                  scope={4}
                  content="도시 한 가운데에 있는 사원이라니 즐길거리가 많아 좋았습니다! 근처에 음식점이나 길거리 음식이 많이 판매하고 있어 관광 후 배를 채우기 좋았어요!"
                  imageList={[
                  ]}
                />
              </>
            )}
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default DestinationDetailScreen;
export { DestinationDetailScreen };