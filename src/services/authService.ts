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

  // 409 Conflict: 중복된 아이디
  if (response.status === 409) {
    return true;
  }

  // 200 OK: 사용 가능한 아이디
  if (response.ok) {
    return false;
  }

  // 그 외 상태 코드는 에러로 처리
  try {
    const body: BaseResponse<CheckIdErrorBody> = await response.json();
    throw new Error(body.message || '아이디 중복 확인 실패');
  } catch {
    throw new Error('아이디 중복 확인 실패');
  }
};
