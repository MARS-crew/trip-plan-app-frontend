import { ExchangeRateResponse, ExchangeRateData } from '../types';

const API_URL = 'https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON';
const AUTH_KEY = 'RSu4909GdEh1ILWW2M8SX8zmz5EICQlx';

interface ExchangeRateParams {
  authkey: string;
  searchdate?: string; // ex) 20260303 (YYYYMMDD)
  data: 'AP01' | 'AP02' | 'AP03'; // AP01: 환율
}

/**
 * API 응답 필드명을 표준 타입으로 변환합니다.
 * API는 소문자 필드명을 사용하므로 이를 변환해야 합니다.
 */
interface RawExchangeRateResponse {
  result: number;
  cur_unit: string;
  cur_nm: string;
  ttb: string; // 전신환 수취율
  tts: string; // 전신환 송금율
  deal_bas_r: string; // 매매 기준율
  bkpr: string; // 장부가격
  yy_efee_r: string; // 년환기준율
  ten_dd_efee_r: string; // 10일환기준율
  kftc_deal_bas_r: string; // 서울외국환중개 매매기준율
  kftc_bkpr: string; // 서울외국환중개 장부가격
}

/**
 * YYYYMMDD 형식의 날짜 문자열을 생성합니다.
 */
const getDateString = (daysAgo: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0].replace(/-/g, '');
};

/**
 * 특정 날짜의 환율 정보를 API에서 조회합니다.
 */
const fetchRatesForDate = async (
  searchDate: string
): Promise<RawExchangeRateResponse[]> => {
  const params: ExchangeRateParams = {
    authkey: AUTH_KEY,
    data: 'AP01',
    searchdate: searchDate,
  };

  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const response = await fetch(`${API_URL}?${queryString}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as RawExchangeRateResponse[];
};

/**
 * 환율 응답 데이터를 표준 형식으로 변환합니다.
 */
const convertToStandardFormat = (
  rawData: RawExchangeRateResponse[]
): ExchangeRateResponse[] => {
  return rawData.map(item => ({
    RESULT: item.result,
    CUR_UNIT: item.cur_unit,
    CUR_NM: item.cur_nm,
    ITB: item.ttb,
    TTS: item.tts,
    DEAL_BAS_R: item.deal_bas_r,
    BKPR: item.bkpr,
    YY_EFEE_R: item.yy_efee_r,
    TEN_DD_EFEE_R: item.ten_dd_efee_r,
    KFTC_DEAL_BAS_R: item.kftc_deal_bas_r,
    KFTC_BKPR: item.kftc_bkpr,
  }));
};

/**
 * 최근의 유효한 환율 정보를 조회합니다.
 * API가 특정 날짜에 데이터를 반환하지 않을 경우(공휴일, 주말 등),
 * 이전 날짜들을 순차적으로 시도합니다.
 * @param maxDaysBack - 최대 몇 일 전까지 시도할지 (기본값: 7일)
 */
const fetchLatestExchangeRates = async (
  maxDaysBack: number = 7
): Promise<ExchangeRateResponse[]> => {
  let lastError: Error | null = null;

  // 최대 7일 전까지 시도
  for (let daysAgo = 0; daysAgo <= maxDaysBack; daysAgo++) {
    try {
      const dateStr = getDateString(daysAgo);
      console.log(`환율 정보 조회 중... (${dateStr})`);
      
      const rawData = await fetchRatesForDate(dateStr);
      
      // 데이터가 있으면 반환
      if (rawData && rawData.length > 0) {
        console.log(`✓ ${dateStr}에서 ${rawData.length}개의 환율 정보 조회됨`);
        return convertToStandardFormat(rawData);
      }
    } catch (error) {
      lastError = error as Error;
      console.warn(`${daysAgo}일 전 조회 실패, 계속 시도...`);
      continue;
    }
  }

  // 모든 시도가 실패했으면 에러 던지기
  throw lastError || new Error('최근 7일 내에서 환율 정보를 찾을 수 없습니다.');
};

/**
 * 환율 정보를 API에서 조회합니다.
 * @param currencyCode - 통화코드 (예: USD, JPY, EUR 등)
 * @param searchDate - 검색 요청 날짜 (YYYYMMDD 형식, 지정 시 정확한 날짜만 조회)
 * @returns ExchangeRateResponse 배열
 */
export const fetchExchangeRates = async (
  currencyCode?: string,
  searchDate?: string
): Promise<ExchangeRateResponse[]> => {
  try {
    let data: ExchangeRateResponse[];

    if (searchDate) {
      // 특정 날짜 지정 시: 해당 날짜만 조회
      const rawData = await fetchRatesForDate(searchDate);
      data = convertToStandardFormat(rawData);
    } else {
      // 기본: 최근 유효한 데이터 조회
      data = await fetchLatestExchangeRates();
    }

    // 특정 통화코드로 필터링
    if (currencyCode) {
      return data.filter(item => item.CUR_UNIT === currencyCode);
    }

    return data;
  } catch (error) {
    console.error('❌ 환율 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 모든 환율 정보를 조회합니다.
 */
export const fetchAllExchangeRates = async (): Promise<ExchangeRateResponse[]> => {
  return fetchExchangeRates();
};

/**
 * 특정 통화의 환율 정보를 조회합니다.
 * @param currencyCode - 통화코드 (예: USD, JPY, EUR 등)
 */
export const fetchExchangeRateByCurrency = async (
  currencyCode: string
): Promise<ExchangeRateResponse | null> => {
  const rates = await fetchExchangeRates(currencyCode);
  return rates.length > 0 ? rates[0] : null;
};

/**
 * API 응답 데이터를 간편한 형식으로 변환합니다.
 */
export const parseExchangeRateData = (
  response: ExchangeRateResponse
): ExchangeRateData => {
  return {
    currencyCode: response.CUR_UNIT,
    currencyName: response.CUR_NM,
    buyingRate: parseFloat(response.ITB || '0'),
    sellingRate: parseFloat(response.TTS || '0'),
    baseRate: parseFloat(response.DEAL_BAS_R || '0'),
    timestamp: new Date().toISOString(),
  };
};
