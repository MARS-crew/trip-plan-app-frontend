export interface GetMyPageData {
  nickname: string;
  email: string;
  tripCount: number;
  savedPlaceCount: number;
  visitedPlaceCount: number;
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
