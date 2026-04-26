import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import BellIcon from '@/assets/icons/bell.svg';
import SettingIcon from '@/assets/icons/setting.svg';
import VectorIcon from '@/assets/icons/vector.svg';
import { CARD_SHADOW } from '@/constants';
import type { MyPageSettingItem } from '@/screens/myPage/types';

interface MyPageAccountSectionProps {
  items: MyPageSettingItem[];
  onPressAccountSettings: () => void;
  onPressNotificationSettings: () => void;
}

const SettingItemIcon: React.FC<{ type: MyPageSettingItem['type'] }> = ({ type }) => {
  if (type === 'account') {
    return <SettingIcon width={16} height={16} />;
  }

  return <BellIcon width={16} height={16} />;
};

const MyPageAccountSection: React.FC<MyPageAccountSectionProps> = ({
  items,
  onPressAccountSettings,
  onPressNotificationSettings,
}) => {
  return (
    <>
      <Text className="ml-1 mt-5 font-pretendardSemiBold text-xs text-gray">계정</Text>

      <View className="mt-2 overflow-hidden rounded-lg border border-white bg-white" style={CARD_SHADOW}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={
              item.type === 'account' ? onPressAccountSettings : onPressNotificationSettings
            }
            activeOpacity={0.8}
            className={`flex-row items-center justify-between px-4 py-4 ${index !== items.length - 1 ? 'border-b border-borderGray' : ''}`}>
            <View className="flex-row items-center">
              <View className="h-9 w-9 items-center justify-center rounded-md bg-chip">
                <SettingItemIcon type={item.type} />
              </View>
              <View className="ml-3">
                <Text className="font-pretendardSemiBold text-h3 text-black">{item.title}</Text>
                <Text className="mt-0.5 text-p1 text-gray">{item.description}</Text>
              </View>
            </View>

            <VectorIcon width={16} height={16} />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

MyPageAccountSection.displayName = 'MyPageAccountSection';

export default MyPageAccountSection;
export { MyPageAccountSection };
