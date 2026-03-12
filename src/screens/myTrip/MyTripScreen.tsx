import React, { useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/ui';
import {
  PlaceIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@/assets/icons';

const MyTripScreen: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState('전체');
  const [isOpen, setIsOpen] = useState(false);

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
            onPress={() => setSelectedChip('예정된 여행')}
            isSelected={selectedChip === '예정된 여행'}
            className="mr-2"
          />
          <Chip
            label="지난 여행"
            onPress={() => setSelectedChip('지난 여행')}
            isSelected={selectedChip === '지난 여행'}
            className="mr-2"
          />
        </View>

        {/*드롭다운*/}
        <View className="mt-6 overflow-hidden rounded-[8px] bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View className="relative">
            <Image
              source={require('@/assets/images/thumbnail2.png')}
              className="h-[144px] w-[370px]"
              resizeMode="cover"
            />

            <View className="absolute bottom-5 left-4">
              <Text className="ml-[1.2px] text-h1 font-bold text-white">도쿄</Text>
              <View className="flex-row items-center">
                <CalendarIcon width={12} height={12}/>
                <Text className="text-p1 text-white ml-[4px]">2026.02.28 - 2026.03.03</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
          <PlaceIcon width={14} height={14} className="mr-1"/>
            <Text className="ml-1 text-p text-gray">5개의 일정   4일간</Text>
            </View>

            <Pressable onPress={() => setIsOpen((prev) => !prev)}>
             <View className="flex-row items-center">
              <Text className="text-p text-main">
                {isOpen ? '일정 접기 ' : '전체 보기 '}
              </Text>
              {isOpen ? (
                <ChevronUpIcon width={14} height={14} />
              ) : (
                <ChevronDownIcon width={14} height={14} />
              )}
             </View>
            </Pressable>
          </View>

          {isOpen && (
            <View className="border-t border-chip px-4 py-4">
            </View>
          )}
        </View>

        <View className="mt-6 overflow-hidden rounded-[8px] bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View className="relative">
            <Image
              source={require('@/assets/images/thumbnail2.png')}
              className="h-[144px] w-[370px]"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/20" />

            <View className="absolute bottom-5 left-4">
              <Text className="ml-[1.2px] text-h1 font-bold text-white">도쿄</Text>
              <View className="flex-row items-center">
                <CalendarIcon width={12} height={12}/>
                <Text className="text-p1 text-white ml-[4px]">2026.02.28 - 2026.03.03</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
          <PlaceIcon width={14} height={14} className="mr-1"/>
            <Text className="ml-1 text-p text-gray">5개의 일정   4일간</Text>
            </View>

            <Pressable onPress={() => setIsOpen((prev) => !prev)}>
             <View className="flex-row items-center">
              <Text className="text-p text-main">
                {isOpen ? '일정 접기 ' : '전체 보기 '}
              </Text>
              {isOpen ? (
                <ChevronUpIcon width={14} height={14} />
              ) : (
                <ChevronDownIcon width={14} height={14} />
              )}
             </View>
            </Pressable>
          </View>

          {isOpen && (
            <View className="border-t border-chip px-4 py-4">
            </View>
          )}
        </View>

        <View className="mt-6 overflow-hidden rounded-[8px] bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <View className="relative">
            <Image
              source={require('@/assets/images/thumbnail2.png')}
              className="h-[144px] w-[370px]"
              resizeMode="cover"
            />

            <View className="absolute bottom-5 left-4">
              <Text className="ml-[1.2px] text-h1 font-bold text-white">도쿄</Text>
              <View className="flex-row items-center">
                <CalendarIcon width={12} height={12}/>
                <Text className="text-p1 text-white ml-[4px]">2026.02.28 - 2026.03.03</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center">
          <PlaceIcon width={14} height={14} className="mr-1"/>
            <Text className="ml-1 text-p text-gray">5개의 일정   4일간</Text>
            </View>

            <Pressable onPress={() => setIsOpen((prev) => !prev)}>
             <View className="flex-row items-center">
              <Text className="text-p text-main">
                {isOpen ? '일정 접기 ' : '전체 보기 '}
              </Text>
              {isOpen ? (
                <ChevronUpIcon width={14} height={14} />
              ) : (
                <ChevronDownIcon width={14} height={14} />
              )}
             </View>
            </Pressable>
          </View>

          {isOpen && (
            <View className="border-t border-chip px-4 py-4">
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

MyTripScreen.displayName = 'MyTripScreen';

export default MyTripScreen;
export { MyTripScreen };