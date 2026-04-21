import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import { TopBar } from '@/components/ui';
import { COLORS } from '@/constants';
import { requestEmailVerification, verifyEmailCode } from '@/services';
import { getFriendlyErrorMessage, showToastMessage } from '@/utils';

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
  const [emailError, setEmailError] = React.useState('');
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isCodeVerified, setIsCodeVerified] = React.useState(false);
  const [codeError, setCodeError] = React.useState('');
  const [isRequestingCode, setIsRequestingCode] = React.useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = React.useState(false);

  const isValidEmail = React.useCallback((value: string) => {
    const trimmed = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, []);

  const handleChangeEmail = React.useCallback(
    (value: string) => {
      setEmail(value);
      if (emailError) {
        setEmailError('');
      }
    },
    [emailError],
  );

  const handlePressSendCode = React.useCallback(async () => {
    if (isRequestingCode) {
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('이메일 형식이 올바르지 않습니다. pli@email.com 형식으로\n입력해주세요.');
      setIsCodeSent(false);
      setIsCodeVerified(false);
      setVerificationCode('');
      return;
    }

    setEmailError('');
    setCodeError('');
    setIsCodeVerified(false);
    setVerificationCode('');
    setIsRequestingCode(true);

    try {
      await requestEmailVerification(email.trim());
      setIsCodeSent(true);
    } catch (error) {
      console.error('handlePressSendCode Error:', error);
      setIsCodeSent(false);
      setIsCodeVerified(false);
      setVerificationCode('');
      showToastMessage(
        getFriendlyErrorMessage(error, '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'),
      );
    } finally {
      setIsRequestingCode(false);
    }
  }, [email, isRequestingCode, isValidEmail]);

  const handleChangeVerificationCode = React.useCallback(
    (value: string) => {
      const digitsOnly = value.replace(/[^0-9]/g, '').slice(0, 6);
      setVerificationCode(digitsOnly);
      if (isCodeVerified) {
        setIsCodeVerified(false);
      }
      if (codeError) {
        setCodeError('');
      }
    },
    [codeError, isCodeVerified],
  );

  const handleConfirmCode = React.useCallback(async () => {
    if (isVerifyingCode) {
      return;
    }

    if (verificationCode.length !== 6) {
      setCodeError('인증번호 6자리를 입력해주세요.');
      setIsCodeVerified(false);
      return;
    }

    setCodeError('');
    setIsVerifyingCode(true);

    try {
      const result = await verifyEmailCode(email.trim(), verificationCode);
      if (result.email_verified === 'Y') {
        setIsCodeVerified(true);
      } else {
        setIsCodeVerified(false);
        setCodeError('인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('handleConfirmCode Error:', error);
      setIsCodeVerified(false);
      setCodeError('');
      showToastMessage(
        getFriendlyErrorMessage(error, '인증번호 확인에 실패했습니다. 다시 시도해주세요.'),
      );
    } finally {
      setIsVerifyingCode(false);
    }
  }, [email, isVerifyingCode, verificationCode]);

  const handleMoveToProfileEdit = React.useCallback(() => {
    if (!isCodeVerified) {
      return;
    }
    navigation.navigate('ProfileEditDetailScreen');
  }, [isCodeVerified, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="프로필 수정" onPress={navigation.goBack} className="px-4" />

      <View className="px-4 pt-3">
        <View
          className="rounded-lg border border-borderGray bg-white px-6 pb-4 pt-6"
          style={cardStyle}>
          <Text className="text-p text-gray">이메일을 인증하고 프로필을 수정하세요.</Text>

          <View className="mt-6">
            <View className="flex-row items-center">
              <Text className="font-pretendardSemiBold text-h3 text-black">이메일</Text>
              <Text className="font-pretendardMedium text-p1 text-statusError">*</Text>
            </View>

            <View className="mt-2 flex-row items-center">
              <TextInput
                value={email}
                onChangeText={handleChangeEmail}
                placeholder="example@gmail.com"
                placeholderTextColor={COLORS.gray}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`h-[46px] flex-1 rounded-xl border border-borderGray px-3 text-p1 text-black ${isCodeSent ? 'bg-emailBackground' : 'bg-inputBackground'}`}
              />

              <TouchableOpacity
                onPress={handlePressSendCode}
                disabled={isRequestingCode}
                activeOpacity={0.85}
                className="ml-2 h-[46px] w-[107px] items-center justify-center rounded-xl border border-borderGray bg-white">
                <Text className="text-p text-gray">
                  {isRequestingCode ? '발송 중...' : isCodeSent ? '재전송' : '인증번호 발송'}
                </Text>
              </TouchableOpacity>
            </View>

            {emailError ? <Text className="mt-2 text-p text-statusError">{emailError}</Text> : null}

            {isCodeSent && (
              <>
                <Text className="mt-2 text-p text-statusSuccess">
                  인증번호가 발송되었습니다. 이메일을 확인해주세요.
                </Text>

                <View className="mt-4">
                  <View className="flex-row items-center">
                    <Text className="font-pretendardSemiBold text-h3 text-black">인증번호</Text>
                    <Text className="font-pretendardMedium text-p1 text-statusError">*</Text>
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
                      disabled={isVerifyingCode}
                      activeOpacity={0.85}
                      className="ml-2 h-[46px] w-[107px] items-center justify-center rounded-xl border border-borderGray bg-white">
                      <Text className="text-p text-gray">
                        {isVerifyingCode ? '확인 중...' : '확인'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {codeError ? (
                    <Text className="mt-2 text-p text-statusError">{codeError}</Text>
                  ) : isCodeVerified ? (
                    <Text className="mt-2 text-p text-statusSuccess">인증이 완료되었습니다.</Text>
                  ) : null}
                </View>
              </>
            )}
          </View>

          <TouchableOpacity
            disabled={!isCodeVerified}
            activeOpacity={0.85}
            onPress={handleMoveToProfileEdit}
            className={`mt-4 h-11 items-center justify-center rounded-lg ${isCodeVerified ? 'bg-main' : 'bg-main/50'}`}>
            <Text className="font-pretendardSemiBold text-p1 text-white">프로필 수정으로 이동</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

ProfileEditScreen.displayName = 'ProfileEditScreen';

export default ProfileEditScreen;
export { ProfileEditScreen };
