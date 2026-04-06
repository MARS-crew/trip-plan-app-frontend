import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { MarkerGrayIcon } from '@/assets/icons';
import { COLORS } from '@/constants/colors';

export interface TripDetailCardProps {
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
  actionLayout?: 'inline' | 'fullWidth';
  onPressCard?: () => void;
  accentColor?: string;
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
  actionLayout = 'inline',
  onPressCard,
  accentColor = COLORS.main,
}) => {
const navigation = useNavigation<TripDetailNavigation>();
  return (
    <Pressable
      onPress={onPressCard}
      disabled={!onPressCard}
      className="w-full rounded-[8px] border border-borderGray bg-white px-4 py-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-start">
          <View
            className="mr-3 h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: accentColor }}
          >
            <Text className="text-h3 font-pretendardSemiBold text-white">{order}</Text>
          </View>

          <View className="flex-1">
            <Text className="text-h3 font-pretendardSemiBold text-black">{title}</Text>

            <View className="mt-[2px] flex-row items-center">
              <MarkerGrayIcon width={12} height={12} />
              <Text className="ml-1 text-p text-gray">{location}</Text>
            </View>

            <Text className="mt-1 text-p text-gray">{description}</Text>
          </View>
        </View>

        <View className="justify-between py-[13px] items-end">
          <Text className="text-p font-pretendardBold" style={{ color: accentColor }}>{startTime}</Text>
          <Text className="mt-[2px] text-p text-gray">{endTime}</Text>
        </View>
      </View>

      {isCurrentSchedule ? (
        actionLayout === 'fullWidth' ? (
          <View className="mt-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressAction}
              className="h-[44px] w-full items-center justify-center rounded-[8px] bg-main"
              style={{ backgroundColor: accentColor }}
            >
              <Text className="text-h3 font-pretendardSemiBold text-white">{actionLabel}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-p text-gray">{currentStatusText}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ScheduleMap')}
              className="h-[36px] flex-row items-center justify-center rounded-[6px] p-[10px]"
              style={{ backgroundColor: accentColor }}
            >
              <Text
                className="text-p text-center text-white"
                style={{ includeFontPadding: false, textAlignVertical: 'center' }}
              >
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
