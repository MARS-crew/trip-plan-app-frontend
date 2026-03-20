import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackArrow, LeftArrowIcon } from '@/assets/icons';

export interface TopBarProps {
  title: string;
  onPress: () => void;
  className ?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  onPress,
  className,
}) => {
  return (
    <View className={`relative h-14 justify-center px-6 ${className ?? ''}`}>
      <Pressable
        onPress={onPress}
        className="items-start justify-center h-10 w-10 z-10"
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
      >
        <BackArrow
          className="h-5 w-5"
          accessibilityLabel="뒤로가기"
        />
      </Pressable>

      <Text
        numberOfLines={1}
        className="absolute left-16 text-center text-h font-bold text-black"
      >
        {title}
      </Text>
    </View>
  );
};

TopBar.displayName = 'TopBar';
