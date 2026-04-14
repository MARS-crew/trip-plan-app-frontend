export interface GetMyPageData {
  nickname: string;
  email: string;
  tripCount: number;
  savedPlaceCount: number;
  visitedPlaceCount: number;
}

export type StatType = 'map' | 'bookmark' | 'marker';

export interface StatItem {
  id: string;
  label: string;
  value: number;
  type: StatType;
}

export interface PhraseItem {
  id: string;
  japanese: string;
  koreanPronunciation: string;
  meaning: string;
}

export type SettingType = 'account' | 'notification';

export interface SettingItem {
  id: string;
  title: string;
  description: string;
  type: SettingType;
}

export type CurrencyCode = 'KRW' | 'JPY';
