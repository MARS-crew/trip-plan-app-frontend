import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import LocationOrangeIcon from '@/assets/icons/location_orange.svg';
import { TopBar } from '@/components/ui';
import { COLORS } from '@/constants';
import type { RootStackParamList } from '@/navigation/types';
import { getVisitedPlaces } from '@/services';
import { useAuthStore } from '@/store';
import type { VisitedPlaceItem } from '@/types/mypage';
import { groupVisitedPlacesByDate, mapVisitedPlace } from '@/utils';
import { VisitedPlaceCard } from '@/screens/myPage/components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const VisitedPlaceListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!accessToken) return;

    let isActive = true;

    const fetchVisited = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await getVisitedPlaces();
        if (isActive) {
          setVisitedPlaces(data.map(mapVisitedPlace));
        }
      } catch {
        if (isActive) {
          setVisitedPlaces([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchVisited();

    return () => {
      isActive = false;
    };
  }, [accessToken]);

  const groupedByDate = useMemo(() => groupVisitedPlacesByDate(visitedPlaces), [visitedPlaces]);

  const handlePressDetail = useCallback(
    (item: VisitedPlaceItem): void => {
      navigation.navigate('MainTabs', {
        screen: 'Search',
        params: {
          screen: 'DestinationDetail',
          params: { destinationId: item.id },
        },
      } as never);
    },
    [navigation],
  );

  const handlePressReview = useCallback(
    (item: VisitedPlaceItem): void => {
      if (item.hasReview) {
        navigation.navigate('MainTabs', {
          screen: 'Search',
          params: {
            screen: 'DestinationDetail',
            params: { destinationId: item.id, initialTab: 'review' },
          },
        } as never);
        return;
      }

      navigation.navigate('MainTabs', {
        screen: 'Search',
        params: {
          screen: 'ReviewWrite',
          params: {
            visitedPlaceId: Number(item.id),
            placeName: item.title,
            visitedDate: item.date,
          },
        },
      } as never);
    },
    [navigation],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
        <TopBar title="방문한 장소 리스트" onPress={navigation.goBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={COLORS.main} />
        </View>
      </SafeAreaView>
    );
  }

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
                  <VisitedPlaceCard
                    key={item.id}
                    item={item}
                    onPressDetail={handlePressDetail}
                    onPressReview={handlePressReview}
                  />
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
