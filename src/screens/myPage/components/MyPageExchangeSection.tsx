import React from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';

import ExchangeIcon from '@/assets/icons/exchange.svg';
import Exchange2Icon from '@/assets/icons/exchange2.svg';
import { COLORS } from '@/constants';

interface MyPageExchangeSectionProps {
  exchangeRateText: string;
  rightCurrencyLabel: string;
  topCurrencyCode: 'KRW' | 'JPY';
  bottomCurrencyCode: 'KRW' | 'JPY';
  topCurrencySymbol: '₩' | '¥';
  bottomCurrencySymbol: '₩' | '¥';
  topSymbolSpacingClass: string;
  bottomSymbolSpacingClass: string;
  topAmount: string;
  bottomAmount: string;
  onChangeTopAmount: (text: string) => void;
  onChangeBottomAmount: (text: string) => void;
  onPressSwap: () => void;
}

const cardStyle = {
  shadowColor: COLORS.gray,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 1,
};

const MyPageExchangeSection: React.FC<MyPageExchangeSectionProps> = ({
  exchangeRateText,
  rightCurrencyLabel,
  topCurrencyCode,
  bottomCurrencyCode,
  topCurrencySymbol,
  bottomCurrencySymbol,
  topSymbolSpacingClass,
  bottomSymbolSpacingClass,
  topAmount,
  bottomAmount,
  onChangeTopAmount,
  onChangeBottomAmount,
  onPressSwap,
}) => {
  return (
    <>
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
              onChangeText={onChangeTopAmount}
              keyboardType="number-pad"
              className="flex-1 p-0 font-pretendardBold text-h1 text-black"
            />
          </View>
        </View>

        <View className="items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressSwap}
            className="mb-1 mt-1 h-8 w-8 items-center justify-center rounded-full bg-main">
            <Exchange2Icon width={14} height={14} />
          </TouchableOpacity>
        </View>

        <View className="rounded-xl bg-chip px-4 py-3.5">
          <Text className="text-p1 text-gray">{bottomCurrencyCode}</Text>
          <View className="mt-1 flex-row items-center">
            <Text className={`${bottomSymbolSpacingClass} font-pretendardBold text-h1 text-main`}>
              {bottomCurrencySymbol}
            </Text>
            <TextInput
              value={bottomAmount}
              onChangeText={onChangeBottomAmount}
              keyboardType="number-pad"
              className="flex-1 p-0 font-pretendardBold text-h1 text-main"
            />
          </View>
        </View>
      </View>
    </>
  );
};

MyPageExchangeSection.displayName = 'MyPageExchangeSection';

export default MyPageExchangeSection;
export { MyPageExchangeSection };
