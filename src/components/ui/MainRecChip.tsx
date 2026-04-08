import React from 'react';
import { View, Text } from 'react-native';

export interface MainRecChipProps {
  label: string;
  className?: string;
}

export const MainRecChip: React.FC<MainRecChipProps> = ({ label, className }) => {
  return (
    <View className={`px-3 py-[2px] rounded-full bg-chip items-center justify-center ${className ?? ''}`}>
      <Text className="text-p text-black">{label}</Text>
    </View>
  );
};

export default MainRecChip;