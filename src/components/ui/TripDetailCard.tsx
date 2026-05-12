import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MarkerGrayIcon } from '@/assets/icons';
import { COLORS } from '@/constants/colors';
import type { RootStackParamList } from '@/navigation/types';

type TripDetailCardNavigation = NativeStackNavigationProp<RootStackParamList>;
const ACTION_LABEL_TEXT_STYLE = { includeFontPadding: false, textAlignVertical: 'center' } as const;

export interface TripDetailCardProps {
  id?: number;
  order: number;
  title: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  isCurrentSchedule?: boolean;
  currentStatusText?: string;
  actionLabel?: string;
  onPressAction?: () => void;
  actionDisabled?: boolean;
  actionLayout?: 'inline' | 'fullWidth';
  onPressCard?: () => void;
  accentColor?: string;
  tripId?: number;
}

const TripDetailCard: React.FC<TripDetailCardProps> = ({
  order,
  title,
  location,
  description,
  startTime,
  endTime,
  isCurrentSchedule = false,
  currentStatusText = '현재 진행 중인 일정입니다',
  actionLabel = '방문지 저장',
  onPressAction,
  actionDisabled = false,
  actionLayout = 'inline',
  onPressCard,
  accentColor = COLORS.main,
  tripId,
}) => {
  const navigation = useNavigation<TripDetailCardNavigation>();
  return (
    <Pressable
      onPress={onPressCard}
      disabled={!onPressCard}
      className="w-full rounded-[8px] border border-borderGray bg-white px-4 py-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-start">
          <View
            className="mr-3 h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: accentColor }}>
            <Text className="font-pretendardSemiBold text-h3 text-white">{order}</Text>
          </View>

          <View className="flex-1">
            <Text className="font-pretendardSemiBold text-h3 text-black">{title}</Text>

            <View className="mt-[2px] flex-row items-center">
              <MarkerGrayIcon width={12} height={12} />
              <Text className="ml-1 flex-1 text-p text-gray" numberOfLines={1} ellipsizeMode="tail">
                {location}
              </Text>
            </View>

            <Text className="mt-1 text-p text-gray" numberOfLines={1} ellipsizeMode="tail">
              {description}
            </Text>
          </View>
        </View>

        <View className="items-end justify-between py-[13px]">
          <Text className="font-pretendardBold text-p" style={{ color: accentColor }}>
            {startTime}
          </Text>
          <Text className="mt-[2px] text-p text-gray">{endTime}</Text>
        </View>
      </View>

      {isCurrentSchedule ? (
        actionLayout === 'fullWidth' ? (
          <View className="mt-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressAction}
              disabled={actionDisabled}
              className="h-[44px] w-full items-center justify-center rounded-[8px] bg-main"
              style={{ backgroundColor: actionDisabled ? COLORS.chip : accentColor }}>
              <Text
                className="font-pretendardSemiBold text-h3"
                style={{ color: actionDisabled ? COLORS.black : COLORS.white }}>
                {actionLabel}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-p text-gray">{currentStatusText}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (actionDisabled) return;
                if (onPressAction) {
                  onPressAction();
                  return;
                }
                if (!tripId) return;
                navigation.navigate('ScheduleMap', { tripId });
              }}
              disabled={actionDisabled}
              className="h-[36px] flex-row items-center justify-center rounded-[6px] p-[10px]"
              style={{ backgroundColor: actionDisabled ? COLORS.chip : accentColor }}>
              <Text
                className="text-center text-p"
                style={{
                  ...ACTION_LABEL_TEXT_STYLE,
                  color: actionDisabled ? COLORS.black : COLORS.white,
                }}>
                {actionLabel}
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : null}
    </Pressable>
  );
};

TripDetailCard.displayName = 'TripDetailCard';

export default TripDetailCard;
export { TripDetailCard };
