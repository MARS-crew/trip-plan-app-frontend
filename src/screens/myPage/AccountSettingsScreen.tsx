import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, InteractionManager, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '@/constants';
import { TopBar } from '@/components/ui';
import type { RootStackParamList } from '@/navigation';
import { deleteAccount, getSetting } from '@/services';
import { useAuthStore } from '@/store';
import type { WithdrawRequest } from '@/types/auth';
import type { Gender, GetSettingData } from '@/types/mypage';
import { showToastMessage } from '@/utils';
import { handleError } from '@/utils/error';
import {
  ProfileInfoRow,
  WithdrawConfirmModal,
  WithdrawReasonModal,
  WithdrawSection,
  WithdrawWarningModal,
} from '@/screens/myPage/components';
import type { ProfileItem } from '@/screens/myPage/types/myPage.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const AccountSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [withdrawModalStep, setWithdrawModalStep] = useState<WithdrawModalStep>('none');
  const [setting, setSetting] = useState<GetSettingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!accessToken) return;

    let isActive = true;

    const fetchSetting = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const data = await getSetting();
        if (isActive) {
          setSetting(data);
        }
      } catch (error) {
        if (isActive) {
          showToastMessage(handleError(error) || '계정 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchSetting();

    return () => {
      isActive = false;
    };
  }, [accessToken]);

  const profileItems = useMemo<ProfileItem[]>(
    () => (setting ? buildProfileItems(setting) : []),
    [setting],
  );

  const handleCloseWithdrawModal = useCallback((): void => {
    setWithdrawModalStep('none');
  }, []);

  const handleOpenWithdrawModal = useCallback((): void => {
    setWithdrawModalStep('step1');
  }, []);

  const handleWithdraw = useCallback(
    async (payload: WithdrawRequest): Promise<void> => {
      try {
        await deleteAccount(payload);
      } catch (error) {
        showToastMessage(
          handleError(error) || '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
        return;
      }

      // 모달을 먼저 닫고, 모달 dismiss 애니메이션이 끝난 뒤에 토큰 정리 + 로그인 화면 리셋을 수행한다.
      // 모달이 떠 있는 상태에서 navigation.reset을 호출하면 네이티브 모달이 화면 위에 남아
      // 로그인 화면 전환이 사용자에게 보이지 않기 때문이다.
      handleCloseWithdrawModal();
      InteractionManager.runAfterInteractions(() => {
        useAuthStore.getState().clearTokens();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      });
    },
    [handleCloseWithdrawModal, navigation],
  );

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="계정 설정" onPress={navigation.goBack} />
      <View className="px-4">
        <Text className="ml-2 mt-5 font-pretendardSemiBold text-p1 text-black">프로필 설정</Text>

        <View className="mt-3 overflow-hidden rounded-lg border border-borderGray bg-white">
          {isLoading ? (
            <View className="items-center justify-center px-4 py-10">
              <ActivityIndicator color={COLORS.main} />
            </View>
          ) : (
            profileItems.map((item, index) => (
              <ProfileInfoRow
                key={item.id}
                item={item}
                showDivider={index !== profileItems.length - 1}
              />
            ))
          )}
        </View>

        <WithdrawSection onPressWithdraw={handleOpenWithdrawModal} />
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
