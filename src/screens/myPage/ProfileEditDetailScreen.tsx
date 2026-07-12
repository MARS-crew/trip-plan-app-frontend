import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '@/assets/icons/backArrow.svg';
import { DownDropdownIcon, UpDropdownIcon } from '@/assets';
import { getProfileDetail, patchProfile } from '@/services';
import { useAuthStore } from '@/store';
import { CARD_SHADOW_DARK, COLORS } from '@/constants';
import type {
  ProfileEditDatePickerOptions,
  ProfileEditGenderLabel,
  ProfileEditSpinnerColumnProps,
} from '@/screens/myPage/types';
import type { Gender } from '@/types/mypage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GENDER_API_TO_LABEL: Record<Gender, ProfileEditGenderLabel> = {
  MALE: '남성',
  FEMALE: '여성',
  OTHER: '기타',
};

const GENDER_LABEL_TO_API: Record<ProfileEditGenderLabel, Gender> = {
  남성: 'MALE',
  여성: 'FEMALE',
  기타: 'OTHER',
};

const COUNTRIES = ['대한민국', '미국', '일본', '중국', '영국', '프랑스', '독일'] as const;
const ITEM_HEIGHT = 44;
const NICKNAME_MAX_LENGTH = 20;
// 소셜 로그인(카카오/네이버/구글) 계정은 비밀번호가 없으므로 비밀번호 변경 영역을 숨긴다.
const SOCIAL_LOGIN_TYPES = ['KAKAO', 'NAVER', 'GOOGLE'];

const pad = (n: number): string => String(n).padStart(2, '0');
const getDaysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

const getDatePickerOptions = (
  currentYear: number,
  year: number,
  month: number,
  day: number,
): ProfileEditDatePickerOptions => {
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  const selectedYear = years.includes(year) ? year : currentYear;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const selectedMonth = months.includes(month) ? month : months[0];

  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);
  const selectedDay = days.includes(day) ? day : days[0];

  return { years, months, days, selectedYear, selectedMonth, selectedDay };
};

const SpinnerColumn: React.FC<ProfileEditSpinnerColumnProps> = ({
  items,
  selectedIndex,
  onSelect,
  format = (n) => String(n),
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      onSelect(clamped);
      scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
    },
    [items.length, onSelect],
  );

  return (
    <View className="h-[220px] flex-1">
      <View
        pointerEvents="none"
        className="absolute left-2 right-2 top-[88px] h-px bg-main"
      />
      <View
        pointerEvents="none"
        className="absolute left-2 right-2 top-[132px] h-px bg-inputBackground"
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
        contentContainerStyle={{
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}>
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <View key={item} className="h-[44px] items-center justify-center">
              <Text
                className={`text-[15px] ${
                  isSelected ? 'font-pretendardSemiBold text-black' : 'text-gray'
                }`}>
                {format(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const ProfileEditDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const loginType = useAuthStore((state) => state.user?.loginType);
  const isSocialLogin = SOCIAL_LOGIN_TYPES.includes((loginType ?? '').toUpperCase());
  const [name, setName] = useState('');
  const [gender, setGender] = useState<ProfileEditGenderLabel>('여성');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = useState<boolean>(false);
  const [tempYear, setTempYear] = useState<number>(currentYear);
  const [tempMonth, setTempMonth] = useState<number>(1);
  const [tempDay, setTempDay] = useState<number>(1);
  const [country, setCountry] = useState<string>('');
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(false);
  const [countryDropdownLayout, setCountryDropdownLayout] = useState({
    left: 16,
    top: 0,
    width: 0,
  });
  const countryTriggerRef = useRef<View | null>(null);
  const countryPickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    return () => {
      if (countryPickerTimerRef.current) {
        clearTimeout(countryPickerTimerRef.current);
      }
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getProfileDetail();
      setName(data.name);
      setNickname(data.nickname);
      setBirthDate(data.birth);
      setGender(GENDER_API_TO_LABEL[data.gender] ?? '여성');
      setCountry(data.countryCode);
    } catch (error) {
      console.error('fetchProfile Error:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const measureAndOpenCountryPicker = useCallback((): void => {
    countryTriggerRef.current?.measureInWindow((x, y, width, height) => {
      const horizontalMargin = 16;
      const left = Math.max(horizontalMargin, Math.min(x, windowWidth - horizontalMargin - width));
      setCountryDropdownLayout({ left, top: y + height + 7, width });
      setShowCountryPicker(true);
    });
  }, [windowWidth]);

  const handleToggleCountryPicker = useCallback((): void => {
    if (showCountryPicker) {
      setShowCountryPicker(false);
      return;
    }

    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
      if (countryPickerTimerRef.current) {
        clearTimeout(countryPickerTimerRef.current);
      }
      countryPickerTimerRef.current = setTimeout(measureAndOpenCountryPicker, 250);
      return;
    }

    measureAndOpenCountryPicker();
  }, [measureAndOpenCountryPicker, showCountryPicker]);

  const handleSelectCountry = useCallback((selectedCountry: string): void => {
    setCountry(selectedCountry);
    setShowCountryPicker(false);
  }, []);

  const handleOpenBirthDatePicker = useCallback((): void => {
    const [yearStr, monthStr, dayStr] = birthDate.split('-');
    const parsedYear = Number(yearStr);
    const parsedMonth = Number(monthStr);
    const parsedDay = Number(dayStr);

    setTempYear(Number.isFinite(parsedYear) ? parsedYear : currentYear);
    setTempMonth(Number.isFinite(parsedMonth) ? parsedMonth : 1);
    setTempDay(Number.isFinite(parsedDay) ? parsedDay : 1);
    setShowBirthDatePicker(true);
  }, [birthDate, currentYear]);

  const handleCloseBirthDatePicker = useCallback((): void => {
    setShowBirthDatePicker(false);
  }, []);

  const handleConfirmBirthDate = useCallback((): void => {
    const { selectedYear, selectedMonth, selectedDay } = getDatePickerOptions(
      currentYear,
      tempYear,
      tempMonth,
      tempDay,
    );

    setBirthDate(`${selectedYear}-${pad(selectedMonth)}-${pad(selectedDay)}`);
    setShowBirthDatePicker(false);
  }, [currentYear, tempYear, tempMonth, tempDay]);

  const handleSubmitProfileEdit = useCallback(async (): Promise<void> => {
    try {
      await patchProfile({
        nickname,
        ...(password ? { password, passwordConfirm } : {}),
        gender: GENDER_LABEL_TO_API[gender],
        birth: birthDate,
        countryCode: country,
      });
      navigation.navigate('MainTabs', { screen: 'MyPage' });
    } catch (error) {
      console.error('handleSubmitProfileEdit Error:', error);
    }
  }, [nickname, password, passwordConfirm, gender, birthDate, country, navigation]);

  const {
    years: availableYears,
    months: availableMonths,
    days: availableDays,
    selectedYear,
    selectedMonth,
    selectedDay,
  } = useMemo(
    () => getDatePickerOptions(currentYear, tempYear, tempMonth, tempDay),
    [currentYear, tempYear, tempMonth, tempDay],
  );

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <View className="h-14 flex-row items-center px-4">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={navigation.goBack}
          className="ml-1 mr-1 h-10 w-10 items-start justify-center">
          <BackArrow width={20} height={20} />
        </TouchableOpacity>
        <Text className="font-pretendardBold text-h text-black">프로필 수정</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="mt-3 rounded-lg bg-white px-6 pb-6 pt-6" style={CARD_SHADOW_DARK}>
          <Text className="font-pretendardSemiBold text-h3 text-black">계정 정보</Text>

          <View className="mt-4">
            <Text className="font-pretendardSemiBold text-h3 text-black">닉네임</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              maxLength={NICKNAME_MAX_LENGTH}
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-gray"
            />
          </View>

          {!isSocialLogin && (
            <>
              <View className="mt-4">
                <View className="flex-row items-center">
                  <Text className="font-pretendardSemiBold text-h3 text-black">비밀번호</Text>
                  <Text className="ml-0.5 font-pretendardMedium text-p1 text-statusError">*</Text>
                </View>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="8~20자, 영문/숫자/특수문자 포함"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry
                  // 마스킹 문자(•/*)를 순수 검정으로 표시 (테마 black은 #251D18이라 별도 지정)
                  style={{ color: '#000000' }}
                  className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-black"
                />
              </View>

              <View className="mt-4">
                <View className="flex-row items-center">
                  <Text className="font-pretendardSemiBold text-h3 text-black">비밀번호 확인</Text>
                  <Text className="ml-0.5 font-pretendardMedium text-p1 text-statusError">*</Text>
                </View>
                <TextInput
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  placeholder="비밀번호를 다시 입력하세요"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry
                  // 마스킹 문자(•/*)를 순수 검정으로 표시 (테마 black은 #251D18이라 별도 지정)
                  style={{ color: '#000000' }}
                  className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-black"
                />
                {isPasswordMismatch && (
                  <Text className="mt-1 text-p text-statusError">비밀번호가 일치하지 않습니다.</Text>
                )}
              </View>
            </>
          )}
        </View>

        <View className="mt-5 rounded-lg bg-white px-6 pb-6 pt-6" style={CARD_SHADOW_DARK}>
          <Text className="font-pretendardSemiBold text-h3 text-black">개인 정보</Text>

          <View className="mt-4">
            <Text className="font-pretendardSemiBold text-h3 text-black">이름</Text>
            <TextInput
              value={name}
              editable={false}
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-gray"
            />
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="font-pretendardSemiBold text-h3 text-black">생년월일</Text>
              <Text className="ml-0.5 font-pretendardMedium text-p1 text-statusError">*</Text>
            </View>
            <Pressable
              onPress={handleOpenBirthDatePicker}
              className="mt-2 h-[46px] w-full flex-row items-center rounded-xl border border-borderGray bg-inputBackground px-3">
              <Text className="flex-1 text-p1 text-black">{birthDate}</Text>
              <DownDropdownIcon width={16} height={16} />
            </Pressable>
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="font-pretendardSemiBold text-h3 text-black">성별</Text>
              <Text className="ml-0.5 font-pretendardMedium text-p1 text-statusError">*</Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              {(['남성', '여성', '기타'] as ProfileEditGenderLabel[]).map((option) => {
                const isActive = option === gender;
                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.85}
                    onPress={() => setGender(option)}
                    className={`h-[46px] w-[31%] items-center justify-center rounded-xl border ${isActive ? 'border-main bg-main/10' : 'border-borderGray bg-white'}`}>
                    <Text
                      className={`font-pretendardMedium text-p1 ${isActive ? 'text-main' : 'text-gray'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="relative mt-4" ref={countryTriggerRef}>
            <View className="flex-row items-center">
              <Text className="font-pretendardSemiBold text-h3 text-black">국가</Text>
              <Text className="ml-0.5 font-pretendardMedium text-p1 text-statusError">*</Text>
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
          </View>

          <Modal
            visible={showCountryPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCountryPicker(false)}>
            <View style={{ flex: 1 }}>
              <Pressable
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                onPress={() => setShowCountryPicker(false)}
              />

              <View pointerEvents="box-none" className="absolute inset-0">
                <View
                  className="absolute rounded-xl border border-borderGray bg-white"
                  style={{
                    left: countryDropdownLayout.left,
                    top: countryDropdownLayout.top,
                    width: countryDropdownLayout.width,
                  }}>
                  {COUNTRIES.map((option, index) => {
                    const isSelectedCountry = country === option;
                    const isLastItem = index === COUNTRIES.length - 1;

                    return (
                      <Pressable
                        key={option}
                        onPress={() => handleSelectCountry(option)}
                        className={`mx-[6px] rounded-lg px-3 py-2 ${index === 0 ? 'mt-1' : ''} ${isLastItem ? '' : 'mb-1'} ${
                          isSelectedCountry ? 'bg-statusSuccess' : 'bg-white'
                        }`}>
                        <Text className={`text-p ${isSelectedCountry ? 'text-white' : 'text-black'}`}>
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitProfileEdit}
          className="mb-16 mt-5 h-11 items-center justify-center rounded-lg bg-main">
          <Text className="font-pretendardSemiBold text-p1 text-white">수정하기</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showBirthDatePicker}
        transparent
        animationType="fade"
        onRequestClose={handleCloseBirthDatePicker}>
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full max-w-[360px] rounded-xl bg-white px-4 pb-4 pt-4">
            <Text className="text-center font-pretendardSemiBold text-h3 text-black">
              생년월일 선택
            </Text>

            <View className="mt-4 flex-row">
              <SpinnerColumn
                items={availableYears}
                selectedIndex={Math.max(0, availableYears.indexOf(selectedYear))}
                onSelect={(index) => setTempYear(availableYears[index])}
                format={(value) => `${value}년`}
              />
              <SpinnerColumn
                items={availableMonths}
                selectedIndex={Math.max(0, availableMonths.indexOf(selectedMonth))}
                onSelect={(index) => setTempMonth(availableMonths[index])}
                format={(value) => `${value}월`}
              />
              <SpinnerColumn
                items={availableDays}
                selectedIndex={Math.max(0, availableDays.indexOf(selectedDay))}
                onSelect={(index) => setTempDay(availableDays[index])}
                format={(value) => `${value}일`}
              />
            </View>

            <View className="mt-5 flex-row justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCloseBirthDatePicker}
                className="h-11 w-[48%] items-center justify-center rounded-lg bg-chip">
                <Text className="font-pretendardSemiBold text-h3 text-gray">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmBirthDate}
                className="h-11 w-[48%] items-center justify-center rounded-lg bg-main">
                <Text className="font-pretendardSemiBold text-h3 text-white">확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

ProfileEditDetailScreen.displayName = 'ProfileEditDetailScreen';

export default ProfileEditDetailScreen;
export { ProfileEditDetailScreen };
