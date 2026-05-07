import Config from 'react-native-config';
import { getEnvConfig } from '@/config/env';

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

interface CheckIdErrorBody {
  code?: string;
}

const AUTH_LOGIN_ENDPOINT = '/api/v1/auth/login';
const AUTH_REISSUE_ENDPOINT = '/api/v1/auth/reissue';
const AUTH_REQUEST_TIMEOUT_MS = 30000;
const REQUEST_TIMEOUT_ERROR_MESSAGE = 'REQUEST_TIMEOUT';

const buildAuthUrl = (endpoint: string): string => `${getEnvConfig().apiBaseUrl ?? ''}${endpoint}`;

const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs: number = AUTH_REQUEST_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(REQUEST_TIMEOUT_ERROR_MESSAGE);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseJsonSafely = async <T>(response: Response): Promise<T | null> => {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    return null;
  }
};

const getDefaultMessageByStatus = (status: number): string => {
  if (status >= 500) {
    return '서버 오류가 발생했습니다.';
  }

  if (status >= 400) {
    return '요청 처리 중 오류가 발생했습니다.';
  }

  return '응답을 처리할 수 없습니다.';
};

const getLoginWarningType = (status: number, code: string): LoginWarningType => {
  if (code === 'INVALID_INPUT') {
    return 'INVALID_INPUT';
  }

  if (code === 'PASSWORD_MISMATCH') {
    return 'PASSWORD_MISMATCH';
  }

  if (code === 'USER_NOT_FOUND' || status === 404) {
    return 'USER_NOT_FOUND';
  }

  if (code === 'INTERNAL_ERROR' || status >= 500) {
    return 'SERVER_ERROR';
  }

  if (status === 400) {
    return 'INVALID_INPUT';
  }

  return 'UNKNOWN_ERROR';
};

const getReissueWarningType = (status: number, code: string): ReissueTokenWarningType => {
  if (code === 'INVALID_TOKEN' || status === 400) {
    return 'INVALID_TOKEN';
  }

  if (code === 'EXPIRED_REFRESH_TOKEN' || status === 401) {
    return 'EXPIRED_REFRESH_TOKEN';
  }

  if (code === 'USER_NOT_FOUND' || status === 404) {
    return 'USER_NOT_FOUND';
  }

  if (code === 'INTERNAL_ERROR' || status >= 500) {
    return 'SERVER_ERROR';
  }

  return 'UNKNOWN_ERROR';
};

// true: 중복 아이디, false: 사용 가능 아이디
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
  const requestUrl = buildAuthUrl(AUTH_LOGIN_ENDPOINT);
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
  const requestUrl = buildAuthUrl(AUTH_REISSUE_ENDPOINT);

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

export const requestEmailVerification = async (email: string): Promise<EmailRequestData> => {
  try {
    const response = await fetch(buildAuthUrl('/api/v1/auth/email-request'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.TEMP_TOKEN}`,
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error('이메일 인증번호 발송 실패');
    }
    const json: BaseResponse<EmailRequestData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('requestEmailVerification Error:', error);
    throw error;
  }
};

export const verifyEmailCode = async (email: string, code: string): Promise<EmailVerifyData> => {
  try {
    const response = await fetch(buildAuthUrl('/api/v1/auth/email-verify'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Config.TEMP_TOKEN}`,
      },
      body: JSON.stringify({ email, code }),
    });
    if (!response.ok) {
      throw new Error('이메일 인증번호 확인 실패');
    }
    const json: BaseResponse<EmailVerifyData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('verifyEmailCode Error:', error);
    throw error;
  }
};
