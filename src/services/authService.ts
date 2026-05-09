import { getEnvConfig } from '@/config/env';

import { useAuthStore } from '@/store';
import type {
  FindIdRequest,
  FindIdData,
  FindIdResult,
  FindIdResponse,
  EmailRequestData,
  EmailVerifyData,
  LoginRequest,
  LoginResponse,
  LoginResult,
  ReissueTokenRequest,
  ReissueTokenResponse,
  ReissueTokenResult,
  SignUpRequest,
  SignUpResponse,
  SignUpResult,
  WithdrawRequest,
} from '@/types/auth';
import type { BaseResponse } from '@/types';

import {
  REQUEST_TIMEOUT_ERROR_MESSAGE,
  fetchWithTimeout,
  parseJsonSafely,
  getDefaultMessageByStatus,
  getLoginWarningType,
  getReissueWarningType,
  getSignUpWarningType,
  getFindIdWarningType,
} from '@/utils/error';

interface CheckIdErrorBody {
  code?: string;
}

const buildAuthUrl = (endpoint: string): string => `${getEnvConfig().apiBaseUrl ?? ''}${endpoint}`;

export const checkDuplicateUserId = async (userId: string): Promise<boolean> => {
  const trimmedUserId = userId.trim();
  const query = encodeURIComponent(trimmedUserId);

  const response = await fetch(`${buildAuthUrl('/api/v1/auth/check-id')}?usersId=${query}`, {
    method: 'GET',
  });

  if (response.status === 409) {
    return true;
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

export const postLogin = async (payload: LoginRequest): Promise<LoginResult> => {
  const requestUrl = buildAuthUrl('/api/v1/auth/login');
  const requestStart = Date.now();

  try {
    const response = await fetchWithTimeout(requestUrl, {
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
      console.error('[authService] login timeout', {
        url: requestUrl,
        elapsedMs: Date.now() - requestStart,
      });
      return {
        ok: false,
        warningType: 'NETWORK_ERROR',
        message: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
      };
    }

    const isNetworkError = error instanceof TypeError;
    console.error('[authService] login request failed', {
      url: requestUrl,
      elapsedMs: Date.now() - requestStart,
      errorName: error instanceof Error ? error.name : 'UNKNOWN',
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    return {
      ok: false,
      warningType: isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
    };
  }
};

export const postReissueToken = async (
  payload: ReissueTokenRequest,
): Promise<ReissueTokenResult> => {
  const requestUrl = buildAuthUrl('/api/v1/auth/reissue');

  try {
    const response = await fetchWithTimeout(requestUrl, {
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

export const deleteAccount = async (payload: WithdrawRequest): Promise<void> => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const response = await fetchWithTimeout(buildAuthUrl('/api/v1/auth/withdraw'), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('회원 탈퇴 실패');
    }
  } catch (error) {
    console.error('deleteAccount Error:', error);
    throw error;
  }
};

export const requestEmailVerification = async (email: string): Promise<EmailRequestData> => {
  const response = await fetch(buildAuthUrl('/api/v1/auth/email-request'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const body = await parseJsonSafely<BaseResponse<EmailRequestData>>(response);

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(body?.message || '이미 존재하는 이메일입니다.');
    }
    throw new Error(body?.message || '이메일 인증번호 발송 실패');
  }

  if (!body?.data) {
    throw new Error(body?.message || '이메일 인증번호 발송 실패');
  }

  return body.data;
};

export const verifyEmailCode = async (email: string, code: string): Promise<EmailVerifyData> => {
  const response = await fetch(buildAuthUrl('/api/v1/auth/email-verify'), {
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
};

export const postSignUp = async (payload: SignUpRequest): Promise<SignUpResult> => {
  const requestUrl = buildAuthUrl('/api/v1/auth/signup');

  try {
    const response = await fetchWithTimeout(requestUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await parseJsonSafely<SignUpResponse>(response);

    if (!response.ok) {
      return {
        ok: false,
        warningType: getSignUpWarningType(response.status, json?.code ?? ''),
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
      message: isNetworkError ? '네트워크 연결을 확인해주세요.' : '알 수 없는 에러가 발생했습니다.',
    };
  }
};

export const postFindId = async (payload: FindIdRequest): Promise<FindIdResult> => {
  const requestUrl = buildAuthUrl('/api/v1/auth/find-id');

  try {
    const response = await fetchWithTimeout(requestUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = await parseJsonSafely<FindIdResponse>(response);

    if (!response.ok) {
      return {
        ok: false,
        warningType: getFindIdWarningType(response.status, json?.code ?? ''),
        message: json?.message ?? getDefaultMessageByStatus(response.status),
      };
    }

    if (!json?.success || !json.data?.usersId) {
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
