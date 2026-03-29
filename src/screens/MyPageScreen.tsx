import React from 'react';
import { useNavigation } from '@react-navigation/native';
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
import EarthIcon from '@/assets/icons/earth.svg';
import { COLORS } from '@/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface StatItem {
  id: string;
  label: string;
  value: number;
  type: 'map' | 'bookmark' | 'marker';
}

interface PhraseItem {
  id: string;
  japanese: string;
  koreanPronunciation: string;
  meaning: string;
}

interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: 'account' | 'notification';
}

const stats: StatItem[] = [
  { id: 'trip-count', label: '여행 횟수', value: 12, type: 'map' },
  { id: 'saved-place', label: '저장된 장소', value: 12, type: 'bookmark' },
  { id: 'visited-place', label: '방문한 장소', value: 12, type: 'marker' },
];

const phrases: PhraseItem[] = [
  {
    id: 'phrase-1',
    japanese: 'ありがとう',
    koreanPronunciation: '아리가토우',
    meaning: '감사합니다',
  },
  {
    id: 'phrase-2',
    japanese: 'ありがとう',
    koreanPronunciation: '아리가토우',
    meaning: '감사합니다',
  },
  {
    id: 'phrase-3',
    japanese: 'ありがとう',
    koreanPronunciation: '아리가토우',
    meaning: '감사합니다',
  },
  {
    id: 'phrase-4',
    japanese: 'ありがとう',
    koreanPronunciation: '아리가토우',
    meaning: '감사합니다',
  },
  {
    id: 'phrase-5',
    japanese: 'ありがとう',
    koreanPronunciation: '아리가토우',
    meaning: '감사합니다',
  },
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
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 1.5,
  elevation: 1,
};

const RATE_KRW_TO_JPY = '1 KRW = 0.110000 JPY';
const RATE_JPY_TO_KRW = '1 JPY = 9.090909 KRW';

const formatAmountWithCommas = (input: string): string => {
  const digitsOnly = input.replace(/\D/g, '');
  if (!digitsOnly) {
    return '';
  }

  const normalized = digitsOnly.replace(/^0+(?=\d)/, '');
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [krwAmount, setKrwAmount] = React.useState<string>('10,000');
  const [jpyAmount, setJpyAmount] = React.useState<string>('1,100');
  const [isKrwToJpy, setIsKrwToJpy] = React.useState<boolean>(true);

  const handleAmountChange = React.useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (text: string): void => {
        setter(formatAmountWithCommas(text));
      },
    [],
  );

  const handleSwapExchange = React.useCallback((): void => {
    setIsKrwToJpy(prev => !prev);
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
  const handleTopAmountChange = isKrwToJpy
    ? handleAmountChange(setKrwAmount)
    : handleAmountChange(setJpyAmount);
  const handleBottomAmountChange = isKrwToJpy
    ? handleAmountChange(setJpyAmount)
    : handleAmountChange(setKrwAmount);

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
        <View className="px-4 pb-16">
          <Text className="mt-3.5 text-h font-bold text-black">마이페이지</Text>

          <View
            className="mt-3.5 rounded-lg border border-subtleBorder bg-white p-4"
            style={cardStyle}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-16 w-16 items-center justify-center rounded-full bg-contentBackground">
                  <Text className="text-h2 font-bold text-main">t</Text>
                </View>
                <View>
                  <Text className="text-h2 font-semibold text-black">여행자</Text>
                  <Text className="mt-0.5 text-p1 text-black">travel@gmail.com</Text>
                  <View className="mt-1 flex-row items-center">
                    <EarthIcon width={12} height={12} />
                    <Text className="ml-1 text-p text-locationTeal">현재 위치: 일본</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleNavigateToProfileEdit}
                activeOpacity={0.8}
                className="rounded-lg bg-chip px-3 py-1.5">
                <Text className="text-p font-medium text-black">편집</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between">
            {stats.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={item.type === 'marker' ? 0.8 : 1}
                disabled={item.type !== 'marker'}
                onPress={item.type === 'marker' ? handleNavigateToVisitedPlaceList : undefined}
                className="w-[31.5%] rounded-lg border border-subtleBorder bg-white py-4"
                style={cardStyle}>
                <View className="items-center">
                  <StatIcon type={item.type} />
                  <Text className="mt-2 text-h1 font-bold text-black">{item.value}</Text>
                  <Text className="mt-0.5 text-p text-gray">{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-5 ml-1 flex-row items-center">
            <JapanLanguageIcon width={16} height={16} />
            <Text className="ml-1.5 text-h3 font-semibold text-black">일본 기본 회화</Text>
          </View>

          <View
            className="mt-2 overflow-hidden rounded-lg border border-subtleBorder bg-white"
            style={cardStyle}>
            {phrases.map((phrase, index) => (
              <View
                key={phrase.id}
                className={`px-4 py-3 ${index !== phrases.length - 1 ? 'border-b border-borderGray' : ''}`}>
                <Text className="text-h2 font-bold text-black">{phrase.japanese}</Text>
                <View className="mt-0.5 flex-row items-center">
                  <Text className="text-p1 text-gray">{phrase.koreanPronunciation}</Text>
                  <Text className="ml-2 text-p1 text-main">{phrase.meaning}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-5 ml-1 flex-row items-center">
            <ExchangeIcon width={16} height={16} />
            <Text className="ml-1.5 text-h3 font-semibold text-black">환율 계산기</Text>
          </View>

          <View className="mt-2 rounded-lg border border-subtleBorder bg-white p-4" style={cardStyle}>
            <View className="flex-row items-center justify-between">
              <Text className="text-p text-xs text-left text-gray">{exchangeRateText}</Text>
              <Text className="text-p text-gray">{rightCurrencyLabel}</Text>
            </View>

            <View className="mt-3 rounded-xl bg-chip px-4 py-3.5">
              <Text className="text-p1 text-gray">{topCurrencyCode}</Text>
              <View className="mt-1 flex-row items-center">
                <Text className="mr-1 text-h1 font-bold text-black">{topCurrencySymbol}</Text>
                <TextInput
                  value={topAmount}
                  onChangeText={handleTopAmountChange}
                  keyboardType="number-pad"
                  className="flex-1 p-0 text-h1 font-bold text-black"
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
                <Text className="mr-1 text-h1 font-bold text-main">{bottomCurrencySymbol}</Text>
                <TextInput
                  value={bottomAmount}
                  onChangeText={handleBottomAmountChange}
                  keyboardType="number-pad"
                  className="flex-1 p-0 text-h1 font-bold text-main"
                />
              </View>
            </View>
          </View>

          <Text className="mt-5 ml-1 text-p1 font-semibold text-gray">계정</Text>

          <View
            className="mt-2 overflow-hidden rounded-lg border border-subtleBorder bg-white"
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
                    <Text className="text-h3 font-semibold text-black">{item.title}</Text>
                    <Text className="mt-0.5 text-p1 text-gray">{item.description}</Text>
                  </View>
                </View>

                <VectorIcon width={16} height={16} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.8} className="mt-7 items-center">
            <View className="flex-row items-center">
              <LogoutIcon width={16} height={16} />
              <Text className="ml-1.5 text-p1 font-semibold text-logoutRed">로그아웃</Text>
            </View>
          </TouchableOpacity>
        </View>
      

      <View className="mt-2 gap-2">
            <TouchableOpacity
              onPress={handleNavigateToPrivacy}
              activeOpacity={0.8}
              className="rounded-lg bg-main px-6 py-3">
              <Text className="text-center font-semibold text-white">약관동의</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNavigateToMarketing}
              activeOpacity={0.8}
              className="rounded-lg bg-main px-6 py-3">
              <Text className="text-center font-semibold text-white">마케팅동의</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNavigateToNightMarketing}
              activeOpacity={0.8}
              className="rounded-lg bg-main px-6 py-3">
              <Text className="text-center font-semibold text-white">야간마케팅동의</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
    </SafeAreaView>

    
  );
};

MyPageScreen.displayName = 'MyPageScreen';

export default MyPageScreen;
export { MyPageScreen };
