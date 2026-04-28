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
}

export interface VisitedPlace {
  visitedPlaceId: number;
  visitedAt: string;
  placeName: string;
  cityName: string;
  countryName: string;
  imageUrl: string | null;
  placeType: string;
}

export interface VisitedPlaceItem {
  id: string;
  date: string;
  title: string;
  location: string;
  tags: string[];
  reviewCta: string;
  hasReview: boolean;
  imageUrl: string | null;
}
