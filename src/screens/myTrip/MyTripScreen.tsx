
import React, { useState, useCallback } from 'react';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Chip } from '@/components/ui';
import TripCard from '@/screens/myTrip/TripCard';
import { TripTimeline } from '@/screens/myTrip';

type MapScreenNavigation = NativeStackNavigationProp<any>;

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



import type { RootStackParamList } from '@/navigation/types';
// ============ Types ============
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ============ Component ============
const MyTripScreen: React.FC = () => {

  const [selectedChip, setSelectedChip] = useState('전체');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const navigation = useNavigation<MapScreenNavigation>();


  // Hooks
  const handleNavigateToDetail = useCallback(() => {
    navigation.navigate('AddTripScreen', { destinationId: 'string' });
  }, [navigation]);
  const handleNavigateToDetails = useCallback(() => {
    navigation.navigate('WishlistScreen');
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }} >
        <View className="flex-1 bg-screenBackground px-5 pt-6">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-h font-bold text-black">내여행</Text>
              <Text className="mt-1 text-p text-gray">3개의 여행이 있어요</Text>
            </View>

            <TouchableOpacity
              onPress={handleNavigateToDetail}
              className="h-[36px] w-[71px] flex-row items-center justify-center rounded-[6px] bg-main">
              <Text className="mr-1 text-h3 text-white">+</Text>
              <Text className="text-p1 text-white">추가</Text>
              <TouchableOpacity
                onPress={handleNavigateToDetails}
                className="bg-main px-6 py-3 rounded-lg">
                <Text className="text-white font-semibold">위시 리스트</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/*Chip*/}
          <View className="mt-7 flex-row">
            <Chip
              label="전체"
              onPress={() => setSelectedChip('전체')}
              isSelected={selectedChip === '전체'}
              className="mr-2"
            />
            <Chip
              label="예정된 여행"
              onPress={() => {

                setSelectedChip('예정된 여행');
                navigation.navigate('EmptyMapScreen');
              }}
              isSelected={selectedChip === '예정된 여행'}
              className="mr-2"
            />
            <Chip
              label="지난 여행"
              onPress={() => setSelectedChip('지난 여행')}
              isSelected={selectedChip === '지난 여행'}
            />
          </View>

          {/*TripCard*/}
          <TripCard
            city="도쿄"
            dateText="2026.02.28 - 2026.03.03"
            scheduleText="5개의 일정 4일간"
            imageSource={require('@/assets/images/thumbnail2.png')}
            status="traveling"
            isOpen={openCardId === 1}
            onToggle={() => setOpenCardId((prev) => (prev === 1 ? null : 1))}
          >
            <TripTimeline items={timelineItems} />
          </TripCard>

          <TripCard
            city="도쿄"
            dateText="2026.02.28 - 2026.03.03"
            scheduleText="5개의 일정 4일간"
            imageSource={require('@/assets/images/thumbnail2.png')}
            status="scheduled"
            isOpen={openCardId === 2}
            onToggle={() => setOpenCardId((prev) => (prev === 2 ? null : 2))}
          >
            <TripTimeline items={timelineItems} />
          </TripCard>

          <TripCard
            city="도쿄"
            dateText="2026.02.28 - 2026.03.03"
            scheduleText="5개의 일정 4일간"
            imageSource={require('@/assets/images/thumbnail2.png')}
            status="completed"
            isOpen={openCardId === 3}
            onToggle={() => setOpenCardId((prev) => (prev === 3 ? null : 3))}
          >
            <TripTimeline items={timelineItems} />
          </TripCard>

        </View>


        {/*TripCard*/}
        <TripCard
          city="도쿄"
          dateText="2026.02.28 - 2026.03.03"
          scheduleText="5개의 일정 4일간"
          imageSource={require('@/assets/images/thumnail2.png')}
          status="traveling"
          isOpen={openCardId === 1}
          onToggle={() => setOpenCardId((prev) => (prev === 1 ? null : 1))}
        >
          <TripTimeline items={timelineItems} />
        </TripCard>

        <TripCard
          city="도쿄"
          dateText="2026.02.28 - 2026.03.03"
          scheduleText="5개의 일정 4일간"
          imageSource={require('@/assets/images/thumnail2.png')}
          status="scheduled"
          isOpen={openCardId === 2}
          onToggle={() => setOpenCardId((prev) => (prev === 2 ? null : 2))}
        >
          <TripTimeline items={timelineItems} />
        </TripCard>

        <TripCard
          city="도쿄"
          dateText="2026.02.28 - 2026.03.03"
          scheduleText="5개의 일정 4일간"
          imageSource={require('@/assets/images/thumnail2.png')}
          status="completed"
          isOpen={openCardId === 3}
          onToggle={() => setOpenCardId((prev) => (prev === 3 ? null : 3))}
        >
          <TripTimeline items={timelineItems} />
        </TripCard>

      </ScrollView>

    </SafeAreaView >
  );
};

MyTripScreen.displayName = 'MyTripScreen';

export default MyTripScreen;
export { MyTripScreen };
