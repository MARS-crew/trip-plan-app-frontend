import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '@/assets/icons/backArrow.svg';
import { COLORS } from '@/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const cardStyle = {
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
  elevation: 1,
};

const ProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = React.useState('');
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isCodeVerified, setIsCodeVerified] = React.useState(false);

  const handlePressSendCode = React.useCallback(() => {
    setIsCodeSent(true);
    setIsCodeVerified(false);
    setVerificationCode('');
  }, []);

  const handleChangeVerificationCode = React.useCallback((value: string) => {
    const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 6);
    setVerificationCode(digitsOnly);
    if (isCodeVerified) {
      setIsCodeVerified(false);
    }
  }, [isCodeVerified]);

  const handleConfirmCode = React.useCallback(() => {
    setIsCodeVerified(verificationCode.length === 6);
  }, [verificationCode]);

  const handleMoveToProfileEdit = React.useCallback(() => {
    if (!isCodeVerified) {
      return;
    }
    navigation.navigate('ProfileEditDetailScreen');
  }, [isCodeVerified, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="h-14 flex-row items-center px-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={navigation.goBack}
          className="mr-1 ml-1 h-10 w-10 items-start justify-center">
          <BackArrow width={20} height={20} />
        </TouchableOpacity>
        <Text className="text-h font-pretendardBold text-black">프로필 수정</Text>
      </View>

      <View className="px-4 pt-3">
        <View className="rounded-lg border border-borderGray bg-white px-6 pb-4 pt-6" style={cardStyle}>
          <Text className="text-p text-gray">이메일을 인증하고 프로필을 수정하세요.</Text>

          <View className="mt-6">
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">이메일</Text>
              <Text className="text-p1 font-pretendardMedium text-statusError">*</Text>
            </View>

            <View className="mt-2 flex-row items-center">
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`h-[46px] flex-1 rounded-xl border border-borderGray px-3 text-p1 text-black ${isCodeSent ? 'bg-emailBackground' : 'bg-inputBackground'}`}
              />

              <TouchableOpacity
                onPress={handlePressSendCode}
                activeOpacity={0.85}
                className="ml-2 h-[46px] w-[107px] items-center justify-center rounded-xl border border-borderGray bg-white">
                <Text className="text-p text-gray">{isCodeSent ? '재전송' : '인증번호 발송'}</Text>
              </TouchableOpacity>
            </View>

            {isCodeSent && (
              <>
                <Text className="mt-2 text-p text-statusSuccess">인증번호가 발송되었습니다. 이메일을 확인해주세요.</Text>

                <View className="mt-4">
                  <View className="flex-row items-center">
                    <Text className="text-h3 font-pretendardSemiBold text-black">인증번호</Text>
                    <Text className="text-p1 font-pretendardMedium text-statusError">*</Text>
                  </View>

                  <View className="mt-2 flex-row items-center">
                    <TextInput
                      value={verificationCode}
                      onChangeText={handleChangeVerificationCode}
                      placeholder="6자리 인증번호"
                      placeholderTextColor={COLORS.gray}
                      keyboardType="number-pad"
                      className="h-[46px] flex-1 rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-black"
                    />

                    <TouchableOpacity
                      onPress={handleConfirmCode}
                      activeOpacity={0.85}
                      className="ml-2 h-[46px] w-[107px] items-center justify-center rounded-xl border border-borderGray bg-white">
                      <Text className="text-p text-gray">확인</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            disabled={!isCodeVerified}
            activeOpacity={0.85}
            onPress={handleMoveToProfileEdit}
            className={`mt-4 h-11 items-center justify-center rounded-lg ${isCodeVerified ? 'bg-main' : 'bg-main/50'}`}>
            <Text className="text-p1 font-pretendardSemiBold text-white">프로필 수정으로 이동</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

ProfileEditScreen.displayName = 'ProfileEditScreen';

export default ProfileEditScreen;
export { ProfileEditScreen };
