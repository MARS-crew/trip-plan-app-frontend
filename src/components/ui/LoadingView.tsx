import React from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';

// ============ Types ============
export interface LoadingViewProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  edges?: readonly Edge[];
  className?: string;
}

export const LoadingView = React.memo<LoadingViewProps>(
  ({ message, size = 'large', color = COLORS.main, edges = ['top'], className }) => {
    return (
      <SafeAreaView
        className={`flex-1 items-center justify-center bg-screenBackground ${className ?? ''}`}
        edges={edges}>
        <ActivityIndicator size={size} color={color} />
        {message ? <Text className="mt-3 font-pretendardMedium text-p1 text-gray">{message}</Text> : null}
      </SafeAreaView>
    );
  },
);

LoadingView.displayName = 'LoadingView';

export default LoadingView;
