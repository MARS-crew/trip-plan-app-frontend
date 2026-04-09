import React from 'react';
import { Image, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { COLORS } from '@/constants';
import { TopBar } from '@/components/ui';
import LocationOrangeIcon from '@/assets/icons/location_orange.svg';
import MarkerGrayIcon from '@/assets/icons/marker-gray.svg';
import VectorGrayIcon from '@/assets/icons/vectorgray.svg';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface VisitedPlaceItem {
  id: string;
  date: string;
  title: string;
  location: string;
  tags: string[];
  reviewCta: string;
  hasReview: boolean;
  imageSource: number;
}

const visitedPlaces: VisitedPlaceItem[] = [
  {
    id: 'visited-1',
    date: '2026.02.05',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    tags: ['관광지', '문화', '역사'],
    reviewCta: '리뷰 확인하기',
    hasReview: true,
    imageSource: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'visited-2',
    date: '2026.02.05',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    tags: ['관광지', '문화', '역사'],
    reviewCta: '리뷰 쓰기',
    hasReview: false,
    imageSource: require('@/assets/images/thumnail.png'),
  },
  {
    id: 'visited-3',
    date: '2026.02.03',
    title: '센소지 아사쿠사',
    location: '도쿄, 일본',
    tags: ['관광지', '문화', '역사'],
    reviewCta: '리뷰 쓰기',
    hasReview: false,
    imageSource: require('@/assets/images/thumnail.png'),
  },
];

const cardStyle = {
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 1.5,
  elevation: 1,
};

const VisitedPlaceListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const groupedByDate = React.useMemo(() => {
    const map = new Map<string, VisitedPlaceItem[]>();

    visitedPlaces.forEach((item) => {
      const items = map.get(item.date);
      if (items) {
        items.push(item);
      } else {
        map.set(item.date, [item]);
      }
    });

    return Array.from(map.entries());
  }, []);

  const handleReviewPress = React.useCallback(
    (item: VisitedPlaceItem): void => {
      if (item.hasReview) {
        navigation.navigate('MainTabs', {
          screen: 'Search',
          params: {
            screen: 'DestinationDetail',
            params: { destinationId: item.id, initialTab: 'review' },
          },
        } as never);
      } else {
        navigation.navigate('MainTabs', {
          screen: 'Search',
          params: {
            screen: 'ReviewWrite',
            params: { placeName: item.title, visitedDate: item.date },
          },
        } as never);
      }
    },
    [navigation],
  );

  if (visitedPlaces.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
        <TopBar title="방문한 장소 리스트" onPress={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-contentBackground">
            <LocationOrangeIcon width={28} height={28} />
          </View>
          <Text className="mt-4 font-pretendardSemiBold text-h2 text-black">
            방문한 장소가 없습니다
          </Text>
          <Text className="mt-1 font-pretendardMedium text-p1 text-gray">
            여행을 떠나보세요! 분명 좋은 일이 있을 거예요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="방문한 장소 리스트" onPress={navigation.goBack} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-8">
          {groupedByDate.map(([date, items]) => (
            <View key={date} className="mt-4">
              <Text className="mb-2 font-pretendardMedium text-p1 text-gray">{date}</Text>

              <View className="gap-3">
                {items.map((item) => (
                  <View
                    key={item.id}
                    className="overflow-hidden rounded-lg bg-white"
                    style={cardStyle}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('MainTabs', {
                          screen: 'Search',
                          params: {
                            screen: 'DestinationDetail',
                            params: { destinationId: item.id },
                          },
                        } as never)
                      }
                      className="flex-row px-3 py-3">
                      <Image
                        source={item.imageSource}
                        className="h-28 w-28 rounded-lg"
                        resizeMode="cover"
                      />

                      <View className="ml-3 flex-1 justify-center">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1 pr-2">
                            <Text className="font-pretendardSemiBold text-h3 text-black">
                              {item.title}
                            </Text>
                            <View className="mb-2 mt-0.5 flex-row items-center">
                              <MarkerGrayIcon width={12} height={12} style={{ marginTop: 1 }} />
                              <Text className="ml-1 text-p text-gray">{item.location}</Text>
                            </View>
                            <View className="mt-0.5 flex-row gap-1.5">
                              {item.tags.map((tag) => (
                                <View
                                  key={`${item.id}-${tag}`}
                                  className="rounded-2xl bg-chip px-2 py-0.5">
                                  <Text className="text-p text-gray">{tag}</Text>
                                </View>
                              ))}
                            </View>
                          </View>

                          <VectorGrayIcon width={14} height={14} />
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View className="h-px bg-chip" />

                    <View className="p-3">
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => handleReviewPress(item)}
                        className="h-11 items-center justify-center rounded-lg border border-borderGray bg-inputBackground">
                        <Text className="text-p3 text-center font-pretendardSemiBold text-black">
                          {item.reviewCta}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

VisitedPlaceListScreen.displayName = 'VisitedPlaceListScreen';

export default VisitedPlaceListScreen;
export { VisitedPlaceListScreen };
