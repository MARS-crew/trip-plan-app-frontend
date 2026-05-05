import Config from 'react-native-config';

import { useAuthStore } from '@/store/authStore';
import type { BaseResponse } from '@/types';
import type { EmailRequestData, EmailVerifyData } from '@/types/auth';
import type {
  GetMyPageData,
  GetPapagoPhrase,
  GetProfileData,
  PapagoTargetLang,
} from '@/types/mypage';
import { parseJsonSafely } from '@/utils/error';

const getAccessToken = (): string => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }
  return accessToken;
};

export const getMyPage = async (): Promise<GetMyPageData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/mypage`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    if (!response.ok) {
      throw new Error('마이페이지 조회 실패');
    }
    const json: BaseResponse<GetMyPageData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getMyPage Error:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<GetProfileData> => {
  try {
    const accessToken = getAccessToken();
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error('프로필 조회 실패');
    }
    const json: BaseResponse<GetProfileData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getProfile Error:', error);
    throw error;
  }
};

export const requestMyPageEmailVerification = async (
  email: string,
): Promise<EmailRequestData> => {
  try {
    const accessToken = getAccessToken();
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/email-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
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
    const accessToken = getAccessToken();
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/email-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
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
    const accessToken = getAccessToken();
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/papago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
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
    const accessToken = useAuthStore.getState().accessToken ?? '';
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
