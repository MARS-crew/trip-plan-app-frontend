import React, { useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import type { IconProps } from '@/assets/icons';

// ============ Types ============
export interface IconButtonProps {
  icon: React.ComponentType<IconProps>;
  onPress: () => void;
  iconSize?: number;
  backgroundColor?: string;
  backgroundColorOpacity?: number;
  accessibilityLabel?: string;
  className?: string;
}

// ============ Constants ============
const DEFAULT_SIZE = 36;
const DEFAULT_BACKGROUND_COLOR = '#4F4F4F';
const DEFAULT_BACKGROUND_OPACITY = 1.0;
const DEFAULT_ICON_SIZE = 20;

// ============ Component ============
export const IconButton = React.memo<IconButtonProps>(
  ({
    icon: IconComponent,
    onPress,
    iconSize = DEFAULT_ICON_SIZE,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    backgroundColorOpacity = DEFAULT_BACKGROUND_OPACITY,
    accessibilityLabel,
    className,
  }) => {
    // Hooks
    const handlePress = useCallback(() => {
      onPress();
    }, [onPress]);

    // 파생 값
    const borderRadius = DEFAULT_SIZE / 2;
    // hex 색상을 rgba로 변환
    const hexToRgba = (hex: string, opacity: number): string => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    const rgbaColor = hexToRgba(backgroundColor, backgroundColorOpacity);

    // 렌더링
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className={`items-center justify-center ${className ?? ''}`}>
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{
            backgroundColor: rgbaColor,
          }}>
          <IconComponent width={iconSize} height={iconSize} />
        </View>
      </TouchableOpacity>
    );
  },
);

IconButton.displayName = 'IconButton';
