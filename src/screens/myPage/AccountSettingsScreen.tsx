import React from 'react';
import { Modal, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackArrow from '@/assets/icons/backArrow.svg';
import NicknameIcon from '@/assets/icons/nickname.svg';
import EmailIcon from '@/assets/icons/email.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import GenderIcon from '@/assets/icons/gender.svg';
import EarthIcon from '@/assets/icons/earth.svg';
import SecessionIcon from '@/assets/icons/secession.svg';
import { COLORS } from '@/constants';
import type { RootStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileItem {
  id: string;
  label: string;
  value: string;
  type: 'nickname' | 'email' | 'birthday' | 'gender' | 'country';
}

type WithdrawModalStep = 'none' | 'step1' | 'step2' | 'step3';
type WithdrawReason = 'access' | 'review' | 'recommend' | 'other';

interface WithdrawReasonItem {
  id: WithdrawReason;
  label: string;
}

const profileItems: ProfileItem[] = [
  { id: 'nickname', label: '닉네임', value: '여행자', type: 'nickname' },
  { id: 'email', label: '이메일', value: 'traveler@gmail.com', type: 'email' },
  { id: 'birthday', label: '생년월일', value: '2003-07-08', type: 'birthday' },
  { id: 'gender', label: '성별', value: '여자', type: 'gender' },
  { id: 'country', label: '국가', value: '대한민국', type: 'country' },
];

const withdrawReasons: WithdrawReasonItem[] = [
  { id: 'access', label: '앱에 잘 접속하지 않아요' },
  { id: 'review', label: '리뷰의 신뢰성이 떨어져요' },
  { id: 'recommend', label: '여행지 추천이 적당하지 않아요' },
  { id: 'other', label: '기타' },
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
  const [selectedReason, setSelectedReason] = React.useState<WithdrawReason | null>(null);
  const [otherReason, setOtherReason] = React.useState<string>('');

  const handleCloseWithdrawModal = React.useCallback((): void => {
    setWithdrawModalStep('none');
    setSelectedReason(null);
    setOtherReason('');
  }, []);

  const handleSelectWithdrawReason = React.useCallback((reason: WithdrawReason): void => {
    setSelectedReason(reason);
  }, []);

  const handleOpenWithdrawModal = React.useCallback((): void => {
    setWithdrawModalStep('step1');
  }, []);

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
          <Text className="text-h font-pretendardBold text-black">계정 설정</Text>
        </View>

        <Text className="ml-2 mt-9 text-p1 font-pretendardSemiBold text-black">프로필 설정</Text>

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
                <Text className="text-p1 font-pretendardMedium text-black">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={1}
          className="mt-6 rounded-lg border border-withdrawDanger bg-withdrawBg px-4 py-4">
          <View className="flex-row items-center">
            <SecessionIcon width={20} height={20} />
            <Text className="ml-2 text-h2 font-pretendardSemiBold text-statusError">회원 탈퇴</Text>
          </View>

          <Text className="mt-4 text-p1 font-pretendardMedium text-gray">
            계정을 삭제하면 모든 여행 기록, 저장된 장소, 개인 설정이 영구적으로 삭제됩니다.
            이 작업은 되돌릴 수 없습니다
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenWithdrawModal}
            className="mt-4 rounded-lg py-3"
            style={{ backgroundColor: COLORS.statusError }}>
            <Text className="text-center text-h3 font-pretendardSemiBold text-white">회원 탈퇴</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      <Modal
        visible={withdrawModalStep === 'step1'}
        transparent
        animationType="fade"
        onRequestClose={handleCloseWithdrawModal}>
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-xl bg-white px-4 pb-4 pt-5" style={{ maxWidth: 360 }}>
            <View className="items-center">
              <SecessionIcon width={24} height={24} />
              <Text className="mt-3 text-left text-h2 font-pretendardSemiBold text-black">
                서비스에서 탈퇴하시겠습니까?
              </Text>
            </View>

            <View className="mt-8 flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setWithdrawModalStep('step2')}
                className="w-[48%] rounded-xl bg-chip py-3">
                <Text className="text-center text-sm text-h3 font-pretendardSemiBold text-gray">예</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCloseWithdrawModal}
                className="w-[48%] rounded-xl bg-main py-3">
                <Text className="text-center text-sm text-h3 font-pretendardSemiBold text-white">취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={withdrawModalStep === 'step2'}
        transparent
        animationType="fade"
        onRequestClose={handleCloseWithdrawModal}>
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-xl bg-white px-4 pb-4 pt-4" style={{ maxWidth: 370 }}>
            <View className="items-center">
              <SecessionIcon width={24} height={24} />
              <Text className="mt-4 text-center text-base font-pretendardSemiBold text-black leading-6">
                탈퇴시 여행 일정 및 리뷰가 사라지게{'\n'}
                되며 복구가 불가합니다.{"\n"}
                탈퇴 하시겠습니까?
              </Text>
            </View>

            <View className="mt-8 flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setWithdrawModalStep('step3')}
                className="h-11 w-[48%] justify-center rounded-lg bg-chip">
                <Text className="text-center text-sm font-pretendardSemiBold text-gray">회원 탈퇴</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCloseWithdrawModal}
                className="h-11 w-[48%] justify-center rounded-lg bg-main">
                <Text className="text-center text-sm font-pretendardSemiBold text-white">취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={withdrawModalStep === 'step3'}
        transparent
        animationType="fade"
        onRequestClose={handleCloseWithdrawModal}>
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-xl bg-white px-4 pb-4 pt-5" style={{ maxWidth: 370 }}>
            <View className="ml-2">
              <SecessionIcon width={24} height={24} />
            </View>
            <Text className="ml-2 mt-[15] text-h2 font-pretendardSemiBold text-black">회원 탈퇴를 원하시는 이유를 선택해주세요.</Text>
            <Text className="ml-2 mt-1 text-p1 font-pretendardMedium text-gray leading-6">
              서비스에 만족을 드리지 못해 죄송합니다.{"\n"}
              탈퇴 사유를 남겨주시면 서비스 개선에 더욱 힘쓰겠습니다.
            </Text>

            <View className="mt-4">
              {withdrawReasons.map(reason => {
                const isSelected = selectedReason === reason.id;
                return (
                  <TouchableOpacity
                    key={reason.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelectWithdrawReason(reason.id)}
                    className="ml-2 mb-[9px] flex-row items-center">
                    <View
                      className={`h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? 'border-main' : 'border-borderGray'
                      }`}>
                      {isSelected ? <View className="h-3.5 w-3.5 rounded-full bg-main" /> : null}
                    </View>
                    <Text className="mb-2 ml-3 text-p1 font-pretendardMedium text-gray">{reason.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedReason === 'other' ? (
              <TextInput
                value={otherReason}
                onChangeText={setOtherReason}
                placeholder="탈퇴 사유를 입력해주세요"
                placeholderTextColor={COLORS.gray}
                multiline
                textAlignVertical="top"
                className="ml-6 mr-1 mt-0.5 h-32 rounded-xl border border-borderGray bg-inputBackground px-4 py-3 text-p1 text-black"
              />
            ) : null}

            <View className="flex-row mt-4 justify-between">
              <TouchableOpacity activeOpacity={0.85} className="w-[48%] rounded-xl bg-chip py-3">
                <Text className="text-center text-h3 font-pretendardSemiBold text-gray">탈퇴 하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setWithdrawModalStep('step2')}
                className="w-[48%] rounded-xl bg-main py-3">
                <Text className="text-center text-h3 font-pretendardSemiBold text-white">이전</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

AccountSettingsScreen.displayName = 'AccountSettingsScreen';

export default AccountSettingsScreen;
export { AccountSettingsScreen };
