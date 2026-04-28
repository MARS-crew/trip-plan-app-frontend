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

export type AgreeFlag = 'Y' | 'N';

export interface AgreeData {
  marketingAgreed: AgreeFlag;
  nightMarketingAgreed: AgreeFlag;
}

export interface AgreeUpdateRequest {
  marketingAgreed: AgreeFlag;
  nightMarketingAgreed: AgreeFlag;
}
