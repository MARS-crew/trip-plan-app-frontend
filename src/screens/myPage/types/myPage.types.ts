import type { GetPapagoPhrase } from '@/types/mypage';

export type MyPageStatType = 'map' | 'bookmark' | 'marker';

export interface MyPageStatItem {
  id: string;
  label: string;
  value: number;
  type: MyPageStatType;
}

export type MyPageSettingType = 'account' | 'notification';

export interface MyPageSettingItem {
  id: string;
  title: string;
  description: string;
  type: MyPageSettingType;
}

export interface MyPageProfileCardProps {
  nickname: string;
  email: string;
  locationLabel: string;
  onPressEdit: () => void;
  avatarText?: string;
}

export interface MyPageStatsSectionProps {
  stats: MyPageStatItem[];
  onPressVisitedPlaceList: () => void;
}

export interface MyPageAccountSectionProps {
  items: MyPageSettingItem[];
  onPressAccountSettings: () => void;
  onPressNotificationSettings: () => void;
}

export interface MyPagePhraseSectionProps {
  title: string;
  phrases: GetPapagoPhrase[];
}

export type MyPageCurrencyCode = 'KRW' | 'JPY';
export type MyPageCurrencySymbol = '₩' | '¥';

export interface MyPageExchangeSectionProps {
  exchangeRateText: string;
  rightCurrencyLabel: string;
  topCurrencyCode: MyPageCurrencyCode;
  bottomCurrencyCode: MyPageCurrencyCode;
  topCurrencySymbol: MyPageCurrencySymbol;
  bottomCurrencySymbol: MyPageCurrencySymbol;
  topSymbolSpacingClass: string;
  bottomSymbolSpacingClass: string;
  topAmount: string;
  bottomAmount: string;
  onChangeTopAmount: (text: string) => void;
  onChangeBottomAmount: (text: string) => void;
}
