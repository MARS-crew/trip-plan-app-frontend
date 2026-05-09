import Config from 'react-native-config';

import { useAuthStore } from '@/store';
import type { BaseResponse } from '@/types';
import type { EmailRequestData, EmailVerifyData } from '@/types/auth';
import type {
  GetExchangeData,
  GetExchangeRequest,
  GetMyPageData,
  GetPapagoPhrase,
  GetProfileData,
  GetSettingData,
  PapagoTargetLang,
  PatchProfileData,
  PatchProfileRequest,
} from '@/types/mypage';
import { parseJsonSafely } from '@/utils/error';

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

export const getPapagoPhrases = async (
  targetLang: PapagoTargetLang = 'ja',
): Promise<GetPapagoPhrase[]> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/papago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify({ targetLang }),
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
