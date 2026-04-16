import React from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';

import { ContentContainer, LabeledInput } from '@/components/ui';
import type { AccountSectionProps } from '@/types/signupAccount';

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
        <Text className="mb-4 font-pretendardSemiBold text-h3 text-black">계정 정보</Text>

        <View className="flex-row items-end gap-2" onLayout={onIdLayout}>
          <View className="flex-1">
            <LabeledInput
              label="아이디"
              required={true}
              placeholder="아이디를 입력하세요"
              value={formData.accountId}
              onChangeText={onChangeId}
              inputClassName={
                idCheckStatus === 'duplicate' ||
                (showFieldErrors && (formData.accountId.trim().length === 0 || !isIdVerified))
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
            className="h-[46px] items-center justify-center rounded-xl border border-borderGray bg-white px-4">
            <Text className="text-p text-gray">중복 확인</Text>
          </Pressable>
        </View>

        {idCheckStatus !== 'idle' && (
          <Text className={`mb-4 mt-2 text-p ${idMessageClass}`}>{idMessage}</Text>
        )}

        <View onLayout={onNicknameLayout} className="mt-4">
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
            containerClassName=""
          />
        </View>

        {hasPasswordError && (
          <Text className="mt-2 text-p text-statusError">
            영문,숫자,특수기호 를 포함한 8자리 이상으로 작성해 주세요.
          </Text>
        )}

        <View className="mt-4" onLayout={onPasswordConfirmLayout}>
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
            <Text className="mb-5 mt-2 text-p text-statusError">비밀번호가 일치하지 않습니다.</Text>
          )}
        </View>
      </ContentContainer>
    </View>
  );
};
