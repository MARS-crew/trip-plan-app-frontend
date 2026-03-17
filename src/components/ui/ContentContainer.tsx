import React from 'react';
import { View } from 'react-native';

// ============ Types ============
export interface ContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

// ============ Component ============
export const ContentContainer = React.memo<ContentContainerProps>(
  ({ children, className }) => {
    // 렌더링
    return (
      <View className={`bg-white rounded-lg ${className ?? ''}`}>
        {children}
      </View>
    );
  },
);

ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
