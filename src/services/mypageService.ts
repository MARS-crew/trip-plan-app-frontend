import Config from 'react-native-config';

import { useAuthStore } from '@/store';
import type { BaseResponse } from '@/types';
import type { EmailRequestData, EmailVerifyData } from '@/types/auth';
import {
  DEFAULT_PAPAGO_TARGET_LANG,
  type AgreeData,
  type AgreeUpdateRequest,
  type GetExchangeData,
  type GetExchangeRequest,
  type GetMyPageData,
  type GetPapagoPhrase,
  type GetProfileData,
  type GetSettingData,
  type PapagoTargetLang,
  type PatchProfileData,
  type PatchProfileRequest,
  type VisitedPlace,
} from '@/types/mypage';
import { parseJsonSafely } from '@/utils/error';
import { getCurrentPosition } from '@/utils/location';
import { countryCodeToPapagoLang, normalizePapagoTargetLang } from '@/utils/papagoLang';
import { fetchCountryCode } from '@/services/mapPlaceService';

const accessToken = (): string => {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }
  return token;
};

export const getMyPageInfo = async (): Promise<GetMyPageData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/mypage`, {
      headers: { Authorization: `Bearer ${accessToken()}` },
    });
    if (!response.ok) throw new Error('마이페이지 조회 실패');
    const json: BaseResponse<GetMyPageData> = await response.json();
    return json.data;
  } catch (error) {
    throw error;
  }
};

export const getProfileDetail = async (): Promise<GetProfileData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/me`, {
      headers: { Authorization: `Bearer ${accessToken()}` },
    });
    if (!response.ok) {
      throw new Error('프로필 조회 실패');
    }
    const json: BaseResponse<GetProfileData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getProfileDetail Error:', error);
    throw error;
  }
};

export const getSetting = async (): Promise<GetSettingData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/setting`, {
      headers: { Authorization: `Bearer ${accessToken()}` },
    });
    if (!response.ok) {
      throw new Error('계정 정보 조회 실패');
    }
    const json: BaseResponse<GetSettingData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getSetting Error:', error);
    throw error;
  }
};

export const getVisitedPlaces = async (): Promise<VisitedPlace[]> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/visited`, {
      headers: { Authorization: `Bearer ${accessToken()}` },
    });
    if (!response.ok) {
      throw new Error('방문한 장소 조회 실패');
    }
    const json: BaseResponse<VisitedPlace[]> = await response.json();
    return json.data ?? [];
  } catch (error) {
    console.error('getVisitedPlaces Error:', error);
    throw error;
  }
};

export const requestMyPageEmailVerification = async (email: string): Promise<EmailRequestData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/email-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify({ email }),
    });

    const body = await parseJsonSafely<BaseResponse<EmailRequestData>>(response);

    if (!response.ok) {
      throw new Error(body?.message || '이메일 인증번호 발송 실패');
    }

    if (!body?.data) {
      throw new Error(body?.message || '이메일 인증번호 발송 실패');
    }

    return body.data;
  } catch (error) {
    throw error;
  }
};

export const verifyMyPageEmailCode = async (
  email: string,
  code: string,
): Promise<EmailVerifyData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/email-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify({ email, code }),
    });

    const body = await parseJsonSafely<BaseResponse<EmailVerifyData>>(response);

    if (!response.ok) {
      throw new Error(body?.message || '이메일 인증번호 확인 실패');
    }

    if (!body?.data) {
      throw new Error(body?.message || '이메일 인증번호 확인 실패');
    }

    return body.data;
  } catch (error) {
    throw error;
  }
};

// 위치/국가는 짧은 시간에 자주 바뀌지 않으므로, 조회된 언어 코드를 일정 시간 캐싱한다.
// 탭 전환마다 GPS 활성화·Google Geocoding 호출이 반복되어 배터리·비용이 낭비되는 것을 방지한다.
const TARGET_LANG_CACHE_TTL = 10 * 60 * 1000; // 10분
let cachedTargetLang: PapagoTargetLang | null = null;
let cachedTargetLangAt = 0;

// 현재 위치를 조회 → 역지오코딩으로 국가 코드 확인 → 어휘 번역 대상 언어로 변환한다.
// TTL 내 캐시가 있으면 재사용하고, 위치 권한 거부·키 누락 등 실패 시 en(영어)으로 폴백한다.
export const resolveCurrentTargetLang = async (): Promise<PapagoTargetLang> => {
  const now = Date.now();
  if (cachedTargetLang && now - cachedTargetLangAt < TARGET_LANG_CACHE_TTL) {
    return cachedTargetLang;
  }

  try {
    const position = await getCurrentPosition();
    if (!position) {
      return cachedTargetLang ?? DEFAULT_PAPAGO_TARGET_LANG;
    }

    const countryCode = await fetchCountryCode(position.latitude, position.longitude);
    // 국가 조회에 성공했을 때만 캐싱한다(실패 시 폴백 값으로 캐시를 오염시키지 않음).
    if (countryCode) {
      cachedTargetLang = countryCodeToPapagoLang(countryCode);
      cachedTargetLangAt = now;
      return cachedTargetLang;
    }

    return cachedTargetLang ?? DEFAULT_PAPAGO_TARGET_LANG;
  } catch (error) {
    console.error('resolveCurrentTargetLang Error:', error);
    return cachedTargetLang ?? DEFAULT_PAPAGO_TARGET_LANG;
  }
};

export const getPapagoPhrases = async (
  targetLang?: string | null,
): Promise<GetPapagoPhrase[]> => {
  try {
    // 지원 목록(en, ja, zh-CN ...) 외 나라/언어가 들어오면 en으로 폴백한다.
    const normalizedTargetLang = normalizePapagoTargetLang(targetLang);
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/papago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify({ targetLang: normalizedTargetLang }),
    });
    if (!response.ok) {
      throw new Error('기본 어휘 번역 조회 실패');
    }
    const json: BaseResponse<GetPapagoPhrase[]> = await response.json();
    return json.data ?? [];
  } catch (error) {
    console.error('getPapagoPhrases Error:', error);
    throw error;
  }
};

export const patchProfile = async (payload: PatchProfileRequest): Promise<PatchProfileData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('프로필 수정 실패');
    }
    const json: BaseResponse<PatchProfileData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('patchProfile Error:', error);
    throw error;
  }
};

export const postExchange = async (payload: GetExchangeRequest): Promise<GetExchangeData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/exchange`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('환율 계산 실패');
    }

    const json: BaseResponse<GetExchangeData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('postExchange Error:', error);
    throw error;
  }
};

export const getAgree = async (): Promise<AgreeData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/agree`, {
      headers: { Authorization: `Bearer ${accessToken()}` },
    });
    if (!response.ok) {
      throw new Error('알림 설정 조회 실패');
    }
    const json: BaseResponse<AgreeData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getAgree Error:', error);
    throw error;
  }
};

export const patchAgree = async (payload: AgreeUpdateRequest): Promise<AgreeData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/agree`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('알림 설정 수정 실패');
    }
    const json: BaseResponse<AgreeData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('patchAgree Error:', error);
    throw error;
  }
};