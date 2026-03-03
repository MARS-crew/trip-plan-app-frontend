// Type definitions for the application

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Trip Types
export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
}

// Exchange Rate Types
export interface ExchangeRateResponse {
  RESULT: number; // 1: 성공, 2: DATA코드 오류, 3: 인증코드 오류, 4: 일일제한횟수 초과
  CUR_UNIT: string; // 통화코드
  CUR_NM: string; // 국가/통화명
  ITB: string; // 전신환(송금) 빈 오일제
  TTS: string; // 전신환(송금) 보내실제
  DEAL_BAS_R: string; // 매매 기준율
  BKPR: string; // 장부가격
  YY_EFEE_R: string; // 년환기준율
  TEN_DD_EFEE_R: string; // 10일환기준율
  KFTC_DEAL_BAS_R: string; // 서울외국환중개 매매기준율
  KFTC_BKPR: string; // 서울외국환중개 장부가격
}

export interface ExchangeRateData {
  currencyCode: string;
  currencyName: string;
  buyingRate: number;
  sellingRate: number;
  baseRate: number;
  timestamp: string;
}

// Add other types as needed
