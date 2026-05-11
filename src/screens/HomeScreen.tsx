import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { MainRecChip } from '@/components/ui';
import { NoticeIcon, LogoIcon, LogoLetter, ChatIcon } from '@/assets/icons';
import { MainTripCard } from '@/screens/home/components';
import { getUnreadAlert } from '@/services/alertService';
import type { HomeScreenNavigationProp } from '@/types/home';

const RECOMMENDED_DESTINATIONS = [
  {
    id: '1',
    title: '제주도',
    country: '한국',
    description: '아름다운 자연과 독특한 문화가 있는 한국의 보석 같은 섬',
    imageUrl: require('@/assets/images/mainjeju.png'),
    tags: ['자연', '맛집', '자연'],
  },
  {
    id: '2',
    title: '제주도',
    country: '한국',
    description: '아름다운 자연과 독특한 문화가 있는 한국의 보석 같은 섬',
    imageUrl: require('@/assets/images/mainjeju.png'),
    tags: ['자연', '맛집'],
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [hasPlannedTrip, setHasPlannedTrip] = useState(false);
  const [isInTripScheduleView, setIsInTripScheduleView] = useState(false);
  const [hasNotification, setHasNotification] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchUnread = async (): Promise<void> => {
        try {
          const unread = await getUnreadAlert();
          if (isActive) {
            setHasNotification(unread);
          }
        } catch {
          if (isActive) {
            setHasNotification(false);
          }
        }
      };

      fetchUnread();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('Alert');
  }, [navigation]);

  const handleNavigateToAddTrip = useCallback(() => {
    setHasPlannedTrip(true);
    setIsInTripScheduleView(false);
  }, []);

  const handleOpenTripSchedule = useCallback(() => {
    setIsInTripScheduleView(true);
  }, []);

  const handleNavigateToMyTrip = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'MyTrip' });
  }, [navigation]);

  const handleOpenChat = useCallback(() => {
    navigation.navigate('ChatScreen');
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <View className="flex-row items-center">
            <LogoIcon width={38} height={38} />
            <LogoLetter width={65} height={32} />
          </View>
          <Shadow
            distance={2}
            startColor="#00000025"
            endColor="#00000000"
            offset={[0, 0]}
            paintInside={false}
            style={{ borderRadius: 12 }}>
            <View className="rounded-xl bg-white px-[10px] py-[10px]">
              <Pressable onPress={handleNavigateToDetail} className="items-center justify-center">
                <View className="relative">
                  <NoticeIcon width={20} height={20} />
                  {hasNotification && (
                    <View className="absolute right-[-1px] top-[-1px] h-2 w-2 rounded-full bg-statusError" />
                  )}
                </View>
              </Pressable>
            </View>
          </Shadow>
        </View>

        <View className="mx-4 mt-4">
          <MainTripCard
            hasPlannedTrip={hasPlannedTrip}
            isInTripScheduleView={isInTripScheduleView}
            onAddTrip={handleNavigateToAddTrip}
            onOpenTripSchedule={handleOpenTripSchedule}
            onViewAllSchedule={handleNavigateToMyTrip}
          />
        </View>

        <View className="mb-6 mt-6">
          <View className="mb-2 px-4">
            <Text className="mb-[2px] font-pretendardSemiBold text-h1 text-black">추천 여행지</Text>
            <Text className="text-p text-gray">지금 떠나기 좋은 여행지를 모았어요</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}>
            {RECOMMENDED_DESTINATIONS.map((item) => (
              <Shadow
                key={item.id}
                distance={10}
                offset={[0, 0]}
                startColor="#00000025"
                endColor="#00000000"
                paintInside={false}
                style={{ borderRadius: 8, width: 260 }}>
                <TouchableOpacity className="overflow-hidden rounded-lg bg-white">
                  <View className="relative h-40">
                    <Image source={item.imageUrl} className="h-full w-full" resizeMode="cover" />
                    <View className="absolute bottom-3 left-4">
                      <Text className="font-pretendardSemiBold text-h2 text-white">
                        {item.title}
                      </Text>
                      <Text className="mt-1 font-pretendardSemiBold text-p text-white">
                        {item.country}
                      </Text>
                    </View>
                  </View>

                  <View className="p-4">
                    <Text className="mb-4 text-p text-gray" numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View className="flex-row">
                      {item.tags.map((tag, index) => (
                        <MainRecChip
                          key={`${item.id}-${tag}-${index}`}
                          label={tag}
                          className={'mr-[6px]'}
                        />
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              </Shadow>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleOpenChat}
        className="absolute bottom-4 right-4 rounded-full bg-main px-4 py-4">
        <ChatIcon width={24} height={24} />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default HomeScreen;
export { HomeScreen };
