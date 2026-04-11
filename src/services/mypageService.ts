import Config from 'react-native-config';

import type { BaseResponse } from '@/types';
import type { GetMyPageData, GetProfileData } from '@/types/mypage';

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
