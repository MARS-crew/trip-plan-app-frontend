import { ScheduleInfoIcon, WeatherInfoIcon } from '@/assets';
import React from 'react';
import { View, Text } from 'react-native';

export interface AlertProps { 
    title : string;
    time : string;
    contentInfo : string;
}

export const AlertContainer = ( alert :AlertProps) => {
  return (
    <View className="flex-row items-start p-4 mx-4 bg-white shadow-sm">
      {/* 왼쪽 아이콘 영역 */}
      <View className="mr-3 mt-1">
        {alert.title == '일정 안내' ? 
        <ScheduleInfoIcon className="w-12 h-12"/> :
        <WeatherInfoIcon className="w-12 h-12"/>    
    }
      </View>

      {/* 텍스트 컨텐츠 영역 */}
      <View className="flex-1">
        <View className="flex-row items-start">
          <View className="flex-1 mr-2">
            <Text className="text-h3 font-pretendardBold text-black leading-tight">
              {alert.title}
            </Text>
            <Text className="text-p1 text-gray leading-relaxed mt-1">
              {alert.contentInfo}
            </Text>
          </View>
          <Text className="text-gray text-p shrink-0">
            {alert.time}
          </Text>
        </View>
      </View>
    </View>
  );
};

AlertContainer.displayName = 'AlertContainer';

export default AlertContainer;