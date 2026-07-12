import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TopBar } from '@/components/ui';
import { SecurityLock, BellIcon, VectorIcon } from '@/assets/icons';
import Time2Icon from '@/assets/icons/time2.svg';
import type { RootStackParamList } from '@/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TermsItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: 'PrivacyPolicyScreen' | 'MarketingConsentScreen' | 'NightMarketingScreen';
}

const TERMS_ITEMS: TermsItem[] = [
  {
    id: 'privacy-policy',
    title: '개인정보 수집 및 이용 동의',
    description: '필수 약관',
    icon: <SecurityLock width={16} height={16} />,
    route: 'PrivacyPolicyScreen',
  },
  {
    id: 'marketing-consent',
    title: '마케팅 정보 수신 동의',
    description: '선택 약관',
    icon: <BellIcon width={16} height={16} />,
    route: 'MarketingConsentScreen',
  },
  {
    id: 'night-marketing-consent',
    title: '야간 마케팅 정보 수신 동의',
    description: '선택 약관',
    icon: <Time2Icon width={16} height={16} />,
    route: 'NightMarketingScreen',
  },
];

const TermsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-screenBackground" edges={['top']}>
      <TopBar title="이용약관" onPress={navigation.goBack} />
      <View className="px-4">
        <Text className="ml-1.5 mt-4 font-pretendardSemiBold text-xs text-black">
          약관 및 동의
        </Text>

        <View className="mt-3 overflow-hidden rounded-lg border border-borderGray bg-white">
          {TERMS_ITEMS.map((item, index) => (
            <View key={item.id} className={index !== 0 ? 'border-t border-borderGray' : ''}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.route)}
                className="flex-row items-center justify-between px-4 py-4">
                <View className="flex-row items-center">
                  <View className="h-9 w-9 items-center justify-center rounded-lg bg-chip">
                    {item.icon}
                  </View>

                  <View className="ml-3">
                    <Text className="font-pretendardMedium text-sm leading-[17px] text-black">
                      {item.title}
                    </Text>
                    <Text className="mt-[2px] text-p leading-[16px] text-black">
                      {item.description}
                    </Text>
                  </View>
                </View>

                <VectorIcon width={16} height={16} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

TermsScreen.displayName = 'TermsScreen';

export default TermsScreen;
export { TermsScreen };
