import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PlusIcon } from '@/assets/icons';
import { Chip } from '@/components/ui';
import type { RootStackParamList } from '@/navigation/types';
import { EmptyMapScreen, TripTimeline } from '@/screens/myTrip';
import TripCard from '@/screens/myTrip/TripCard';

type MyTripNavigation = NativeStackNavigationProp<RootStackParamList>;

const timelineItems = [
  {
    id: '1',
    startTime: '09:00',
    endTime: '11:00',
    title: '아사쿠사 센소지',
    location: '아사쿠사, 도쿄',
    description: '도쿄에서 가장 오래된 사원 방문',
  },
  {
    id: '2',
    startTime: '12:00',
    endTime: '13:30',
    title: '츠키지 시장 점심',
    location: '츠키지, 도쿄',
    description: '신선한 스시와 해산물 즐기기'
  },
  {
    id: '3',
    startTime: '14:30',
    endTime: '16:00',
    title: '시부야 스크램블 교차로',
    location: '시부야, 도쿄'
  },
  {
    id: '4',
    startTime: '17:00',
    endTime: '18:30',
    title: '하라주쿠 탐방',
    location: '하라주쿠, 도쿄',
    description: '쇼핑하기',
  },
  {
    id: '5',
    startTime: '19:30',
    endTime: '18:30',
    title: '츠키지 시장 점심',
    location: '하라주쿠, 도쿄',
    description: '쇼핑하기',
  },
];

const tripCardItems = [
  {
    id: 1,
    city: '도쿄',
    dateText: '2026.02.28 - 2026.03.03',
    scheduleText: '5',
    scheduleCountText: '4',
    imageSource: require('@/assets/images/thumnail2.png'),
    status: 'traveling' as const,
  },
  {
    id: 2,
    city: '도쿄',
    dateText: '2026.02.28 - 2026.03.03',
    scheduleText: '5',
    scheduleCountText: '4',
    imageSource: require('@/assets/images/thumnail2.png'),
    status: 'scheduled' as const,
  },
  {
    id: 3,
    city: '도쿄',
    dateText: '2026.02.28 - 2026.03.03',
    scheduleText: '5',
    scheduleCountText: '4',
    imageSource: require('@/assets/images/thumnail2.png'),
    status: 'completed' as const,
  },
];

const MyTripScreen: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState('전체');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const navigation = useNavigation<MyTripNavigation>();
  const handleNavigateToWish = () => {
    navigation.navigate('WishlistScreen');
  };

  const filteredTripCardItems = useMemo(() => {
    if (selectedChip === '전체') {
      return tripCardItems;
    }

    if (selectedChip === '예정된 여행') {
      return tripCardItems.filter((tripCardItem) => tripCardItem.status === 'scheduled');
    }

    return tripCardItems.filter((tripCardItem) => tripCardItem.status === 'completed');
  }, [selectedChip]);

   // Hooks
    const handleNavigateToDetail = useCallback(() => {
      navigation.navigate('AddTripScreen', { destinationId: 'string' });
    }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView
        className="flex-1 bg-screenBackground"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-1 bg-screenBackground px-5 py-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-h font-bold text-black">내여행</Text>
            <Text className="mt-1 text-p text-gray">{filteredTripCardItems.length}개의 여행이 있어요</Text>
          </View>

          <TouchableOpacity
            onPress={handleNavigateToDetail}
            activeOpacity={0.8}
            className="h-[36px] w-[71px] flex-row items-center justify-center rounded-[6px] bg-main"
          >
            <PlusIcon />
            <Text className="text-p1 text-white ml-[6px]">추가</Text>
          </TouchableOpacity>
        </View>

        {/* Chip */}
        <View className="mt-7 flex-row">
          <Chip
            label="전체"
            onPress={() => setSelectedChip('전체')}
            isSelected={selectedChip === '전체'}
            className="mr-2"
          />
          <Chip
            label="예정된 여행"
            onPress={() => setSelectedChip('예정된 여행')}
            isSelected={selectedChip === '예정된 여행'}
            className="mr-2"
          />
          <Chip
            label="지난 여행"
            onPress={() => setSelectedChip('지난 여행')}
            isSelected={selectedChip === '지난 여행'}
          />
        </View>

        {/* TripCard */}
        {filteredTripCardItems.length === 0 ? (
          <View className="mt-6">
            <EmptyMapScreen />
          </View>
        ) : (
          filteredTripCardItems.map((tripCardItem) => (
            <TripCard
              key={tripCardItem.id}
              city={tripCardItem.city}
              dateText={tripCardItem.dateText}
              scheduleText={tripCardItem.scheduleText}
              scheduleCountText={tripCardItem.scheduleCountText}
              imageSource={tripCardItem.imageSource}
              status={tripCardItem.status}
              isOpen={openCardId === tripCardItem.id}
              onToggle={() =>
                setOpenCardId((prev) => (prev === tripCardItem.id ? null : tripCardItem.id))
              }
            >
              <TripTimeline items={timelineItems} />
            </TripCard>
          ))
        )}

      <TouchableOpacity
        onPress={handleNavigateToWish}
        className="bg-main px-5 py-3 mt-5 rounded-lg">
        <Text className="text-white font-semibold">위시 리스트</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

MyTripScreen.displayName = 'MyTripScreen';

export default MyTripScreen;
export { MyTripScreen };
