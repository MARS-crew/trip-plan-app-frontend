import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackArrow from '@/assets/icons/backArrow.svg';
import NicknameIcon from '@/assets/icons/nickname.svg';
import EmailIcon from '@/assets/icons/email.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import GenderIcon from '@/assets/icons/gender.svg';
import EarthIcon from '@/assets/icons/earth.svg';
import { COLORS } from '@/constants';
import type { RootStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileItem {
  id: string;
  label: string;
  value: string;
  type: 'nickname' | 'email' | 'birthday' | 'gender' | 'country';
}

const profileItems: ProfileItem[] = [
  { id: 'nickname', label: '닉네임', value: '여행자', type: 'nickname' },
  { id: 'email', label: '이메일', value: 'traveler@gmail.com', type: 'email' },
  { id: 'birthday', label: '생년월일', value: '2003-07-08', type: 'birthday' },
  { id: 'gender', label: '성별', value: '여자', type: 'gender' },
  { id: 'country', label: '국가', value: '대한민국', type: 'country' },
];

const ProfileItemIcon: React.FC<{ type: ProfileItem['type'] }> = ({ type }) => {
  if (type === 'nickname') {
    return <NicknameIcon width={16} height={16} />;
  }

  if (type === 'email') {
    return <EmailIcon width={16} height={16} />;
  }

  if (type === 'birthday') {
    return <CalendarIcon width={16} height={16} />;
  }

  if (type === 'gender') {
    return <GenderIcon width={16} height={16} />;
  }

  return <EarthIcon width={16} height={16} />;
};

const AccountSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="px-4 pt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={navigation.goBack}
            className="mr-1 ml-2 h-10 w-10 items-start justify-center">
            <BackArrow width={20} height={20} />
          </TouchableOpacity>
          <Text className="text-h font-bold text-black">계정 설정</Text>
        </View>

        <Text className="ml-2 mt-9 text-p1 font-semibold text-black">프로필 설정</Text>

        <View className="mt-3 overflow-hidden rounded-lg border border-borderGray bg-white">
          {profileItems.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center px-4 py-4 ${
                index !== profileItems.length - 1 ? 'border-b border-borderGray' : ''
              }`}>
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-chip">
                <ProfileItemIcon type={item.type} />
              </View>

              <View className="ml-3">
                <Text className="text-p text-gray">{item.label}</Text>
                <Text className="text-p1 font-medium text-black">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View
          className="mt-5 rounded-lg px-4 py-4"
          style={{
            borderWidth: 1,
            borderColor: COLORS.withdrawDanger,
            backgroundColor: COLORS.withdrawBg,
          }}>
          <View className="flex-row items-center">
            <Text className="text-h2" style={{ color: COLORS.statusError }}>
              ⚠
            </Text>
            <Text className="ml-2 text-h2 font-semibold" style={{ color: COLORS.statusError }}>
              회원 탈퇴
            </Text>
          </View>

          <Text className="mt-4 text-p1 font-medium text-p1 text-gray">
            계정을 삭제하면 모든 여행 기록, 저장된 장소, 개인 설정이 영구적으로 삭제됩니다.
            이 작업은 되돌릴 수 없습니다
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            className="mt-4 rounded-lg py-3"
            style={{ backgroundColor: COLORS.statusError }}>
            <Text className="text-center text-h3 font-semibold text-white">회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

AccountSettingsScreen.displayName = 'AccountSettingsScreen';

export default AccountSettingsScreen;
export { AccountSettingsScreen };
