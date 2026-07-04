export interface GetMyPageData {
  nickname: string;
  email: string;
  tripCount: number;
  savedPlaceCount: number;
  visitedPlaceCount: number;
}

export type StatItemType = 'map' | 'bookmark' | 'marker';

export interface StatItem {
  id: string;
  label: string;
  value: number;
  type: StatItemType;
}

export type SettingItemType = 'account' | 'notification';

export interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: SettingItemType;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface GetProfileData {
  birth: string;
  countryCode: string;
  gender: Gender;
  name: string;
  nickname: string;
}

// 백엔드(스웨거)가 지원하는 어휘 번역 대상 언어 코드 목록.
// 이 목록에 없는 언어가 들어오면 en(영어)으로 폴백한다.
export const PAPAGO_TARGET_LANGS = [
  'en',
  'ja',
  'zh-CN',
  'zh-TW',
  'vi',
  'th',
  'id',
  'fr',
  'es',
  'ru',
  'de',
  'it',
] as const;

export type PapagoTargetLang = (typeof PAPAGO_TARGET_LANGS)[number];

// 지원 목록 외 언어가 들어올 때 사용할 기본 언어.
export const DEFAULT_PAPAGO_TARGET_LANG: PapagoTargetLang = 'en';

export interface GetPapagoPhrase {
  originalText: string;
  translatedText: string;
  targetLang: PapagoTargetLang;
  pronounce: string;
}

export interface PatchProfileRequest {
  nickname?: string;
  password?: string;
  passwordConfirm?: string;
  gender?: Gender;
  birth?: string;
  countryCode?: string;
}

export interface PatchProfileData {
  birth: string;
  countryCode: string;
  gender: Gender;
  nickname: string;
}

export type ExchangeCurrencyUnit = 'JPY';

export interface GetExchangeRequest {
  curUnit: ExchangeCurrencyUnit;
  amount: number;
  fromKrw: boolean;
}

export interface GetExchangeData {
  curUnit: ExchangeCurrencyUnit;
  curNm: string;
  dealBasR: number;
  convertedAmount: number;
  searchDate: string;
}

export interface GetSettingData {
  birth: string;
  countryCode: string;
  email: string;
  gender: Gender;
  nickname: string;
}

export type AgreeFlag = 'Y' | 'N';

export interface AgreeData {
  marketingAgreed: AgreeFlag;
  nightMarketingAgreed: AgreeFlag;
}

export interface AgreeUpdateRequest {
  marketingAgreed: AgreeFlag;
  nightMarketingAgreed: AgreeFlag;
}

export interface VisitedPlace {
  visitedPlaceId: number;
  placeId: number;
  visitedAt: string;
  placeName: string;
  cityName: string;
  countryName: string;
  imageUrl: string | null;
  placeType: string;
  reviewWrittenYn: 'Y' | 'N';
}

export interface VisitedPlaceItem {
  id: string;
  placeId: string;
  date: string;
  title: string;
  location: string;
  tags: string[];
  reviewCta: string;
  hasReview: boolean;
  imageUrl: string | null;
}