import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
export interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

// ============ Component ============
export const ContentContainer = React.memo<ContentContainerProps>(({ children, className, compact }) => {
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
  if (compact) {
    return (
      <Shadow
        distance={2}
        startColor="#00000025"
        endColor="#00000000"
        offset={[0, 0]}
        paintInside={false}
        containerStyle={{ alignSelf: 'flex-start' }}
        style={{ borderRadius: 8 }}>
        <View className={`rounded-lg bg-white self-start ${otherClasses ?? ''}`}>{children}</View>
      </Shadow>
    );
  }

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
        <View className={`rounded-lg bg-white ${otherClasses ?? ''}`}>{children}</View>
      </Shadow>
    </View>
  );
});

ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
