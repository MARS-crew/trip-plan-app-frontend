import Config from 'react-native-config';

import { useAuthStore } from '@/store/authStore';
import type { BaseResponse } from '@/types';
import type {
  GetMyPageData,
  GetPapagoPhrase,
  GetProfileData,
  PapagoTargetLang,
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

export const getPapagoPhrases = async (
  targetLang: PapagoTargetLang = 'ja',
): Promise<GetPapagoPhrase[]> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/papago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAccessToken()}`,
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
