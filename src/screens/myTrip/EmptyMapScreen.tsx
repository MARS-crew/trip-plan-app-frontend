import React from 'react';
import { Text, View } from 'react-native';

import { AirplaneIcon } from '@/assets/icons';
import { Chip } from '@/components/ui';
import {AirplaneIcon} from '@/assets/icons';
import React from 'react';
import { Text, View } from 'react-native';

import { AirplaneIcon } from '@/assets/icons';

const EmptyMapScreen: React.FC = () => {
  return (
    <View className="items-center pt-[102px]">
      <View className="h-[80px] w-[80px] items-center justify-center">
        <AirplaneIcon />
      </View>

      <Text className="mt-3 text-h1 font-bold text-black">여행이 없어요</Text>
      <Text className="mt-1 text-p1 text-gray">여행을 추가하고 계획해보세요.</Text>
    </View>
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View className="flex-1 bg-screenBackground px-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-h font-bold text-black">내여행</Text>
            <Text className="mt-1 text-p text-gray">0개의 여행이 있어요</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="h-[36px] w-[71px] flex-row items-center justify-center rounded-[6px] bg-main"
          >
            <Text className="mr-1 text-h3 text-white">+</Text>
            <Text className="text-p1 text-white">추가</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-7 flex-row">
          <Chip
            label="전체"
            onPress={() => {
              setSelectedChip('전체');
              navigation.goBack();
            }}
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

        <View className="items-center pt-[102px]">
          <View className="h-[80px] w-[80px] items-center justify-center">
            <AirplaneIcon/>
          </View>
    <View className="items-center pt-[102px]">
      <View className="h-[80px] w-[80px] items-center justify-center">
        <AirplaneIcon />
      </View>

      <Text className="mt-3 text-h1 font-bold text-black">여행이 없어요</Text>
      <Text className="mt-1 text-p1 text-gray">여행을 추가하고 계획해보세요.</Text>
    </View>
          <Text className="mt-3 text-h1 font-bold text-black">여행이 없어요</Text>
          <Text className="mt-1 text-p1 text-gray">여행을 추가하고 계획해보세요.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmptyMapScreen;