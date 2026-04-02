import React from 'react';
import { Text, View } from 'react-native';
import { TRIP_DAY_COLOR_PALETTE } from '@/constants/colors';

const getFallbackDayColor = (day: number) => {
  if (day <= 0) {
    return TRIP_DAY_COLOR_PALETTE[0];
  }

  return TRIP_DAY_COLOR_PALETTE[(day - 1) % TRIP_DAY_COLOR_PALETTE.length];
};

interface IndexMarkerProps {
  index: number | string;
  day: number;
  size?: number;
  selected?: boolean;
  color?: string;
}

const IndexMarker = ({ index, day, size = 28, selected = false, color }: IndexMarkerProps) => {
  const markerColor = color ?? getFallbackDayColor(day);
  const label = String(index);
  const ringSize = size + 6;

  return (
    <View
      className="items-center justify-center"
      style={[
        {
          width: selected ? ringSize : size,
          height: selected ? ringSize : size,
        },
      ]}
    >
      <View
        className={`items-center justify-center ${selected ? 'bg-white' : 'bg-transparent'}`}
        style={[
          {
            width: selected ? ringSize : size,
            height: selected ? ringSize : size,
            borderRadius: (selected ? ringSize : size) / 2,
          },
        ]}
      >
        <View
          className="items-center justify-center"
          style={[
            {
              shadowColor: '#00000080',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.5,
              shadowRadius: 3,
              elevation: 3,
            },
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: markerColor,
            },
          ]}
        >
          <Text
            className={`font-pretendardBold text-p text-white ${
              label.length >= 2 ? 'leading-[18px]' : 'leading-[20px]'}`}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default IndexMarker;
export type { IndexMarkerProps };
