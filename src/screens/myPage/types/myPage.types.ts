import type { GetPapagoPhrase, VisitedPlaceItem } from '@/types/mypage';

export interface VisitedPlaceCardProps {
  item: VisitedPlaceItem;
  onPressDetail: (item: VisitedPlaceItem) => void;
  onPressReview: (item: VisitedPlaceItem) => void;
}

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
  onPressTripCount: () => void;
  onPressSavedPlace: () => void;
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
  onSwap: () => void;
}

export type ProfileItemType = 'nickname' | 'email' | 'birthday' | 'gender' | 'country';

export interface ProfileItem {
  id: string;
  label: string;
  value: string;
  type: ProfileItemType;
}

export interface ProfileInfoRowProps {
  item: ProfileItem;
  showDivider: boolean;
}

export interface WithdrawSectionProps {
  onPressWithdraw: () => void;
}

export type ProfileEditGenderLabel = '남성' | '여성' | '기타';

export interface ProfileEditDatePickerOptions {
  years: number[];
  months: number[];
  days: number[];
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
}

export interface ProfileEditSpinnerColumnProps {
  items: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  format?: (n: number) => string;
}

export interface WithdrawSectionProps {
  onPressWithdraw: () => void;
}
