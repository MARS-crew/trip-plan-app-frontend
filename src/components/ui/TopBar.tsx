import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackArrow, LeftArrowIcon } from '@/assets/icons';

export interface TopBarProps {
  title: string;
  onPress: () => void;
  className ?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onPress , className }) => {
  return (
    <View className={`flex-row items-center h-14 pl-6 ${className ?? ''}`}>
      <Pressable
        onPress={onPress}
        className="items-start justify-center h-10 w-10"
        accessibilityRole="button"
        accessibilityLabel="뒤로가기">
        <BackArrow 
            className="w-5 h-5"
            accessibilityLabel="뒤로가기"
        />
      </Pressable>

      <Text numberOfLines={1} className="text-center text-h font-bold text-black">
        {title}
      </Text>

      <View className="h-10 w-10" />
    </View>
  );
};

TopBar.displayName = 'TopBar';
