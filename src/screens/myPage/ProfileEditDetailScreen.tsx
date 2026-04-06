import React from 'react';
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '@/assets/icons/backArrow.svg';
import { DownDropdownIcon, UpDropdownIcon } from '@/assets';
import { COLORS } from '@/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GenderType = '남성' | '여성' | '기타';

const COUNTRIES = ['대한민국', '미국', '일본', '중국', '영국', '프랑스', '독일'] as const;

const cardStyle = {
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
  elevation: 1,
};

const ProfileEditDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [gender, setGender] = React.useState<GenderType>('여성');
  const [nickname, setNickname] = React.useState('최혜림');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('2003-07-08');
  const [country, setCountry] = React.useState<string>('대한민국');
  const [showCountryPicker, setShowCountryPicker] = React.useState<boolean>(false);

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleToggleCountryPicker = React.useCallback((): void => {
    setShowCountryPicker(prev => !prev);
  }, []);

  const handleSelectCountry = React.useCallback((selectedCountry: string): void => {
    setCountry(selectedCountry);
    setShowCountryPicker(false);
  }, []);

  const handleSubmitProfileEdit = React.useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'MyPage' });
  }, [navigation]);

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

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-3 rounded-lg bg-white px-6 pb-6 pt-6" style={cardStyle}>
          <Text className="text-h3 font-pretendardSemiBold text-black">계정 정보</Text>

          <View className="mt-4">
            <Text className="text-h3 font-pretendardSemiBold text-black">닉네임</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-gray"
            />
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">비밀번호</Text>
              <Text className="ml-0.5 text-p1 font-pretendardMedium text-statusError">*</Text>
            </View>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="8~20자, 영문/숫자/특수문자 포함"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-black"
            />
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">비밀번호 확인</Text>
              <Text className="ml-0.5 text-p1 font-pretendardMedium text-statusError">*</Text>
            </View>
            <TextInput
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholder="비밀번호를 다시 입력하세요"
              placeholderTextColor={COLORS.gray}
              secureTextEntry
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-black"
            />
            {isPasswordMismatch && (
              <Text className="mt-1 text-p text-statusError">비밀번호가 일치하지 않습니다.</Text>
            )}
          </View>
        </View>

        <View className="mt-5 rounded-lg bg-white px-6 pb-6 pt-6" style={cardStyle}>
          <Text className="text-h3 font-pretendardSemiBold text-black">개인 정보</Text>

          <View className="mt-4">
            <Text className="text-h3 font-pretendardSemiBold text-black">이름</Text>
            <TextInput
              value="최혜림"
              editable={false}
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-gray"
            />
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">생년월일</Text>
              <Text className="ml-0.5 text-p1 font-pretendardMedium text-statusError">*</Text>
            </View>
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-black"
            />
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">성별</Text>
              <Text className="ml-0.5 text-p1 font-pretendardMedium text-statusError">*</Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              {(['남성', '여성', '기타'] as GenderType[]).map(option => {
                const isActive = option === gender;
                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.85}
                    onPress={() => setGender(option)}
                    className={`h-[46px] w-[31%] items-center justify-center rounded-xl border ${isActive ? 'border-main bg-main/10' : 'border-borderGray bg-white'}`}>
                    <Text className={`text-p1 font-pretendardMedium ${isActive ? 'text-main' : 'text-gray'}`}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className={`relative mt-4 ${showCountryPicker ? 'z-20 mb-60' : ''}`}>
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">국가</Text>
              <Text className="ml-0.5 text-p1 font-pretendardMedium text-statusError">*</Text>
            </View>

            <Pressable
              onPress={handleToggleCountryPicker}
              className="mt-2 h-[46px] w-full flex-row items-center rounded-xl border border-borderGray bg-inputBackground px-3">
              <Text className="flex-1 text-p1 text-black">{country || '국가 / 지역'}</Text>
              {showCountryPicker ? (
                <UpDropdownIcon width={16} height={16} />
              ) : (
                <DownDropdownIcon width={16} height={16} />
              )}
            </Pressable>

            {showCountryPicker && (
              <View className="absolute left-0 right-0 top-full z-50 mt-2 h-46 rounded-xl border border-borderGray bg-white">
                {COUNTRIES.map((option, index) => {
                  const isSelectedCountry = country === option;
                  const isLastItem = index === COUNTRIES.length - 1;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => handleSelectCountry(option)}
                      className={`mx-[6px] rounded-lg px-3 py-2 ${isLastItem ? '' : 'mb-1'} ${
                        isSelectedCountry ? 'bg-statusSuccess' : 'bg-white'
                      }`}>
                      <Text className={`text-p ${isSelectedCountry ? 'text-white' : 'text-black'}`}>
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitProfileEdit}
          className="mt-5 mb-16 h-11 items-center justify-center rounded-lg bg-main">
          <Text className="text-p1 font-pretendardSemiBold text-white">수정하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

ProfileEditDetailScreen.displayName = 'ProfileEditDetailScreen';

export default ProfileEditDetailScreen;
export { ProfileEditDetailScreen };
