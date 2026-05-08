import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import type { WishContentContainerProps } from '@/types/wishlist';

// ============ Component ============
export const WishContentContainer = React.memo<WishContentContainerProps>(
  ({ children, className }) => {
    // 파생 값
    const { widthClass, otherClasses } = useMemo(() => {
      if (!className) return { widthClass: null, otherClasses: undefined };

      // tokens 기반으로 width 클래스(w-*, w-[*])만 분리해 안전하게 제거
      const tokens = className.split(/\s+/).filter(Boolean);
      const widthTokenIndex = tokens.findIndex((t) => /^w-(?:\[[^\]]+\]|\d+)$/.test(t));

      if (widthTokenIndex === -1) {
        return { widthClass: null, otherClasses: className };
      }

      const widthClass = tokens[widthTokenIndex] ?? null;
      const otherClasses = tokens
        .filter((_, idx) => idx !== widthTokenIndex)
        .join(' ')
        .trim();
      return { widthClass, otherClasses };
    }, [className]);

    // 렌더링
    return (
      <View className={widthClass || undefined}>
        <Shadow
          distance={2}
          startColor="#00000025"
          endColor="#00000000"
          offset={[0, 0]}
          paintInside={false}
          containerStyle={{ width: widthClass ? undefined : '100%', alignSelf: 'stretch' }}
          style={{ borderRadius: 8, width: widthClass ? undefined : '100%' }}>
          <View className={`bg-white rounded-lg ${otherClasses ?? ''}`}>{children}</View>
        </Shadow>
      </View>
    );
  },
);

WishContentContainer.displayName = 'WishContentContainer';

export default WishContentContainer;
