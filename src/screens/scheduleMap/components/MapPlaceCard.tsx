import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScheduleIcon } from '@/assets/icons';
import type { RootStackParamList } from '@/navigation/types';
import { CategoryChip } from '@/screens/wishList/components';
import type { RoutePoint } from '../types';

interface MapPlaceCardProps {
  place: RoutePoint;
  showAction?: boolean;
  onPressAction?: () => void;
}

const MapPlaceCard: React.FC<MapPlaceCardProps> = ({ place, showAction = true, onPressAction }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View
      className="h-[112px] w-full rounded-[8px] border border-borderGray bg-white"
      style={{
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
      }}>
      <View className="h-[112px] flex-row pr-4">
        <View className="bg-gray-100 h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-l-lg">
          {place.image ? (
            <Image source={place.image} className="h-full w-full" resizeMode="cover" />
          ) : (
            <Text className="px-2 text-center text-[12px] text-gray">
              {place.imageText ?? '이미지 준비 중'}
            </Text>
          )}
        </View>

        <View className="ml-3 h-full flex-1 pb-3 pt-4">
          <Text
            className="font-pretendardBold text-h3 text-black"
            numberOfLines={1}
            style={{ includeFontPadding: false }}>
            {place.title}
          </Text>

          <View className="mt-1 flex-row items-center">
            <Text
              className="h-[32px] w-[172px] text-p text-gray"
              numberOfLines={2}
              style={{ includeFontPadding: false }}>
              {place.placeCardDescription}
            </Text>
          </View>

          {place.categories && place.categories.length > 0 && (
            <View className="mt-2 flex-row">
              {place.categories.slice(0, 3).map((category) => (
                <CategoryChip
                  key={category}
                  label={category}
                  className="mr-1 rounded-2xl px-2 py-[2px]"
                />
              ))}
            </View>
          )}
        </View>

        {showAction && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressAction ?? (() => navigation.navigate('AddSchedule'))}
            className="h-[36px] w-[36px] items-center justify-center self-center rounded-[6px] bg-main px-3">
            <ScheduleIcon width={16} height={16} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

MapPlaceCard.displayName = 'MapPlaceCard';

export default MapPlaceCard;
export type { MapPlaceCardProps };
