import Config from 'react-native-config';

import { useAuthStore } from '@/store/authStore';
import type { BaseResponse } from '@/types';
import type {
  GetExchangeData,
  GetExchangeRequest,
  GetMyPageData,
  GetPapagoPhrase,
  GetProfileData,
} from '@/types/mypage';

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
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/me`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
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

export const getPapagoPhrases = async (): Promise<GetPapagoPhrase[]> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/papago`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
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

export const postExchange = async (payload: GetExchangeRequest): Promise<GetExchangeData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/exchange`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
