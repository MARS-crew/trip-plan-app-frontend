import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/navigation';
import LogoutIcon from '@/assets/icons/logout.svg';
import {
  getMyPageInfo,
  getPapagoPhrases,
  postExchange,
  postLogout,
  resolveCurrentLocation,
} from '@/services';
import { useAuthStore } from '@/store/authStore';
import {
  buildRateText,
  convertCurrency,
  formatAmountWithCommas,
  parseAmount,
  showToastMessage,
} from '@/utils';
import { handleError } from '@/utils/error';
import {
  MyPageAccountSection,
  MyPageExchangeSection,
  MyPagePhraseSection,
  MyPageProfileCard,
  MyPageStatsSection,
} from '@/screens/myPage/components';
import type { MyPageSettingItem, MyPageStatItem } from '@/screens/myPage/types';
import type { GetMyPageData, GetPapagoPhrase, PapagoTargetLang } from '@/types/mypage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

const INITIAL_MY_PAGE_DATA: GetMyPageData = {
  nickname: '',
  email: '',
  tripCount: 0,
  savedPlaceCount: 0,
  visitedPlaceCount: 0,
};

const buildStats = (data: GetMyPageData): MyPageStatItem[] => [
  { id: 'trip-count', label: '여행 횟수', value: data.tripCount, type: 'map' },
  { id: 'saved-place', label: '저장된 장소', value: data.savedPlaceCount, type: 'bookmark' },
  { id: 'visited-place', label: '방문한 장소', value: data.visitedPlaceCount, type: 'marker' },
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
  },{
    id: 'privacy-policy',
    title: '이용약관',
    description: '개인정보처리방침, 마케팅 정보 수신 동의',
    type: 'privacy-policy',
  },
];

const KRW_TO_JPY_RATE = 0.11;
const JPY_TO_KRW_RATE = 9.090909;

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [krwAmount, setKrwAmount] = React.useState<string>('10,000');
  const [jpyAmount, setJpyAmount] = React.useState<string>('1,100');
  const [isKrwToJpy, setIsKrwToJpy] = React.useState<boolean>(true);
  const [phrases, setPhrases] = React.useState<GetPapagoPhrase[]>([]);
  const [locationLabel, setLocationLabel] = React.useState<string>('확인 중...');
  const [myPageData, setMyPageData] = React.useState<GetMyPageData>(INITIAL_MY_PAGE_DATA);
  const [krwToJpyRate, setKrwToJpyRate] = React.useState<number>(KRW_TO_JPY_RATE);
  const [jpyToKrwRate, setJpyToKrwRate] = React.useState<number>(JPY_TO_KRW_RATE);
  const exchangeRequestIdRef = React.useRef<number>(0);
  const exchangeDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchLocationAndPhrases = React.useCallback(async (): Promise<void> => {
    try {
      const { countryName, targetLang } = await resolveCurrentLocation();
      setLocationLabel(countryName ?? '알 수 없음');
      const data = await getPapagoPhrases(targetLang);
      setPhrases(data);
    } catch (error) {
      console.error('fetchLocationAndPhrases Error:', error);
      setPhrases([]);
    }
  }, []);

  const fetchMyPage = React.useCallback(async (): Promise<void> => {
    try {
      const data = await getMyPageInfo();
      setMyPageData(data ?? INITIAL_MY_PAGE_DATA);
    } catch (error) {
      showToastMessage(handleError(error) || '마이페이지 정보를 불러오지 못했습니다.');
    }
  }, []);

  const requestExchange = React.useCallback((amountText: string, fromKrw: boolean): void => {
    const digits = amountText.replace(/\D/g, '');

    // 입력이 완전히 비면 반대편도 비운다.
    if (!digits) {
      if (fromKrw) {
        setJpyAmount('');
      } else {
        setKrwAmount('');
      }
      return;
    }

    const amount = parseAmount(amountText);

    // 0을 입력하면 환산값도 0으로 표시한다. (API 호출 불필요)
    if (amount === 0) {
      if (fromKrw) {
        setJpyAmount('0');
      } else {
        setKrwAmount('0');
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

        if (requestId !== exchangeRequestIdRef.current) return;

        const converted = formatAmountWithCommas(String(Math.round(exchangeData.convertedAmount)));

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
        if (requestId !== exchangeRequestIdRef.current) return;

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

  // 가운데 스왑 버튼: 통화 방향만 토글하면 top/bottom 표시가 서로 뒤바뀐다.
  const handleSwapCurrency = React.useCallback((): void => {
    setIsKrwToJpy((prev) => !prev);
  }, []);

  const handleKrwChange = React.useCallback(
    (text: string): void => {
      const formatted = formatAmountWithCommas(text);
      setKrwAmount(formatted);

      if (exchangeDebounceRef.current) clearTimeout(exchangeDebounceRef.current);
      exchangeDebounceRef.current = setTimeout(() => {
        requestExchange(formatted, true);
      }, 500);
    },
    [requestExchange],
  );

  const handleJpyChange = React.useCallback(
    (text: string): void => {
      const formatted = formatAmountWithCommas(text);
      setJpyAmount(formatted);

      if (exchangeDebounceRef.current) clearTimeout(exchangeDebounceRef.current);
      exchangeDebounceRef.current = setTimeout(() => {
        requestExchange(formatted, false);
      }, 500);
    },
    [requestExchange],
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchLocationAndPhrases();
      fetchMyPage();
    }, [fetchLocationAndPhrases, fetchMyPage]),
  );

  // 환율은 최초 1회만 (포커스마다 재호출 X)
  React.useEffect(() => {
    requestExchange('10,000', true);
  }, [requestExchange]);

  const stats = React.useMemo<MyPageStatItem[]>(() => buildStats(myPageData), [myPageData]);

  const phraseSectionTitle = React.useMemo((): string => {
    const targetLang = phrases[0]?.targetLang;
    if (!targetLang) return '기본 회화';
    return `${LANG_LABEL[targetLang]} 기본 회화`;
  }, [phrases]);

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

  const handleNavigateToPrivacyPolicy = (): void => {
    const parentNavigation = navigation.getParent() as
      | { navigate: (...args: unknown[]) => void }
      | undefined;
    if (parentNavigation) {
      parentNavigation.navigate('TermsScreen');
      return;
    }
    navigation.navigate('TermsScreen');
  };

  const handleLogout = React.useCallback(async (): Promise<void> => {
    const { accessToken, refreshToken, clearTokens } = useAuthStore.getState();

    try {
      if (accessToken && refreshToken) {
        await postLogout(accessToken, refreshToken);
      }
    } catch {
      // 서버 요청이 실패해도 클라이언트 세션은 정리한다.
    } finally {
      clearTokens();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  }, [navigation]);

  // 통계 카드는 바텀탭 형제 탭으로 이동한다. (navigation = 탭 네비게이터)
  const handleNavigateToTripCount = (): void => {
    navigation.navigate('MyTrip' as never);
  };

  const handleNavigateToSavedPlace = (): void => {
    navigation.navigate('Bookmark' as never);
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
          <Text className="mt-4 font-pretendardBold text-h text-black">마이페이지</Text>

          <MyPageProfileCard
            nickname={myPageData.nickname}
            email={myPageData.email}
            locationLabel={locationLabel}
            onPressEdit={handleNavigateToProfileEdit}
          />

          <MyPageStatsSection
            stats={stats}
            onPressTripCount={handleNavigateToTripCount}
            onPressSavedPlace={handleNavigateToSavedPlace}
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
            onSwap={handleSwapCurrency}
          />

          <MyPageAccountSection
            items={settingItems}
            onPressAccountSettings={handleNavigateToAccountSettings}
            onPressNotificationSettings={handleNavigateToNotificationSettings}
            onPressPrivacyPolicy={handleNavigateToPrivacyPolicy}
          />

          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="mt-[35px] items-center">
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
