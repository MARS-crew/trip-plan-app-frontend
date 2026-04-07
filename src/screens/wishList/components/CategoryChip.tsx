import React, { useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { CategoryChipProps } from '@/screens/wishList/types';

// ============ Component ============
export const CategoryChip = React.memo<CategoryChipProps>(
  ({ label, onPress, isSelected = false, className, textClassName }) => {
    const handlePress = useCallback(() => {
      onPress?.();
    }, [onPress]);

    const defaultContainerStyle = 'items-center justify-center';

    // 선택 여부에 따른 색상만 자동으로 처리
    const bgStyle = isSelected ? 'bg-main' : 'bg-chip';
    const textStyle = isSelected ? 'text-white' : 'text-gray';

    // 렌더링 함수
    const renderContent = (
      <Text className={`${textStyle} ${textClassName ?? 'text-p'}`}>{label}</Text>
    );

    if (onPress) {
      return (
        <Pressable
          onPress={handlePress}
          className={`${defaultContainerStyle} ${bgStyle} ${className ?? 'px-2 py-[2px] rounded-2xl '}`}>
          {renderContent}
        </Pressable>
      );
    }

    return (
      <View
        className={`${defaultContainerStyle} ${bgStyle} ${className ?? 'px-2 py-[2px] rounded-2xl '}`}>
        {renderContent}
      </View>
    );
  },
);

CategoryChip.displayName = 'CategoryChip';
export default CategoryChip;
