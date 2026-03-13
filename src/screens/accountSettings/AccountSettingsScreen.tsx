import React from 'react';
import { Modal, TextInput, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BackArrow,
  NicknameIcon,
  EmailIcon,
  CalendarIcon,
  GenderIcon,
  EarthIcon,
  SecessionIcon,
} from '@/assets';
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

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="px-4 pt-2">
        <View className="flex-row items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={navigation.goBack}
            className="mr-2 h-10 w-10 items-start justify-center">
            <BackArrow width={20} height={20} />
          </TouchableOpacity>
          <Text className="text-h1 font-bold text-black">계정 설정</Text>
        </View>

        <Text className="mt-9 ml-2 text-p1 font-semibold text-black">프로필 설정</Text>

        <View className="mt-3 overflow-hidden rounded-2xl border border-borderGray bg-white">
          {profileItems.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row items-center px-4 py-3.5 ${
                index !== profileItems.length - 1 ? 'border-b border-borderGray' : ''
              }`}>
              <View className="h-9 w-9 items-center justify-center rounded-xl bg-chip">
                <ProfileItemIcon type={item.type} />
              </View>

              <View className="ml-3">
                <Text className="text-p1 text-gray">{item.label}</Text>
                <Text className="text-h2 font-semibold text-black">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-6 rounded-2xl border border-[#FF4D4F] bg-[#FFF5F5] px-4 py-4">
          <View className="flex-row items-center">
            <SecessionIcon width={24} height={24} />
            <Text className="ml-2 text-h2 font-bold text-[#FF4D4F]">회원 탈퇴</Text>
          </View>

          <Text className="mt-3 text-p1 text-gray">
            계정을 삭제하면 모든 여행 기록, 저장된 장소, 개인 설정이 영구적으로 삭제됩니다.
            이 작업은 되돌릴 수 없습니다
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setWithdrawModalStep('step1')}
            className="mt-4 rounded-xl bg-[#EF4444] py-3">
            <Text className="text-center text-h3 font-semibold text-white">회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={withdrawModalStep === 'step1'} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-2xl bg-white px-4 pb-4 pt-5" style={{ maxWidth: 360 }}>
            <View className="items-center">
              <SecessionIcon width={24} height={24} />
              <Text className="mt-3 text-center text-h1 font-bold text-black">
                서비스에서 탈퇴하시겠습니까?
              </Text>
            </View>

            <View className="mt-8 flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setWithdrawModalStep('step2')}
                className="w-[48%] rounded-xl bg-chip py-3">
                <Text className="text-center text-h3 font-semibold text-gray">예</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCloseWithdrawModal}
                className="w-[48%] rounded-xl bg-main py-3">
                <Text className="text-center text-h3 font-semibold text-white">취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={withdrawModalStep === 'step2'} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-2xl bg-white px-4 pb-4 pt-5" style={{ maxWidth: 360 }}>
            <View className="items-center">
              <SecessionIcon width={24} height={24} />
              <Text className="mt-3 text-center text-h1 font-bold text-black leading-8">
                탈퇴시 여행 일정 및 리뷰가 사라지게{"\n"}
                되며 복구가 불가능합니다.{"\n"}
                탈퇴 하시겠습니까?
              </Text>
            </View>

            <View className="mt-8 flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setWithdrawModalStep('step3')}
                className="w-[48%] rounded-xl bg-chip py-3">
                <Text className="text-center text-h3 font-semibold text-gray">회원 탈퇴</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCloseWithdrawModal}
                className="w-[48%] rounded-xl bg-main py-3">
                <Text className="text-center text-h3 font-semibold text-white">취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={withdrawModalStep === 'step3'} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-2xl bg-white px-4 pb-4 pt-5" style={{ maxWidth: 360 }}>
            <View className="ml-2">
              <SecessionIcon width={24} height={24} />
            </View>
            <Text className="mt-2 ml-2 text-h2 font-bold text-black">회원 탈퇴를 원하시는 이유를 선택해주세요.</Text>
            <Text className="mt-2 ml-2 text-p1  text-gray leading-6">
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
                    className="mb-3 ml-3 flex-row items-center">
                    <View
                      className={`h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? 'border-main' : 'border-borderGray'
                      }`}>
                      {isSelected ? <View className="h-2.5 w-2.5 rounded-full bg-main" /> : null}
                    </View>
                    <Text className="ml-3 text-p1 text-[#8C7B73]">{reason.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {selectedReason === 'other' ? (
              <TextInput
                value={otherReason}
                onChangeText={setOtherReason}
                placeholder="탈퇴 사유를 입력해주세요"
                placeholderTextColor="#8C7B73"
                multiline
                textAlignVertical="top"
                className="ml-6 mr-1 mt-0.5 h-32 rounded-2xl border border-[#E5E0DC] bg-[#FCFAF8] px-4 py-3 text-p1 text-black"
              />
            ) : null}

            <View className="mt-6 flex-row justify-between">
              <TouchableOpacity activeOpacity={0.85} className="w-[48%] rounded-xl bg-chip py-3">
                <Text className="text-center text-h3 font-semibold text-gray">탈퇴 하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setWithdrawModalStep('step2')}
                className="w-[48%] rounded-xl bg-main py-3">
                <Text className="text-center text-h3 font-semibold text-white">이전</Text>
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
