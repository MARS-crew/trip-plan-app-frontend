import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BookmarkIcon,
  MapIcon,
  LocationOrangeIcon,
  VectorIcon,
  JapanLanguageIcon,
  ExchangeIcon,
  Exchange2Icon,
  BellIcon,
  LogoutIcon,
  SettingIcon,
} from '@/assets';
import type { RootStackParamList } from '@/navigation';

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
    return <MapIcon width={20} height={20} fill="#DF6C20" />;
  }

  if (type === 'bookmark') {
    return <BookmarkIcon width={16} height={20} fill="#DF6C20" />;
  }

  return <LocationOrangeIcon width={20} height={20} />;
};

const SettingItemIcon: React.FC<{ type: SettingItem['type'] }> = ({ type }) => {
  if (type === 'account') {
    return <SettingIcon width={16} height={16} />;
  }

  return <BellIcon width={16} height={16} />;
};

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigateToAccountSettings = (): void => {
    navigation.navigate('AccountSettings');
  };

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-16">
        <Text className="mt-4 text-h1 font-bold text-black">마이페이지</Text>

        <View className="mt-4 rounded-2xl border border-borderGray bg-white p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-3 h-16 w-16 items-center justify-center rounded-full bg-contentBackground">
                <Text className="text-h2 font-bold text-main">t</Text>
              </View>
              <View>
                <Text className="text-h2 font-semibold text-black">여행자</Text>
                <Text className="mt-0.5 text-p1 text-black">travel@gmail.com</Text>
                <View className="mt-1 flex-row items-center">
                  <Text className="text-p">🌐</Text>
                  <Text className="ml-1 text-p text-[#24A89A]">현재 위치: 일본</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleNavigateToAccountSettings}
              activeOpacity={0.8}
              className="rounded-xl bg-contentBackground px-3 py-1.5">
              <Text className="text-p font-medium text-black">편집</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-3 flex-row justify-between">
          {stats.map(item => (
            <View
              key={item.id}
              className="w-[31.5%] rounded-2xl border border-borderGray bg-white py-4">
              <View className="items-center">
                <StatIcon type={item.type} />
                <Text className="mt-2 text-h1 font-bold text-black">{item.value}</Text>
                <Text className="mt-0.5 text-p1 text-gray">{item.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-5 flex-row items-center">
          <JapanLanguageIcon width={16} height={16} />
          <Text className="ml-1.5 text-h3 font-semibold text-black">일본 기본 회화</Text>
        </View>

        <View className="mt-2 overflow-hidden rounded-2xl border border-borderGray bg-white">
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

        <View className="mt-5 flex-row items-center">
          <ExchangeIcon width={16} height={16} />
          <Text className="ml-1.5 text-h3 font-semibold text-black">환율 계산기</Text>
        </View>

        <View className="mt-2 rounded-2xl border border-borderGray bg-white p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-p1 text-gray">1 KRW = 0.110000 JPY</Text>
            <Text className="text-p1 text-gray">일본 엔</Text>
          </View>

          <View className="mt-3 rounded-2xl bg-chip px-4 py-3.5">
            <Text className="text-p1 text-gray">KRW</Text>
            <Text className="mt-1 text-title font-bold text-black">₩ 10,000</Text>
          </View>

          <View className="items-center">
            <View className="mb-2 mt-2 h-8 w-8 items-center justify-center rounded-full bg-main">
              <Exchange2Icon width={14} height={14} />
            </View>
          </View>

          <View className="rounded-2xl bg-chip px-4 py-3.5">
            <Text className="text-p1 text-gray">JPY</Text>
            <Text className="mt-1 text-title font-bold text-main">¥ 1,100</Text>
          </View>
        </View>

        <Text className="mt-5 text-p1 text-gray">계정</Text>

        <View className="mt-2 overflow-hidden rounded-2xl border border-borderGray bg-white">
          {settingItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={item.type === 'account' ? handleNavigateToAccountSettings : undefined}
              activeOpacity={0.8}
              className={`flex-row items-center justify-between px-4 py-4 ${index !== settingItems.length - 1 ? 'border-b border-borderGray' : ''}`}>
              <View className="flex-row items-center">
                <View className="h-9 w-9 items-center justify-center rounded-xl bg-chip">
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

        <TouchableOpacity activeOpacity={0.8} className="mt-7 -mb-7 items-center">
          <View className="flex-row items-center">
            <LogoutIcon width={16} height={16} />
            <Text className="ml-1.5 text-p1 font-semibold text-[#F04A3E]">로그아웃</Text>
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