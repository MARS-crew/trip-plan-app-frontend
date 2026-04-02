import React from 'react';
import { View, Text, Pressable, type LayoutChangeEvent } from 'react-native';

import { ContentContainer, LabeledInput } from '@/components/ui';
import { DownDropdownIcon, UpDropdownIcon } from '@/assets';
import type { SignUpFormData } from './signup.types';

interface ProfileSectionProps {
  formData: SignUpFormData;
  countries: readonly string[];
  showCountryPicker: boolean;
  showFieldErrors: boolean;
  onChangeName: (text: string) => void;
  onChangeBirthDate: (text: string) => void;
  onSelectGender: (gender: 'male' | 'female' | 'other') => void;
  onToggleCountryPicker: () => void;
  onSelectCountry: (country: string) => void;
  onNameLayout: (event: LayoutChangeEvent) => void;
  onBirthDateLayout: (event: LayoutChangeEvent) => void;
  onGenderLayout: (event: LayoutChangeEvent) => void;
  onCountryLayout: (event: LayoutChangeEvent) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  formData,
  countries,
  showCountryPicker,
  showFieldErrors,
  onChangeName,
  onChangeBirthDate,
  onSelectGender,
  onToggleCountryPicker,
  onSelectCountry,
  onNameLayout,
  onBirthDateLayout,
  onGenderLayout,
  onCountryLayout,
}) => {
  return (
    <View className={`mt-5 ${showCountryPicker ? 'z-20' : ''}`}>
      <ContentContainer className="px-6 py-6">
        <Text className="mb-4 text-h3 font-pretendardSemiBold text-black">개인 정보</Text>

        <View onLayout={onNameLayout}>
          <LabeledInput
            label="이름"
            required={true}
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChangeText={onChangeName}
            inputClassName={
              showFieldErrors && formData.name.trim().length === 0 ? 'border-statusError' : ''
            }
            containerClassName="mb-4"
          />
        </View>

        <View onLayout={onBirthDateLayout}>
          <LabeledInput
            label="생년월일"
            required={true}
            placeholder="1990-03-01"
            value={formData.birthDate}
            onChangeText={onChangeBirthDate}
            inputClassName={
              showFieldErrors && formData.birthDate.trim().length === 0 ? 'border-statusError' : ''
            }
            containerClassName="mb-4"
          />
        </View>

        <View className="mb-4" onLayout={onGenderLayout}>
          <View className="mb-2 flex-row">
            <Text className="text-h3 text-black">성별 </Text>
            <Text className="text-p1 text-statusError">*</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => onSelectGender('male')}
              className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                formData.gender === 'male'
                  ? 'border-main bg-serve'
                  : showFieldErrors && formData.gender.length === 0
                  ? 'border-statusError bg-white'
                  : 'border-borderGray bg-white'
              }`}>
              <Text className={`text-p1 ${formData.gender === 'male' ? 'text-main' : 'text-gray'}`}>
                남성
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onSelectGender('female')}
              className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                formData.gender === 'female'
                  ? 'border-main bg-serve'
                  : showFieldErrors && formData.gender.length === 0
                  ? 'border-statusError bg-white'
                  : 'border-borderGray bg-white'
              }`}>
              <Text
                className={`text-p1 ${formData.gender === 'female' ? 'text-main' : 'text-gray'}`}>
                여성
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onSelectGender('other')}
              className={`h-[46px] flex-1 items-center justify-center rounded-xl border ${
                formData.gender === 'other'
                  ? 'border-main bg-serve'
                  : showFieldErrors && formData.gender.length === 0
                  ? 'border-statusError bg-white'
                  : 'border-borderGray bg-white'
              }`}>
              <Text
                className={`text-p1 ${formData.gender === 'other' ? 'text-main' : 'text-gray'}`}>
                기타
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="relative mb-4" onLayout={onCountryLayout}>
          <View className="mb-2 flex-row">
            <Text className="text-h3 font-pretendardSemiBold text-black">국가 </Text>
            <Text className="text-p1 text-statusError">*</Text>
          </View>
          <Pressable
            onPress={onToggleCountryPicker}
            className={`h-[46px] w-full flex-row items-center rounded-xl border bg-inputBackground px-3 ${
              showFieldErrors && formData.country.length === 0
                ? 'border-statusError'
                : 'border-borderGray'
            }`}>
            <Text className={`flex-1 text-p1 ${formData.country ? 'text-black' : 'text-gray'}`}>
              {formData.country || '국가 / 지역'}
            </Text>
            {showCountryPicker ? (
              <UpDropdownIcon width={16} height={16} />
            ) : (
              <DownDropdownIcon width={16} height={16} />
            )}
          </Pressable>

          {showCountryPicker && (
            <View className="absolute left-0 right-0 top-full z-50 mt-2 h-34 rounded-xl border border-borderGray bg-white">
              <View className="py-[6px]">
                {countries.map((country, index) => {
                  const isSelectedCountry = formData.country === country;
                  const isLastItem = index === countries.length - 1;

                  return (
                    <Pressable
                      key={country}
                      onPress={() => onSelectCountry(country)}
                      className={`mx-[6px] rounded-lg px-3 py-2 ${isLastItem ? '' : 'mb-1 '}${
                        isSelectedCountry ? 'bg-statusSuccess' : 'bg-white'
                      }`}>
                      <Text className={`text-p ${isSelectedCountry ? 'text-white' : 'text-black'}`}>
                        {country}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ContentContainer>
    </View>
  );
};
