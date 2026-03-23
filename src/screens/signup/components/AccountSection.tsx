import React from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';

import { ContentContainer, LabeledInput } from '@/components/ui';
import type { SignUpFormData } from './signup.types';

interface AccountSectionProps {
  formData: SignUpFormData;
  idCheckStatus: 'idle' | 'available' | 'duplicate';
  idMessage: string;
  idMessageClass: string;
  idInputClass: string;
  showFieldErrors: boolean;
  isIdVerified: boolean;
  isPasswordValid: boolean;
  isPasswordMatched: boolean;
  hasPasswordError: boolean;
  passwordInputClassName: string;
  onCheckId: () => void;
  onChangeId: (text: string) => void;
  onChangeNickname: (text: string) => void;
  onChangePassword: (text: string) => void;
  onChangePasswordConfirm: (text: string) => void;
  onIdLayout: (event: LayoutChangeEvent) => void;
  onNicknameLayout: (event: LayoutChangeEvent) => void;
  onPasswordLayout: (event: LayoutChangeEvent) => void;
  onPasswordConfirmLayout: (event: LayoutChangeEvent) => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({
  formData,
  idCheckStatus,
  idMessage,
  idMessageClass,
  idInputClass,
  showFieldErrors,
  isIdVerified,
  isPasswordValid,
  isPasswordMatched,
  hasPasswordError,
  passwordInputClassName,
  onCheckId,
  onChangeId,
  onChangeNickname,
  onChangePassword,
  onChangePasswordConfirm,
  onIdLayout,
  onNicknameLayout,
  onPasswordLayout,
  onPasswordConfirmLayout,
}) => {
  return (
    <View className="mt-6">
      <ContentContainer className="px-6 py-6">
        <Text className="mb-4 text-h3 font-semibold text-black">계정 정보</Text>

        <View className="mb-4 flex-row items-end gap-2" onLayout={onIdLayout}>
          <View className="flex-1">
            <LabeledInput
              label="아이디"
              required={true}
              placeholder="아이디를 입력하세요"
              value={formData.accountId}
              onChangeText={onChangeId}
              inputClassName={
                showFieldErrors && (formData.accountId.trim().length === 0 || !isIdVerified)
                  ? 'border-statusError'
                  : idInputClass
              }
              maxLength={40}
              autoCapitalize="none"
              autoCorrect={false}
              containerClassName=""
            />
          </View>
          <Pressable
            onPress={onCheckId}
            className="h-[46px] w-[78px] items-center justify-center rounded-xl border border-borderGray bg-white">
            <Text className="text-p text-gray">중복 확인</Text>
          </Pressable>
        </View>

        {idCheckStatus !== 'idle' && (
          <Text className={`mb-2 mt-[-10px] text-p ${idMessageClass}`}>{idMessage}</Text>
        )}

        <View onLayout={onNicknameLayout}>
          <LabeledInput
            label="닉네임"
            required={true}
            placeholder="닉네임을 입력하세요"
            value={formData.nickname}
            onChangeText={onChangeNickname}
            inputClassName={
              showFieldErrors && formData.nickname.trim().length === 0 ? 'border-statusError' : ''
            }
            containerClassName="mb-4"
          />
        </View>

        <View onLayout={onPasswordLayout}>
          <LabeledInput
            label="비밀번호"
            required={true}
            placeholder="8~20자, 영문/숫자/특수문자 포함"
            value={formData.password}
            onChangeText={onChangePassword}
            inputClassName={
              showFieldErrors && (formData.password.trim().length === 0 || !isPasswordValid)
                ? 'border-statusError'
                : passwordInputClassName
            }
            secureTextEntry={true}
            containerClassName="mb-1"
          />
        </View>

        {hasPasswordError && (
          <Text className="mb-4 text-p1 text-statusError">
            영문,숫자,특수기호 를 포함한 8자리 이상으로 작성해 주세요.
          </Text>
        )}

        <View className="mb-4" onLayout={onPasswordConfirmLayout}>
          <LabeledInput
            label="비밀번호 확인"
            required={true}
            placeholder="비밀번호를 다시 입력하세요"
            value={formData.passwordConfirm}
            onChangeText={onChangePasswordConfirm}
            inputClassName={
              showFieldErrors &&
              (formData.passwordConfirm.trim().length === 0 || !isPasswordMatched)
                ? 'border-statusError'
                : ''
            }
            secureTextEntry={true}
            containerClassName=""
          />
          {formData.passwordConfirm.length > 0 && !isPasswordMatched && (
            <Text className="mt-1 text-p1 text-statusError">비밀번호가 일치하지 않습니다.</Text>
          )}
        </View>
      </ContentContainer>
    </View>
  );
};
