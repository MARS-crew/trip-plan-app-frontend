import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { ContentContainer } from '@/components/ui';
import { CheckedCircleIcon, UncheckedCircleIcon, VectorIcon } from '@/assets';
import type { TermsSectionProps } from '@/types/signupTerms';

export const TermsSection: React.FC<TermsSectionProps> = ({
  termsAgreement,
  onTermsChange,
  onNavigatePrivacyPolicy,
  onNavigateMarketingConsent,
  onNavigateNightMarketing,
}) => {
  return (
    <View className="mt-5">
      <ContentContainer className="px-6 py-6">
        <Text className="mb-4 font-pretendardSemiBold text-h3 text-black">약관 동의</Text>

        <View className="mb-3 h-11 flex-row items-center rounded-xl bg-chip px-3 py-3">
          <Pressable onPress={() => onTermsChange('allTerms', !termsAgreement.allTerms)}>
            {termsAgreement.allTerms ? (
              <CheckedCircleIcon width={16} height={16} />
            ) : (
              <UncheckedCircleIcon width={16} height={16} />
            )}
          </Pressable>
          <Text className="ml-3 font-pretendardSemiBold text-h3 text-black">전체 동의</Text>
        </View>

        <View className="gap-3 px-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Pressable
                onPress={() => onTermsChange('serviceTerms', !termsAgreement.serviceTerms)}>
                {termsAgreement.serviceTerms ? (
                  <CheckedCircleIcon width={16} height={16} />
                ) : (
                  <UncheckedCircleIcon width={16} height={16} />
                )}
              </Pressable>
              <Text className="ml-3 font-pretendardSemiBold text-h3 text-black">
                개인정보 수집 및 이용 동의
              </Text>
              <Text className="font-pretendardSemiBold text-h3 text-statusError"> (필수)</Text>
            </View>
            <Pressable onPress={onNavigatePrivacyPolicy} className="p-1">
              <VectorIcon width={16} height={16} />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Pressable
                onPress={() => onTermsChange('marketingConsent', !termsAgreement.marketingConsent)}>
                {termsAgreement.marketingConsent ? (
                  <CheckedCircleIcon width={16} height={16} />
                ) : (
                  <UncheckedCircleIcon width={16} height={16} />
                )}
              </Pressable>
              <Text className="ml-3 font-pretendardSemiBold text-h3 text-black">
                마케팅 정보 수신 동의
              </Text>
              <Text className="font-pretendardSemiBold text-h3 text-gray"> (선택)</Text>
            </View>
            <Pressable onPress={onNavigateMarketingConsent} className="p-1">
              <VectorIcon width={16} height={16} />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Pressable
                onPress={() => onTermsChange('privacyPolicy', !termsAgreement.privacyPolicy)}>
                {termsAgreement.privacyPolicy ? (
                  <CheckedCircleIcon width={16} height={16} />
                ) : (
                  <UncheckedCircleIcon width={16} height={16} />
                )}
              </Pressable>
              <Text className="ml-3 font-pretendardSemiBold text-h3 text-black">
                야간 마케팅 정보 수신 동의
              </Text>
              <Text className="font-pretendardSemiBold text-h3 text-gray"> (선택)</Text>
            </View>
            <Pressable onPress={onNavigateNightMarketing} className="p-1">
              <VectorIcon width={16} height={16} />
            </Pressable>
          </View>
        </View>
      </ContentContainer>
    </View>
  );
};
