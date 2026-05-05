import React, { useCallback, useEffect, useState } from 'react';
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
import { getReviewList } from '@/services/reviewService';
import type { ReviewData } from '@/types/review';

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

  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetched = await getReviewList(placeId);
        setReviewData(fetched);
      } catch {
        setReviewData(null);
      }
    };
    fetchReviews();
  }, [placeId]);

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

  const ratingDisplayRows = React.useMemo(() => {
    if (!reviewData) return ratings;

    const dist = reviewData.ratingDistribution;
    return ([5, 4, 3, 2, 1] as const).map((stars) => ({
      label: `${stars}점`,
      count: dist[stars],
    }));
  }, [reviewData]);

  const maxCount = Math.max(...ratingDisplayRows.map((r) => r.count), 1);

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
            <IconButton icon={LeftArrowIcon} onPress={handleGoBack} accessibilityLabel="뒤로가기" />
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
          <View className="absolute bottom-[19px] left-4">
            <Text className="mb-[7px] font-pretendardBold text-title text-white">
              센소지 아사쿠사
            </Text>
            <View className="flex-row items-center">
              <MarkerIcon />
              <Text className="ml-[6px] text-p text-white">도쿄, 일본</Text>
            </View>
          </View>
        </View>
        {/* 별 아이콘, 평점, 리뷰, 일정 추가하기 버튼*/}
        <View className="mt-7 flex-row items-center justify-between px-4">
          <View className="flex-row items-center">
            <StarIcon />
            <Text className="ml-1 font-pretendardBold text-h2">4.6</Text>
            <Text className="ml-3 font-pretendardMedium text-p1 text-gray">리뷰 56,789개</Text>
          </View>

          <TouchableOpacity
            className="h-9 w-[108px] flex-row items-center justify-center rounded-[6px] bg-main"
            onPress={handleAddToSchedule}>
            <ScheduleIcon />
            <Text className="ml-[6px] text-p text-white">일정 추가하기</Text>
          </TouchableOpacity>
        </View>

        {/* 카테고리 Chip */}
        <View className="mt-7 flex-row px-4">
          <Chip label="관광지" className="mr-2" />
          <Chip label="문화" className="mr-2" />
          <Chip label="역사" />
        </View>

        {/* 탭 네비게이션 */}
        <View className="mb-5 mt-[34px] px-4">
          <TabNavigation tabs={tabs} activeTabId={activeTab} onTabChange={handleTabChange} />
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
                    <View className="shrink-0 flex-row items-center gap-2">
                      <StarIcon width={20} height={20} />
                      <Text className="font-pretendardMedium text-2xl text-black">
                        {reviewData?.ratingAvg ?? 0.0}
                      </Text>
                    </View>

                    <View className="flex-1 gap-1">
                      {ratingDisplayRows.map((item) => (
                        <View key={item.label} className="flex-row items-center gap-2">
                          <Text className="w-7 text-right text-p1 text-black">{item.label}</Text>
                          <View className="h-2 flex-1 overflow-hidden rounded-sm bg-background">
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
              {reviewData?.reviews.map((item) => (
                <ReviewCard
                  key={item.nickname + item.createdAt}
                  nickname={item.nickname}
                  visitedDate={item.visitedDate}
                  rating={item.rating}
                  content={item.content}
                  imageUrls={item.imageUrls}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DestinationDetailScreen;
export { DestinationDetailScreen };
