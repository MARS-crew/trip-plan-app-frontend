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
