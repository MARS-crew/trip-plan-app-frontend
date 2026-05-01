import Config from 'react-native-config';

import { useAuthStore } from '@/store';
import type { BaseResponse } from '@/types';
import type {
  AgreeData,
  AgreeUpdateRequest,
  GetMyPageData,
  GetPapagoPhrase,
  GetProfileData,
} from '@/types/mypage';

export const getMyPage = async (): Promise<GetMyPageData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/mypage`, {
      headers: { Authorization: `Bearer ${Config.TEMP_TOKEN}` },
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
      headers: { Authorization: `Bearer ${Config.TEMP_TOKEN}` },
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
      headers: { Authorization: `Bearer ${Config.TEMP_TOKEN}` },
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

export const getAgree = async (): Promise<AgreeData> => {
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/agree`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/mypage/agree`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
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
