import React from 'react';
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';
import BackArrow from '@/assets/icons/backArrow.svg';
import { DownDropdownIcon, UpDropdownIcon } from '@/assets';
import { CARD_SHADOW_DARK, COLORS } from '@/constants';
import { getProfile } from '@/services';
import type { Gender } from '@/types/mypage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type GenderType = '남성' | '여성' | '기타';

const GENDER_API_TO_LABEL: Record<Gender, GenderType> = {
  MALE: '남성',
  FEMALE: '여성',
  OTHER: '기타',
};

const COUNTRIES = ['대한민국', '미국', '일본', '중국', '영국', '프랑스', '독일'] as const;
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

const pad = (n: number): string => String(n).padStart(2, '0');
const getDaysInMonth = (year: number, month: number): number => new Date(year, month, 0).getDate();

interface DatePickerOptions {
  years: number[];
  months: number[];
  days: number[];
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
}

const getDatePickerOptions = (
  currentYear: number,
  year: number,
  month: number,
  day: number,
): DatePickerOptions => {
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  const selectedYear = years.includes(year) ? year : currentYear;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const selectedMonth = months.includes(month) ? month : months[0];

  const days = Array.from(
    { length: getDaysInMonth(selectedYear, selectedMonth) },
    (_, i) => i + 1,
  );
  const selectedDay = days.includes(day) ? day : days[0];

  return { years, months, days, selectedYear, selectedMonth, selectedDay };
};

interface SpinnerColumnProps {
  items: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  format?: (n: number) => string;
}

const SpinnerColumn: React.FC<SpinnerColumnProps> = ({
  items,
  selectedIndex,
  onSelect,
  format = (n) => String(n),
}) => {
  const scrollRef = React.useRef<ScrollView>(null);

  const handleScrollEnd = React.useCallback(
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
    <View style={{ flex: 1, height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.main,
          zIndex: 1,
        }}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 3,
          left: 8,
          right: 8,
          height: 1,
          backgroundColor: COLORS.inputBackground,
          zIndex: 1,
        }}
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
        onScrollEndDrag={handleScrollEnd}
      >
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex;

          return (
            <View
              key={item}
              style={{
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? COLORS.black : COLORS.gray,
                }}
              >
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
  const currentYear = React.useMemo(() => new Date().getFullYear(), []);
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState<GenderType>('여성');
  const [nickname, setNickname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [birthDate, setBirthDate] = React.useState('');
  const [showBirthDatePicker, setShowBirthDatePicker] = React.useState<boolean>(false);
  const [tempYear, setTempYear] = React.useState<number>(currentYear);
  const [tempMonth, setTempMonth] = React.useState<number>(1);
  const [tempDay, setTempDay] = React.useState<number>(1);
  const [country, setCountry] = React.useState<string>('');
  const [showCountryPicker, setShowCountryPicker] = React.useState<boolean>(false);

  const fetchProfile = React.useCallback(async () => {
    try {
      const data = await getProfile();
      setName(data.name);
      setNickname(data.nickname);
      setBirthDate(data.birth);
      setGender(GENDER_API_TO_LABEL[data.gender] ?? '여성');
      setCountry(data.countryCode);
    } catch (error) {
      console.error('fetchProfile Error:', error);
    }
  }, []);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleToggleCountryPicker = React.useCallback((): void => {
    setShowCountryPicker(prev => !prev);
  }, []);

  const handleSelectCountry = React.useCallback((selectedCountry: string): void => {
    setCountry(selectedCountry);
    setShowCountryPicker(false);
  }, []);

  const handleOpenBirthDatePicker = React.useCallback((): void => {
    const [yearStr, monthStr, dayStr] = birthDate.split('-');
    const parsedYear = Number(yearStr);
    const parsedMonth = Number(monthStr);
    const parsedDay = Number(dayStr);

    setTempYear(Number.isFinite(parsedYear) ? parsedYear : currentYear);
    setTempMonth(Number.isFinite(parsedMonth) ? parsedMonth : 1);
    setTempDay(Number.isFinite(parsedDay) ? parsedDay : 1);
    setShowBirthDatePicker(true);
  }, [birthDate, currentYear]);

  const handleCloseBirthDatePicker = React.useCallback((): void => {
    setShowBirthDatePicker(false);
  }, []);

  const handleConfirmBirthDate = React.useCallback((): void => {
    const { selectedYear, selectedMonth, selectedDay } = getDatePickerOptions(
      currentYear,
      tempYear,
      tempMonth,
      tempDay,
    );

    setBirthDate(`${selectedYear}-${pad(selectedMonth)}-${pad(selectedDay)}`);
    setShowBirthDatePicker(false);
  }, [currentYear, tempYear, tempMonth, tempDay]);

  const handleSubmitProfileEdit = React.useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'MyPage' });
  }, [navigation]);

  const {
    years: availableYears,
    months: availableMonths,
    days: availableDays,
    selectedYear,
    selectedMonth,
    selectedDay,
  } = React.useMemo(
    () => getDatePickerOptions(currentYear, tempYear, tempMonth, tempDay),
    [currentYear, tempYear, tempMonth, tempDay],
  );

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
        <View className="mt-3 rounded-lg bg-white px-6 pb-6 pt-6" style={CARD_SHADOW_DARK}>
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

        <View className="mt-5 rounded-lg bg-white px-6 pb-6 pt-6" style={CARD_SHADOW_DARK}>
          <Text className="text-h3 font-pretendardSemiBold text-black">개인 정보</Text>

          <View className="mt-4">
            <Text className="text-h3 font-pretendardSemiBold text-black">이름</Text>
            <TextInput
              value={name}
              editable={false}
              className="mt-2 h-[46px] rounded-xl border border-borderGray bg-inputBackground px-3 text-p1 text-gray"
            />
          </View>

          <View className="mt-4">
            <View className="flex-row items-center">
              <Text className="text-h3 font-pretendardSemiBold text-black">생년월일</Text>
              <Text className="ml-0.5 text-p1 font-pretendardMedium text-statusError">*</Text>
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

      <Modal
        visible={showBirthDatePicker}
        transparent
        animationType="fade"
        onRequestClose={handleCloseBirthDatePicker}>
        <View className="flex-1 items-center justify-center bg-black/25 px-4">
          <View className="w-full rounded-xl bg-white px-4 pb-4 pt-4" style={{ maxWidth: 360 }}>
            <Text className="text-center text-h3 font-pretendardSemiBold text-black">생년월일 선택</Text>

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
                <Text className="text-h3 font-pretendardSemiBold text-gray">취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirmBirthDate}
                className="h-11 w-[48%] items-center justify-center rounded-lg bg-main">
                <Text className="text-h3 font-pretendardSemiBold text-white">확인</Text>
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
