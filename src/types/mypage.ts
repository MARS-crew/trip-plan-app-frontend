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

export type PapagoTargetLang =
  | 'en'
  | 'ja'
  | 'zh-CN'
  | 'zh-TW'
  | 'vi'
  | 'th'
  | 'id'
  | 'fr'
  | 'es'
  | 'ru'
  | 'de'
  | 'it';

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
