import React from 'react';
import { View, Text } from 'react-native';

// ============ Types ============
export type TripStatus = 'traveling' | 'scheduled' | 'completed';

export interface TripStatusChipProps {
  status: TripStatus;
  className?: string;
}

// ============ Constants ============
const STATUS_CONFIG = {
  traveling: {
    label: '여행 중',
    backgroundColor: 'rgba(34, 197, 94, 0.8)', // #22C55E with 80% opacity
  },
  scheduled: {
    label: '예정',
    backgroundColor: 'rgba(223, 108, 32, 0.8)', // COLORS.main with 80% opacity
  },
  completed: {
    label: '종료',
    backgroundColor: 'rgba(37, 29, 24, 0.8)', // COLORS.black with 80% opacity
  },
} as const;

// ============ Component ============
export const TripStatusChip: React.FC<TripStatusChipProps> = ({
  status,
  className,
}) => {
  // 파생 값
  const config = STATUS_CONFIG[status];

  // 렌더링
  return (
    <View
      className={`rounded-full px-4 h-[22px] items-center justify-center ${className ?? ''}`}
      style={{ backgroundColor: config.backgroundColor }}
      accessibilityLabel={config.label}>
      <Text className="text-p text-white">{config.label}</Text>
    </View>
  );
};

TripStatusChip.displayName = 'TripStatusChip';

export default TripStatusChip;
