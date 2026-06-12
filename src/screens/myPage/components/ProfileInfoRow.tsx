import React from 'react';
import { Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import CalendarIcon from '@/assets/icons/calendar.svg';
import EarthIcon from '@/assets/icons/earth.svg';
import EmailIcon from '@/assets/icons/email.svg';
import GenderIcon from '@/assets/icons/gender.svg';
import NicknameIcon from '@/assets/icons/nickname.svg';
import type { ProfileInfoRowProps, ProfileItemType } from '../types/myPage.types';

const PROFILE_ICONS: Record<ProfileItemType, React.FC<SvgProps>> = {
  nickname: NicknameIcon,
  email: EmailIcon,
  birthday: CalendarIcon,
  gender: GenderIcon,
  country: EarthIcon,
};

const ProfileInfoRow: React.FC<ProfileInfoRowProps> = ({ item, showDivider }) => {
  const Icon = PROFILE_ICONS[item.type];

  return (
    <View
      className={`flex-row items-center px-4 py-4 ${
        showDivider ? 'border-b border-borderGray' : ''
      }`}>
      <View className="h-9 w-9 items-center justify-center rounded-lg bg-chip">
        <Icon width={16} height={16} />
      </View>

      <View className="ml-3">
        <Text className="text-p text-gray">{item.label}</Text>
        <Text className="font-pretendardMedium text-p1 text-black">{item.value}</Text>
      </View>
    </View>
  );
};

ProfileInfoRow.displayName = 'ProfileInfoRow';

const MemoizedProfileInfoRow = React.memo(ProfileInfoRow);

export default MemoizedProfileInfoRow;
export { MemoizedProfileInfoRow as ProfileInfoRow };
