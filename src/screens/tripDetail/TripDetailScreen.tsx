import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, Image, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

import { IconButton } from '@/screens/destinationDetail/components';
import TripDetailCard from '@/components/ui/TripDetailCard';
import {
  WishIcon,
  LeftArrowIcon,
  KebabMenuIcon,
  CalendarIcon,
  Map2Icon,
  PlusIcon
} from '@/assets/icons';

type TripDetailNavigation = NativeStackNavigationProp<RootStackParamList,'TripDetailScreen'>;

const TripDetailScreen: React.FC = () => {
  const navigation = useNavigation<TripDetailNavigation>();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleWish = useCallback(() => {
    // 위시리스트 이동
  }, []);

  const handleKebab = useCallback(() => {
    // 케밥 메뉴
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 헤더 이미지 영역 */}
        <View className="relative w-full">
          <Image
            source={require('@/assets/images/thumnail.png')}
            className="h-[181px] w-full"
            resizeMode="cover"
          />

          <View className="absolute left-4 top-4">
            <IconButton
              icon={LeftArrowIcon}
              onPress={handleGoBack}
              accessibilityLabel="뒤로가기"
            />
          </View>

          <View className="absolute right-4 top-4 flex-row">
            <IconButton
              className="mr-2"
              icon={WishIcon}
              onPress={handleWish}
              accessibilityLabel="위시"
            />
            <IconButton
              icon={KebabMenuIcon}
              onPress={handleKebab}
              accessibilityLabel="케밥"
            />
          </View>

          <View className="absolute left-4 bottom-[19px]">
            <Text className="mb-[6px] text-title font-bold text-white">도쿄 여행</Text>
            <View className="flex-row items-center">
              <CalendarIcon width={16} height={16} />
              <Text className="ml-[6px] text-p text-white">2026.02.28 - 2026.03.03</Text>
            </View>
          </View>
        </View>

        {/* 1일차 */}
        <View className="bg-screenBackground pt-[19px]">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">1일차 / 02/28</Text>
            <Map2Icon width={20} height={20} />
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] items-center">
            <TripDetailCard
              order={1}
              title="아사쿠사 센소지"
              location="아사쿠사, 도쿄"
              description="도쿄에서 가장 오래된 사원 방문"
              startTime="09:00"
              endTime="11:00"
            />
          </View>

          <View className="mt-[12px] items-center">
            <TripDetailCard
              order={2}
              title="츠키지 시장 점심"
              location="츠키지, 도쿄"
              description="신선한 스시와 해산물 즐기기"
              startTime="12:00"
              endTime="12:30"
            />
          </View>

          <View className="mt-[12px] items-center pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray"
            >
              <PlusIcon />
              <Text className="ml-2 text-p1  text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* 2일차 */}
        <View className="bg-screenBackground">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">2일차 / 03/01</Text>
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] items-center pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray"
            >
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* 3일차 */}
        <View className="bg-screenBackground">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">3일차 / 03/02</Text>
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] items-center pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray"
            >
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* 4일차 */}
        <View className="bg-screenBackground">
          <View className="flex-row items-center justify-between px-4">
            <Text className="text-h3 font-semibold">4일차 / 03/03</Text>
          </View>

          <View className="mt-[18px] border-t border-borderGray" />

          <View className="mt-[12px] items-center pb-8">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('AddSchedule')}
              className="h-[50px] w-[370px] flex-row items-center justify-center rounded-[8px] border border-dashed border-borderGray"
            >
              <PlusIcon />
              <Text className="ml-2 text-p1 text-gray">일정 추가하기</Text>
            </TouchableOpacity>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

TripDetailScreen.displayName = 'TripDetailScreen';

export default TripDetailScreen;
export { TripDetailScreen };