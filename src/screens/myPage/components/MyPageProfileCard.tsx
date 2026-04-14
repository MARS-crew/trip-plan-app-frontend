import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import EarthIcon from '@/assets/icons/earth1.svg';
import { COLORS } from '@/constants';

interface MyPageProfileCardProps {
  nickname: string;
  email: string;
  locationLabel: string;
  onPressEdit: () => void;
  avatarText?: string;
}

const cardStyle = {
  shadowColor: COLORS.gray,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 1,
};

const MyPageProfileCard: React.FC<MyPageProfileCardProps> = ({
  nickname,
  email,
  locationLabel,
  onPressEdit,
  avatarText = 't',
}) => {
  return (
    <View className="mt-3.5 rounded-lg border border-subtleBorder bg-white p-4" style={cardStyle}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-3 h-16 w-16 items-center justify-center rounded-full bg-contentBackground">
            <Text className="font-pretendardBold text-h2 text-main">{avatarText}</Text>
          </View>
          <View>
            <Text className="font-pretendardSemiBold text-h1 text-black">{nickname}</Text>
            <Text className="mt-0.5 text-p1 text-black">{email}</Text>
            <View className="mt-1 h-4 flex-row items-center">
              <View className="mt-0.5 h-4 w-3 items-center justify-center">
                <EarthIcon width={12} height={12} />
              </View>
              <Text className="ml-1 text-p leading-4 text-statusSuccess">현재 위치: {locationLabel}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={onPressEdit}
          activeOpacity={0.8}
          className="rounded-lg bg-chip px-3 py-1.5">
          <Text className="font-pretendardMedium text-p text-black">편집</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

MyPageProfileCard.displayName = 'MyPageProfileCard';

export default MyPageProfileCard;
export { MyPageProfileCard };
