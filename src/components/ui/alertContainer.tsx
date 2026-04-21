import { ScheduleInfoIcon, WeatherInfoIcon } from '@/assets';
import { AlertItemProps } from '@/types/alert';
import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';

export const AlertContainer = (alert: AlertItemProps) => {
  const formatDate = (date?: string) => {
    if (!date) return '';
    return dayjs(date).format('HH:mm');
  };

  return (
    <View className="mx-4 flex-row items-start bg-white p-4 shadow-sm">
      {/* 왼쪽 아이콘 영역 */}
      <View className="mr-3 mt-1">
        {alert.title == '일정 안내' ? (
          <ScheduleInfoIcon className="h-12 w-12" />
        ) : (
          <WeatherInfoIcon className="h-12 w-12" />
        )}
      </View>

      {/* 텍스트 컨텐츠 영역 */}
      <View className="flex-1">
        <View className="flex-row items-start">
          <View className="mr-2 flex-1">
            <Text className="font-pretendardBold text-h3 leading-tight text-black">
              {alert.title}
            </Text>
            <Text className="mt-1 text-p1 leading-relaxed text-gray">{alert.content}</Text>
          </View>
          <Text className="shrink-0 text-p text-gray">{formatDate(alert.sendAt)}</Text>
        </View>
      </View>
    </View>
  );
};

AlertContainer.displayName = 'AlertContainer';

export default AlertContainer;
