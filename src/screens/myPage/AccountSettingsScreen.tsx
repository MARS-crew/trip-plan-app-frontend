import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NicknameIcon from '@/assets/icons/nickname.svg';
import EmailIcon from '@/assets/icons/email.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import GenderIcon from '@/assets/icons/gender.svg';
import EarthIcon from '@/assets/icons/earth.svg';
import SecessionIcon from '@/assets/icons/secession.svg';
import { COLORS } from '@/constants';
import { TopBar } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';
import { getSetting } from '@/services';
import type { Gender, GetSettingData } from '@/types/mypage';
import {
  WithdrawConfirmModal,
  WithdrawWarningModal,
  WithdrawReasonModal,
} from './components';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileItem {
  id: string;
  label: string;
  value: string;
  type: 'nickname' | 'email' | 'birthday' | 'gender' | 'country';
}

type WithdrawModalStep = 'none' | 'step1' | 'step2' | 'step3';

const GENDER_LABEL: Record<Gender, string> = {
  MALE: '남자',
  FEMALE: '여자',
  OTHER: '기타',
};

const buildProfileItems = (data: GetSettingData): ProfileItem[] => [
  { id: 'nickname', label: '닉네임', value: data.nickname, type: 'nickname' },
  { id: 'email', label: '이메일', value: data.email, type: 'email' },
  { id: 'birthday', label: '생년월일', value: data.birth, type: 'birthday' },
  { id: 'gender', label: '성별', value: GENDER_LABEL[data.gender] ?? '-', type: 'gender' },
  { id: 'country', label: '국가', value: data.countryCode, type: 'country' },
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
  const [withdrawModalStep, setWithdrawModalStep] = React.useState<WithdrawModalStep>('none');
  const [setting, setSetting] = React.useState<GetSettingData | null>(null);

  React.useEffect(() => {
    let isActive = true;

    const fetchSetting = async (): Promise<void> => {
      try {
        const data = await getSetting();
        if (isActive) {
          setSetting(data);
        }
      } catch {
        // 조회 실패 시 빈 상태 유지
      }
    };

    fetchSetting();

    return () => {
      isActive = false;
    };
  }, []);

  const profileItems = React.useMemo<ProfileItem[]>(
    () => (setting ? buildProfileItems(setting) : []),
    [setting],
  );

  const handleCloseWithdrawModal = React.useCallback((): void => {
    setWithdrawModalStep('none');
  }, []);

  const handleOpenWithdrawModal = React.useCallback((): void => {
    setWithdrawModalStep('step1');
  }, []);

  const handleWithdraw = React.useCallback((): void => {
    handleCloseWithdrawModal();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }, [handleCloseWithdrawModal, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="계정 설정" onPress={navigation.goBack} />
      <View className="px-4">
        <Text className="ml-2 mt-5 font-pretendardSemiBold text-p1 text-black">프로필 설정</Text>

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
                <Text className="font-pretendardMedium text-p1 text-black">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-6 rounded-lg border border-withdrawDanger bg-withdrawBg px-4 py-4">
          <View className="flex-row items-center">
            <SecessionIcon width={20} height={20} />
            <Text className="ml-2 font-pretendardSemiBold text-h2 text-statusError">회원 탈퇴</Text>
          </View>

          <Text className="mt-4 font-pretendardMedium text-p1 text-gray">
            계정을 삭제하면 모든 여행 기록, 저장된 장소, 개인 설정이 영구적으로 삭제됩니다. 이
            작업은 되돌릴 수 없습니다
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenWithdrawModal}
            className="mt-4 rounded-lg py-3"
            style={{ backgroundColor: COLORS.statusError }}>
            <Text className="text-center font-pretendardSemiBold text-h3 text-white">
              회원 탈퇴
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <WithdrawConfirmModal
        visible={withdrawModalStep === 'step1'}
        onConfirm={() => setWithdrawModalStep('step2')}
        onClose={handleCloseWithdrawModal}
      />

      <WithdrawWarningModal
        visible={withdrawModalStep === 'step2'}
        onConfirm={() => setWithdrawModalStep('step3')}
        onClose={handleCloseWithdrawModal}
      />

      <WithdrawReasonModal
        visible={withdrawModalStep === 'step3'}
        onWithdraw={handleWithdraw}
        onBack={() => setWithdrawModalStep('step2')}
        onClose={handleCloseWithdrawModal}
      />
    </SafeAreaView>
  );
};

AccountSettingsScreen.displayName = 'AccountSettingsScreen';

export default AccountSettingsScreen;
export { AccountSettingsScreen };
