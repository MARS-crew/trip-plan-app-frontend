import Config from 'react-native-config';

import type { BaseResponse } from '@/types';

interface CheckIdErrorBody {
  code?: string;
}

// true: 중복 아이디, false: 사용 가능 아이디
export const checkDuplicateUserId = async (userId: string): Promise<boolean> => {
  const trimmedUserId = userId.trim();
  const query = encodeURIComponent(trimmedUserId);

  const response = await fetch(`${Config.API_BASE_URL}/api/v1/auth/check-id?usersId=${query}`, {
    method: 'GET',
  });

  if (response.status === 409) {
    return true;
  }

  if (response.status === 404) {
    return false;
  }

  if (response.ok) {
    return false;
  }

  try {
    const body: BaseResponse<CheckIdErrorBody> = await response.json();
    throw new Error(body.message || '아이디 중복 확인 실패');
  } catch {
    throw new Error('아이디 중복 확인 실패');
  }
};
