import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { WishIcon, LeftArrowIcon, KebabMenuIcon, CalendarIcon } from '@/assets/icons';

type TripDetailNavigation = NativeStackNavigationProp<RootStackParamList, 'TripDetailScreen'>;

interface HeaderProps {
  onPressKebab: () => void;
}

const Header = ({ onPressKebab }: HeaderProps) => {
  const navigation = useNavigation<TripDetailNavigation>();

  return (
    <View className="relative w-full">
      <Image
        source={require('@/assets/images/thumnail.png')}
        className="h-[181px] w-full"
        resizeMode="cover"
      />

      <View className="absolute left-4 right-4 top-4 z-50 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
          <LeftArrowIcon />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate('WishlistScreen')}
            activeOpacity={0.8}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="mr-2 h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
            <WishIcon />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressKebab}
            activeOpacity={0.8}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
            <KebabMenuIcon />
          </TouchableOpacity>
        </View>
      </View>

      <View className="absolute bottom-[19px] left-4">
        <Text className="mb-[6px] text-title font-pretendardBold text-white">도쿄 여행</Text>
        <View className="flex-row items-center">
          <CalendarIcon width={16} height={16} />
          <Text className="ml-[6px] text-p text-white">2026.02.28 - 2026.03.03</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;

