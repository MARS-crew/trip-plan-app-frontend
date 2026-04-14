import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { SocialLoginButtonProps } from '@/types/login';

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  label,
  bgClassName,
  textClassName,
  icon,
  outlined = false,
}) => {
  const outlineClassName = outlined ? 'border border-borderGray' : '';

  return (
    <Pressable
      className={`mt-3 h-11 w-full flex-row items-center justify-center rounded-lg px-5 ${bgClassName} ${outlineClassName}`}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <View className="flex-row items-center justify-center">
        <View className="mr-3">{icon}</View>
        <Text className={`fontfamily-No font-pretendardMedium text-p1 ${textClassName}`}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

SocialLoginButton.displayName = 'SocialLoginButton';

export default SocialLoginButton;
