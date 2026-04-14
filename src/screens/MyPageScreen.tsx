import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/navigation';
import LogoutIcon from '@/assets/icons/logout.svg';
import { getPapagoPhrases, postExchange } from '@/services';
import {
  MyPageAccountSection,
  MyPageExchangeSection,
  MyPagePhraseSection,
  MyPageProfileCard,
  MyPageStatsSection,
} from '@/screens/myPage/components';
import type { MyPageSettingItem, MyPageStatItem } from '@/screens/myPage/types';
import type { GetPapagoPhrase, PapagoTargetLang } from '@/types/mypage';

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

const stats: MyPageStatItem[] = [
  { id: 'trip-count', label: '여행 횟수', value: 12, type: 'map' },
  { id: 'saved-place', label: '저장된 장소', value: 12, type: 'bookmark' },
  { id: 'visited-place', label: '방문한 장소', value: 12, type: 'marker' },
];

const settingItems: MyPageSettingItem[] = [
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

const KRW_TO_JPY_RATE = 0.11;
const JPY_TO_KRW_RATE = 9.090909;

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

const buildRateText = (fromCurrency: 'KRW' | 'JPY', toCurrency: 'KRW' | 'JPY', rate: number) => {
  return `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
};

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [krwAmount, setKrwAmount] = React.useState<string>('10,000');
  const [jpyAmount, setJpyAmount] = React.useState<string>('1,100');
  const [isKrwToJpy, setIsKrwToJpy] = React.useState<boolean>(true);
  const [phrases, setPhrases] = React.useState<GetPapagoPhrase[]>([]);
  const [krwToJpyRate, setKrwToJpyRate] = React.useState<number>(KRW_TO_JPY_RATE);
  const [jpyToKrwRate, setJpyToKrwRate] = React.useState<number>(JPY_TO_KRW_RATE);
  const exchangeRequestIdRef = React.useRef<number>(0);

  const fetchPapagoPhrases = React.useCallback(async (): Promise<void> => {
    try {
      const data = await getPapagoPhrases();
      setPhrases(data);
    } catch (error) {
      console.error('fetchPapagoPhrases Error:', error);
      setPhrases([]);
    }
  }, []);

  const requestExchange = React.useCallback((amountText: string, fromKrw: boolean): void => {
    const amount = parseAmount(amountText);

    if (!amount) {
      if (fromKrw) {
        setJpyAmount('');
      } else {
        setKrwAmount('');
      }
      return;
    }

    const requestId = exchangeRequestIdRef.current + 1;
    exchangeRequestIdRef.current = requestId;

    const fetchExchange = async (): Promise<void> => {
      try {
        const exchangeData = await postExchange({
          curUnit: 'JPY',
          amount,
          fromKrw,
        });

        if (requestId !== exchangeRequestIdRef.current) {
          return;
        }

        const converted = formatAmountWithCommas(String(exchangeData.convertedAmount));

        if (fromKrw) {
          setJpyAmount(converted);
          setKrwToJpyRate(exchangeData.dealBasR);
          if (exchangeData.dealBasR > 0) {
            setJpyToKrwRate(1 / exchangeData.dealBasR);
          }
          return;
        }

        setKrwAmount(converted);
        setJpyToKrwRate(exchangeData.dealBasR);
        if (exchangeData.dealBasR > 0) {
          setKrwToJpyRate(1 / exchangeData.dealBasR);
        }
      } catch {
        if (requestId !== exchangeRequestIdRef.current) {
          return;
        }

        const fallbackRate = fromKrw ? KRW_TO_JPY_RATE : JPY_TO_KRW_RATE;
        const converted = convertCurrency(amount, fallbackRate);

        if (fromKrw) {
          setJpyAmount(converted);
          setKrwToJpyRate(KRW_TO_JPY_RATE);
          setJpyToKrwRate(JPY_TO_KRW_RATE);
          return;
        }

        setKrwAmount(converted);
        setKrwToJpyRate(KRW_TO_JPY_RATE);
        setJpyToKrwRate(JPY_TO_KRW_RATE);
      }
    };

    fetchExchange();
  }, []);

  const handleKrwChange = React.useCallback(
    (text: string): void => {
      const formatted = formatAmountWithCommas(text);
      setKrwAmount(formatted);
      requestExchange(formatted, true);
    },
    [requestExchange],
  );

  const handleJpyChange = React.useCallback(
    (text: string): void => {
      const formatted = formatAmountWithCommas(text);
      setJpyAmount(formatted);
      requestExchange(formatted, false);
    },
    [requestExchange],
  );

  React.useEffect(() => {
    requestExchange('10,000', true);
    fetchPapagoPhrases();
  }, [fetchPapagoPhrases, requestExchange]);

  const handleSwapExchange = React.useCallback((): void => {
    const nextIsKrwToJpy = !isKrwToJpy;
    const nextTopAmount = nextIsKrwToJpy ? krwAmount : jpyAmount;

    setIsKrwToJpy(nextIsKrwToJpy);
    requestExchange(nextTopAmount, nextIsKrwToJpy);
  }, [isKrwToJpy, jpyAmount, krwAmount, requestExchange]);

  const topCurrencyCode = isKrwToJpy ? 'KRW' : 'JPY';
  const bottomCurrencyCode = isKrwToJpy ? 'JPY' : 'KRW';
  const topCurrencySymbol = isKrwToJpy ? '₩' : '¥';
  const bottomCurrencySymbol = isKrwToJpy ? '¥' : '₩';
  const exchangeRateText = isKrwToJpy
    ? buildRateText('KRW', 'JPY', krwToJpyRate)
    : buildRateText('JPY', 'KRW', jpyToKrwRate);
  const rightCurrencyLabel = isKrwToJpy ? '일본 엔' : '대한민국 원';
  const topAmount = isKrwToJpy ? krwAmount : jpyAmount;
  const bottomAmount = isKrwToJpy ? jpyAmount : krwAmount;
  const topSymbolSpacingClass = topCurrencyCode === 'KRW' ? 'mr-[8px]' : 'mr-[15px]';
  const bottomSymbolSpacingClass = bottomCurrencyCode === 'KRW' ? 'mr-[8px]' : 'mr-[15px]';
  const handleTopAmountChange = isKrwToJpy ? handleKrwChange : handleJpyChange;
  const handleBottomAmountChange = isKrwToJpy ? handleJpyChange : handleKrwChange;
  const phraseSectionTitle = React.useMemo((): string => {
    const targetLang = phrases[0]?.targetLang;
    if (!targetLang) {
      return '일본 기본 회화';
    }

    return `${LANG_LABEL[targetLang]} 기본 회화`;
  }, [phrases]);

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

          <MyPageProfileCard
            nickname="여행자"
            email="travel@gmail.com"
            locationLabel="일본"
            onPressEdit={handleNavigateToProfileEdit}
          />

          <MyPageStatsSection
            stats={stats}
            onPressVisitedPlaceList={handleNavigateToVisitedPlaceList}
          />

          <MyPagePhraseSection title={phraseSectionTitle} phrases={phrases} />

          <MyPageExchangeSection
            exchangeRateText={exchangeRateText}
            rightCurrencyLabel={rightCurrencyLabel}
            topCurrencyCode={topCurrencyCode}
            bottomCurrencyCode={bottomCurrencyCode}
            topCurrencySymbol={topCurrencySymbol}
            bottomCurrencySymbol={bottomCurrencySymbol}
            topSymbolSpacingClass={topSymbolSpacingClass}
            bottomSymbolSpacingClass={bottomSymbolSpacingClass}
            topAmount={topAmount}
            bottomAmount={bottomAmount}
            onChangeTopAmount={handleTopAmountChange}
            onChangeBottomAmount={handleBottomAmountChange}
            onPressSwap={handleSwapExchange}
          />

          <MyPageAccountSection
            items={settingItems}
            onPressAccountSettings={handleNavigateToAccountSettings}
            onPressNotificationSettings={handleNavigateToNotificationSettings}
          />

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
