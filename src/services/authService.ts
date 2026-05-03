import Config from 'react-native-config';

import type {
  EmailRequestData,
  EmailVerifyData,
  LoginRequest,
  LoginResponse,
  LoginResult,
  LoginWarningType,
  ReissueTokenRequest,
  ReissueTokenResponse,
  ReissueTokenResult,
  ReissueTokenWarningType,
} from '@/types/auth';
import type { BaseResponse } from '@/types';

import { ApiError, handleError } from '@/utils/error';
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

import {
  REQUEST_TIMEOUT_ERROR_MESSAGE,
  fetchWithTimeout,
  parseJsonSafely,
  getDefaultMessageByStatus,
  getLoginWarningType,
  getReissueWarningType,
} from '@/utils/error';

export const postLogin = async (payload: LoginRequest): Promise<LoginResult> => {
  try {
    const response = await fetchWithTimeout(`${Config.API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await parseJsonSafely<LoginResponse>(response);

    if (!response.ok) {
      return {
        ok: false,
        warningType: getLoginWarningType(response.status, json?.code ?? ''),
        message: json?.message ?? getDefaultMessageByStatus(response.status),
      };
    }

    if (!json?.success || !json.data) {
      return {
        ok: false,
        warningType: 'UNKNOWN_ERROR',
        message: json?.message ?? '응답 형식이 올바르지 않습니다.',
      };
    }

    return { ok: true, data: json.data };
  } catch (error) {
    if (error instanceof Error && error.message === REQUEST_TIMEOUT_ERROR_MESSAGE) {
      return {
        ok: false,
        warningType: 'NETWORK_ERROR',
        message: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
      };
    }

    const isNetworkError = error instanceof TypeError;

    return {
      ok: false,
      warningType: isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
    };
  }
};

export const postReissueToken = async (
  payload: ReissueTokenRequest,
): Promise<ReissueTokenResult> => {
  try {
    const response = await fetchWithTimeout(`${Config.API_BASE_URL}/api/v1/auth/reissue`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await parseJsonSafely<ReissueTokenResponse>(response);

    if (!response.ok) {
      return {
        ok: false,
        warningType: getReissueWarningType(response.status, json?.code ?? ''),
        message: json?.message ?? getDefaultMessageByStatus(response.status),
      };
    }

    if (!json?.success || !json.data) {
      return {
        ok: false,
        warningType: 'UNKNOWN_ERROR',
        message: json?.message ?? '응답 형식이 올바르지 않습니다.',
      };
    }

    return { ok: true, data: json.data };
  } catch (error) {
    if (error instanceof Error && error.message === REQUEST_TIMEOUT_ERROR_MESSAGE) {
      return {
        ok: false,
        warningType: 'NETWORK_ERROR',
        message: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
      };
    }

    const isNetworkError = error instanceof TypeError;

    return {
      ok: false,
      warningType: isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
      message: isNetworkError ? '네트워크 연결을 확인해주세요.' : undefined,
    };
  }
};

export const requestEmailVerification = async (email: string): Promise<EmailRequestData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/auth/email-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export const verifyEmailCode = async (email: string, code: string): Promise<EmailVerifyData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/auth/email-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
