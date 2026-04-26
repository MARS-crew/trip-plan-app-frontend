import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import BookmarkIcon from '@/assets/icons/bookmark.svg';
import MapIcon from '@/assets/icons/map.svg';
import LocationOrangeIcon from '@/assets/icons/location_orange.svg';
import { CARD_SHADOW, COLORS } from '@/constants';
import type { MyPageStatItem } from '@/screens/myPage/types';

interface MyPageStatsSectionProps {
  stats: MyPageStatItem[];
  onPressVisitedPlaceList: () => void;
}

const StatIcon: React.FC<{ type: MyPageStatItem['type'] }> = ({ type }) => {
  if (type === 'map') {
    return <MapIcon width={20} height={20} fill={COLORS.main} />;
  }

  if (type === 'bookmark') {
    return <BookmarkIcon width={16} height={20} fill={COLORS.main} />;
  }

  return <LocationOrangeIcon width={20} height={20} />;
};

const MyPageStatsSection: React.FC<MyPageStatsSectionProps> = ({ stats, onPressVisitedPlaceList }) => {
  return (
    <View className="mt-4 flex-row justify-between">
      {stats.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={item.type === 'marker' ? 0.8 : 1}
          disabled={item.type !== 'marker'}
          onPress={item.type === 'marker' ? onPressVisitedPlaceList : undefined}
          className="w-[31.5%] rounded-lg border border-white bg-white py-4"
          style={CARD_SHADOW}>
          <View className="items-center">
            <StatIcon type={item.type} />
            <Text className="mt-2 font-pretendardBold text-h1 text-black">{item.value}</Text>
            <Text className="mt-0.5 text-p text-gray">{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

MyPageStatsSection.displayName = 'MyPageStatsSection';

export default MyPageStatsSection;
export { MyPageStatsSection };
