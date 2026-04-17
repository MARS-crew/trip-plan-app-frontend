import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/navigation';
import BookmarkIcon from '@/assets/icons/bookmark.svg';
import MapIcon from '@/assets/icons/map.svg';
import LocationOrangeIcon from '@/assets/icons/location_orange.svg';
import VectorIcon from '@/assets/icons/vector.svg';
import JapanLanguageIcon from '@/assets/icons/japan_language.svg';
import ExchangeIcon from '@/assets/icons/exchange.svg';
import Exchange2Icon from '@/assets/icons/exchange2.svg';
import BellIcon from '@/assets/icons/bell.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import SettingIcon from '@/assets/icons/setting.svg';
import EarthIcon from '@/assets/icons/earth1.svg';
import { COLORS } from '@/constants';
import { getMyPage, getPapagoPhrases } from '@/services';
import type {
  GetMyPageData,
  GetPapagoPhrase,
  PapagoTargetLang,
  SettingItem,
  StatItem,
} from '@/types/mypage';

const LANG_LABEL: Record<PapagoTargetLang, string> = {
  en: '영어',
  ja: '일본어',
  'zh-CN': '중국어(간체)',
  'zh-TW': '중국어(번체)',
  vi: '베트남어',
  th: '태국어',
  id: '인도네시아어',
  fr: '프랑스어',
  es: '스페인어',
  ru: '러시아어',
  de: '독일어',
  it: '이탈리아어',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const INITIAL_MY_PAGE_DATA: GetMyPageData = {
  nickname: '',
  email: '',
  tripCount: 0,
  savedPlaceCount: 0,
  visitedPlaceCount: 0,
};

const buildStats = (data: GetMyPageData): StatItem[] => [
  { id: 'trip-count', label: '여행 횟수', value: data.tripCount, type: 'map' },
  { id: 'saved-place', label: '저장된 장소', value: data.savedPlaceCount, type: 'bookmark' },
  { id: 'visited-place', label: '방문한 장소', value: data.visitedPlaceCount, type: 'marker' },
];

const settingItems: SettingItem[] = [
  {
    id: 'account-setting',
    title: '계정 설정',
    description: '프로필, 이메일 관리',
    type: 'account',
  },
  {
    id: 'notification-setting',
    title: '알림 설정',
    description: '푸시 알림, 야간 푸시 알림',
    type: 'notification',
  },
];

const StatIcon: React.FC<{ type: StatItem['type'] }> = ({ type }) => {
  if (type === 'map') {
    return <MapIcon width={20} height={20} fill={COLORS.main} />;
  }

  if (type === 'bookmark') {
    return <BookmarkIcon width={16} height={20} fill={COLORS.main} />;
  }

  return <LocationOrangeIcon width={20} height={20} />;
};

const SettingItemIcon: React.FC<{ type: SettingItem['type'] }> = ({ type }) => {
  if (type === 'account') {
    return <SettingIcon width={16} height={16} />;
  }

  return <BellIcon width={16} height={16} />;
};

const cardStyle = {
  shadowColor: COLORS.gray,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 1,
};

const KRW_TO_JPY_RATE = 0.11;
const JPY_TO_KRW_RATE = 9.090909;

const RATE_KRW_TO_JPY = `1 KRW = ${KRW_TO_JPY_RATE.toFixed(6)} JPY`;
const RATE_JPY_TO_KRW = `1 JPY = ${JPY_TO_KRW_RATE.toFixed(6)} KRW`;

const formatAmountWithCommas = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, '');
  if (!digitsOnly) {
    return '';
  }

  const normalized = digitsOnly.replace(/^0+(?=\d)/, '');
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseAmount = (formatted: string): number => {
  const digits = formatted.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
};

const convertCurrency = (amount: number, rate: number): string => {
  const result = Math.round(amount * rate);
  return formatAmountWithCommas(String(result));
};

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [krwAmount, setKrwAmount] = React.useState<string>('10,000');
  const [jpyAmount, setJpyAmount] = React.useState<string>('1,100');
  const [isKrwToJpy, setIsKrwToJpy] = React.useState<boolean>(true);
  const [phrases, setPhrases] = React.useState<GetPapagoPhrase[]>([]);
  const [myPageData, setMyPageData] = React.useState<GetMyPageData>(INITIAL_MY_PAGE_DATA);

  const fetchPhrases = React.useCallback(async () => {
    try {
      const data = await getPapagoPhrases();
      setPhrases(data);
    } catch (error) {
      console.error('fetchPhrases Error:', error);
    }
  }, []);

  const fetchMyPage = React.useCallback(async () => {
    try {
      const data = await getMyPage();
      setMyPageData(data ?? INITIAL_MY_PAGE_DATA);
    } catch (error) {
      console.error('fetchMyPage Error:', error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPhrases();
      fetchMyPage();
    }, [fetchPhrases, fetchMyPage]),
  );

  const stats = React.useMemo<StatItem[]>(() => buildStats(myPageData), [myPageData]);

  const phraseSectionTitle = React.useMemo(() => {
    const firstLang = phrases[0]?.targetLang;
    const langLabel = firstLang ? LANG_LABEL[firstLang] : '';
    return langLabel ? `${langLabel} 기본 회화` : '기본 회화';
  }, [phrases]);

  const handleKrwChange = React.useCallback((text: string): void => {
    const formatted = formatAmountWithCommas(text);
    setKrwAmount(formatted);
    setJpyAmount(formatted ? convertCurrency(parseAmount(formatted), KRW_TO_JPY_RATE) : '');
  }, []);

  const handleJpyChange = React.useCallback((text: string): void => {
    const formatted = formatAmountWithCommas(text);
    setJpyAmount(formatted);
    setKrwAmount(formatted ? convertCurrency(parseAmount(formatted), JPY_TO_KRW_RATE) : '');
  }, []);

  const handleSwapExchange = React.useCallback((): void => {
    setIsKrwToJpy((prev) => !prev);
    setKrwAmount(jpyAmount);
    setJpyAmount(krwAmount);
  }, [krwAmount, jpyAmount]);

  const topCurrencyCode = isKrwToJpy ? 'KRW' : 'JPY';
  const bottomCurrencyCode = isKrwToJpy ? 'JPY' : 'KRW';
  const topCurrencySymbol = isKrwToJpy ? '₩' : '¥';
  const bottomCurrencySymbol = isKrwToJpy ? '¥' : '₩';
  const exchangeRateText = isKrwToJpy ? RATE_KRW_TO_JPY : RATE_JPY_TO_KRW;
  const rightCurrencyLabel = isKrwToJpy ? '일본 엔' : '대한민국 원';
  const topAmount = isKrwToJpy ? krwAmount : jpyAmount;
  const bottomAmount = isKrwToJpy ? jpyAmount : krwAmount;
  const topSymbolSpacingClass = topCurrencyCode === 'KRW' ? 'mr-[8px]' : 'mr-[15px]';
  const bottomSymbolSpacingClass = bottomCurrencyCode === 'KRW' ? 'mr-[8px]' : 'mr-[15px]';
  const handleTopAmountChange = isKrwToJpy ? handleKrwChange : handleJpyChange;
  const handleBottomAmountChange = isKrwToJpy ? handleJpyChange : handleKrwChange;

  const handleNavigateToPrivacy = (): void => {
    navigation.navigate('PrivacyPolicyScreen');
  };

  const handleNavigateToMarketing = (): void => {
    navigation.navigate('MarketingConsentScreen');
  };

  const handleNavigateToNightMarketing = (): void => {
    navigation.navigate('NightMarketingScreen');
  };

  const handleNavigateToProfileEdit = (): void => {
    const parentNavigation = navigation.getParent() as
      | { navigate: (...args: unknown[]) => void }
      | undefined;

    if (parentNavigation) {
      parentNavigation.navigate('ProfileEditScreen');
      return;
    }

    navigation.navigate('ProfileEditScreen');
  };

  const handleNavigateToAccountSettings = (): void => {
    const parentNavigation = navigation.getParent() as
      | { navigate: (...args: unknown[]) => void }
      | undefined;

    if (parentNavigation) {
      parentNavigation.navigate('AccountSettings');
      return;
    }

    navigation.navigate('AccountSettings');
  };

  const handleNavigateToNotificationSettings = (): void => {
    const parentNavigation = navigation.getParent() as
      | { navigate: (...args: unknown[]) => void }
      | undefined;

    if (parentNavigation) {
      parentNavigation.navigate('NotificationSettings');
      return;
    }

    navigation.navigate('NotificationSettings');
  };

  const handleNavigateToVisitedPlaceList = (): void => {
    const parentNavigation = navigation.getParent() as
      | { navigate: (...args: unknown[]) => void }
      | undefined;

    if (parentNavigation) {
      parentNavigation.navigate('VisitedPlaceListScreen');
      return;
    }

    navigation.navigate('VisitedPlaceListScreen');
  };

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-[33px]">
          <Text className="mt-3.5 font-pretendardBold text-h text-black">마이페이지</Text>

          <View
            className="mt-3.5 rounded-lg border border-subtleBorder bg-white p-4"
            style={cardStyle}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-16 w-16 items-center justify-center rounded-full bg-contentBackground">
                  <Text className="font-pretendardBold text-h2 text-main">
                    {myPageData.nickname ? myPageData.nickname.charAt(0) : ''}
                  </Text>
                </View>
                <View>
                  <Text className="font-pretendardSemiBold text-h1 text-black">
                    {myPageData.nickname}
                  </Text>
                  <Text className="mt-0.5 text-p1 text-black">{myPageData.email}</Text>
                  <View className="mt-1 h-4 flex-row items-center">
                    <View className="mt-0.5 h-4 w-3 items-center justify-center">
                      <EarthIcon width={12} height={12} />
                    </View>
                    <Text className="ml-1 text-p leading-4 text-statusSuccess">
                      현재 위치: 일본
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleNavigateToProfileEdit}
                activeOpacity={0.8}
                className="rounded-lg bg-chip px-3 py-1.5">
                <Text className="font-pretendardMedium text-p text-black">편집</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between">
            {stats.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={item.type === 'marker' ? 0.8 : 1}
                disabled={item.type !== 'marker'}
                onPress={item.type === 'marker' ? handleNavigateToVisitedPlaceList : undefined}
                className="w-[31.5%] rounded-lg border border-white bg-white py-4"
                style={cardStyle}>
                <View className="items-center">
                  <StatIcon type={item.type} />
                  <Text className="mt-2 font-pretendardBold text-h1 text-black">{item.value}</Text>
                  <Text className="mt-0.5 text-p text-gray">{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="ml-1 mt-5 flex-row items-center">
            <JapanLanguageIcon width={16} height={16} />
            <Text className="ml-1.5 font-pretendardSemiBold text-h3 text-black">
              {phraseSectionTitle}
            </Text>
          </View>

          {phrases.length > 0 && (
            <View
              className="mt-2 overflow-hidden rounded-lg border border-white bg-white"
              style={cardStyle}>
              {phrases.map((phrase, index) => (
                <View
                  key={`${phrase.targetLang}-${index}`}
                  className={`px-4 py-3 ${index !== phrases.length - 1 ? 'border-b border-borderGray' : ''}`}>
                  <Text className="font-pretendardBold text-h2 text-black">
                    {phrase.translatedText}
                  </Text>
                  <Text className="mt-0.5 text-p text-gray">{phrase.originalText}</Text>
                </View>
              ))}
            </View>
          )}

          <View className="ml-1 mt-5 flex-row items-center">
            <ExchangeIcon width={16} height={16} />
            <Text className="ml-1.5 font-pretendardSemiBold text-h3 text-black">환율 계산기</Text>
          </View>

          <View className="mt-2 rounded-lg border border-white bg-white p-4" style={cardStyle}>
            <View className="flex-row items-center justify-between">
              <Text className="text-left text-p text-xs text-gray">{exchangeRateText}</Text>
              <Text className="text-p text-gray">{rightCurrencyLabel}</Text>
            </View>

            <View className="mt-3 rounded-xl bg-chip px-4 py-3.5">
              <Text className="text-p1 text-gray">{topCurrencyCode}</Text>
              <View className="mt-1 flex-row items-center">
                <Text className={`${topSymbolSpacingClass} font-pretendardBold text-h1 text-black`}>
                  {topCurrencySymbol}
                </Text>
                <TextInput
                  value={topAmount}
                  onChangeText={handleTopAmountChange}
                  keyboardType="number-pad"
                  className="flex-1 p-0 font-pretendardBold text-h1 text-black"
                />
              </View>
            </View>

            <View className="items-center">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSwapExchange}
                className="mb-1 mt-1 h-8 w-8 items-center justify-center rounded-full bg-main">
                <Exchange2Icon width={14} height={14} />
              </TouchableOpacity>
            </View>

            <View className="rounded-xl bg-chip px-4 py-3.5">
              <Text className="text-p1 text-gray">{bottomCurrencyCode}</Text>
              <View className="mt-1 flex-row items-center">
                <Text
                  className={`${bottomSymbolSpacingClass} font-pretendardBold text-h1 text-main`}>
                  {bottomCurrencySymbol}
                </Text>
                <TextInput
                  value={bottomAmount}
                  onChangeText={handleBottomAmountChange}
                  keyboardType="number-pad"
                  className="flex-1 p-0 font-pretendardBold text-h1 text-main"
                />
              </View>
            </View>
          </View>

          <Text className="ml-1 mt-5 font-pretendardSemiBold text-xs text-gray">계정</Text>

          <View
            className="mt-2 overflow-hidden rounded-lg border border-white bg-white"
            style={cardStyle}>
            {settingItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={
                  item.type === 'account'
                    ? handleNavigateToAccountSettings
                    : handleNavigateToNotificationSettings
                }
                activeOpacity={0.8}
                className={`flex-row items-center justify-between px-4 py-4 ${index !== settingItems.length - 1 ? 'border-b border-borderGray' : ''}`}>
                <View className="flex-row items-center">
                  <View className="h-9 w-9 items-center justify-center rounded-md bg-chip">
                    <SettingItemIcon type={item.type} />
                  </View>
                  <View className="ml-3">
                    <Text className="font-pretendardSemiBold text-h3 text-black">{item.title}</Text>
                    <Text className="mt-0.5 text-p1 text-gray">{item.description}</Text>
                  </View>
                </View>

                <VectorIcon width={16} height={16} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.8} className="mt-[35px] items-center">
            <View className="flex-row items-center">
              <LogoutIcon width={16} height={16} />
              <Text className="ml-1.5 font-pretendardMedium text-xs text-logoutRed">로그아웃</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

MyPageScreen.displayName = 'MyPageScreen';

export default MyPageScreen;
export { MyPageScreen };
