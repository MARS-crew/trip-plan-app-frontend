import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Chip } from '@/components/ui';
import TripCard from '@/screens/myTrip/TripCard';

type MapScreenNavigation = NativeStackNavigationProp<any>;

const MyTripScreen: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState('전체');
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const navigation = useNavigation<MapScreenNavigation>();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View className="flex-1 bg-screenBackground px-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-h font-bold text-black">내여행</Text>
            <Text className="mt-1 text-p text-gray">3개의 여행이 있어요</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="h-[36px] w-[71px] flex-row items-center justify-center rounded-[6px] bg-main"
          >
            <Text className="mr-1 text-h3 text-white">+</Text>
            <Text className="text-p1 text-white">추가</Text>
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
          <Text>스케줄 컴포넌트 추가 예정</Text>
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
          <Text>스케줄 컴포넌트 추가 예정</Text>
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
          <Text>스케줄 컴포넌트 추가 예정</Text>
        </TripCard>
      </View>
    </SafeAreaView>
  );
};

MyTripScreen.displayName = 'MyTripScreen';

export default MyTripScreen;
export { MyTripScreen };
