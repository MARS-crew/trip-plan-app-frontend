import Config from 'react-native-config';

import type {
  LoginRequest,
  LoginResponse,
  LoginResult,
  LoginWarningType,
  ReissueTokenRequest,
  ReissueTokenResponse,
  ReissueTokenResult,
  ReissueTokenWarningType,
} from '@/types/auth';

const AUTH_LOGIN_ENDPOINT = '/api/v1/auth/login';
const AUTH_REISSUE_ENDPOINT = '/api/v1/auth/reissue';

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

export const postLogin = async (payload: LoginRequest): Promise<LoginResult> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}${AUTH_LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json: LoginResponse = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        warningType: getLoginWarningType(response.status, json.code),
        message: json.message,
      };
    }

    if (!json.success || !json.data) {
      return {
        ok: false,
        warningType: 'UNKNOWN_ERROR',
        message: json.message,
      };
    }

    return { ok: true, data: json.data };
  } catch (error) {
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
    const response = await fetch(`${Config.API_BASE_URL}${AUTH_REISSUE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json: ReissueTokenResponse = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        warningType: getReissueWarningType(response.status, json.code),
        message: json.message,
      };
    }

    if (!json.success || !json.data) {
      return {
        ok: false,
        warningType: 'UNKNOWN_ERROR',
        message: json.message,
      };
    }

    return { ok: true, data: json.data };
  } catch (error) {
    const isNetworkError = error instanceof TypeError;

    return {
      ok: false,
      warningType: isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR',
    };
  }
};
