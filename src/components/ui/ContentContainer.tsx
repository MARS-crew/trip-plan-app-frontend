import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Shadow } from 'react-native-shadow-2';

// ============ Types ============
export interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

// ============ Component ============
export const ContentContainer = React.memo<ContentContainerProps>(
  ({ children, className }) => {
    // 파생 값
    const { widthClass, otherClasses } = useMemo(() => {
      const widthMatch = className?.match(/\bw-\[?\d+px\]?/);
      const width = widthMatch ? widthMatch[0] : null;
      const other = width 
        ? className?.replace(new RegExp(`\\b${width}\\s*`), '').trim()
        : className;
      return { widthClass: width, otherClasses: other };
    }, [className]);

    // 렌더링
    return (
      <View className={widthClass || undefined}>
        <Shadow
          distance={3}
          startColor="#00000025"
          endColor="#00000000"
          offset={[0, 0]}
          paintInside={false}
          containerStyle={{ width: widthClass ? undefined : '100%', alignSelf: 'stretch' }}
          style={{ borderRadius: 8, width: widthClass ? undefined : '100%' }}>
          <View className={`bg-white rounded-lg ${otherClasses ?? ''}`}>
            {children}
            dsadsada
          </View>
        </Shadow>
      </View>
    );
  },
);

ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
