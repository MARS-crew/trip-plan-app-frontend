import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { WishIcon, LeftArrowIcon, KebabMenuIcon, CalendarWhiteIcon } from '@/assets/icons';
import type { HeaderProps } from '@/types/tripDetail.types';

type TripDetailNavigation = NativeStackNavigationProp<RootStackParamList, 'TripDetail'>;
const DEFAULT_TRIP_IMAGE = require('@/assets/images/place_default.png');

const getValidImageUrl = (rawImageUrl?: string): string | null => {
  const trimmedImageUrl = rawImageUrl?.trim();
  if (!trimmedImageUrl || trimmedImageUrl === 'null' || trimmedImageUrl === 'undefined') {
    return null;
  }
  return trimmedImageUrl.startsWith('//') ? `https:${trimmedImageUrl}` : trimmedImageUrl;
};

const Header = ({
  onPressKebab,
  tripId,
  title,
  dateText,
  imageUrl,
  isReadOnly = false,
}: HeaderProps) => {
  const navigation = useNavigation<TripDetailNavigation>();
  const [hasImageLoadError, setHasImageLoadError] = useState(false);
  const validImageUrl = getValidImageUrl(imageUrl);

  useEffect(() => {
    setHasImageLoadError(false);
  }, [validImageUrl]);

  const showCover = validImageUrl && !hasImageLoadError;

  return (
    <View className="relative w-full">
      <View className="h-[181px] w-full items-center justify-center bg-white">
        {showCover && (
          <Image
            source={{ uri: validImageUrl }}
            onError={() => setHasImageLoadError(true)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            resizeMode="cover"
          />
        )}

        {!showCover && (
          <Image
            source={DEFAULT_TRIP_IMAGE}
            style={{ width: 81, height: 81 }}
            resizeMode="contain"
          />
        )}

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        />
      </View>

      <View className="absolute left-4 right-4 top-4 z-50 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="h-[36px] w-[36px] items-center justify-center rounded-full bg-[#FFFFFF4C]">
          <LeftArrowIcon />
        </TouchableOpacity>

        {!isReadOnly && (
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                if (!tripId) return;
                navigation.navigate('WishlistScreen', { tripId });
              }}
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
        )}
      </View>

      <View className="absolute bottom-[19px] left-4">
        <Text className="mb-[6px] font-pretendardBold text-title text-white">{title ?? ''}</Text>
        <View className="flex-row items-center">
          <CalendarWhiteIcon width={16} height={16} />
          <Text className="ml-[6px] text-p text-white">{dateText ?? ''}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
