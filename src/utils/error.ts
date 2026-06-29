import type {
  LoginFailureResult,
  FindIdWarningType,
  FindPasswordResetWarningType,
  GoogleLoginFailureResult,
  GoogleLoginWarningType,
  LoginWarningType,
  NaverLoginFailureResult,
  NaverLoginWarningType,
  ReissueTokenWarningType,
  SignUpWarningType,
} from '@/types/auth';
import type { IdCheckStatus } from '@/types/signup';

export const AUTH_REQUEST_TIMEOUT_MS = 10000;
export const REQUEST_TIMEOUT_ERROR_MESSAGE = 'REQUEST_TIMEOUT';

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeoutMs = AUTH_REQUEST_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError')
      throw new Error(REQUEST_TIMEOUT_ERROR_MESSAGE);
    throw e;
  } finally {
    clearTimeout(id);
  }
};

export const parseJsonSafely = async <T>(res: Response): Promise<T | null> => {
  try {
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
};

export const getDefaultMessageByStatus = (status: number) =>
  status >= 500
    ? '서버 오류가 발생했습니다.'
    : status >= 400
      ? '요청 처리 중 오류가 발생했습니다.'
      : '응답을 처리할 수 없습니다.';

export const getLoginWarningType = (status: number, code = ''): LoginWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'PASSWORD_MISMATCH') return 'PASSWORD_MISMATCH';
  if (code === 'INVALID_INPUT' || status === 400) return 'INVALID_INPUT';
  if (code === 'USER_NOT_FOUND' || status === 404) return 'USER_NOT_FOUND';
  return 'UNKNOWN_ERROR';
};

export const getReissueWarningType = (status: number, code = ''): ReissueTokenWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'EXPIRED_REFRESH_TOKEN' || status === 401) return 'EXPIRED_REFRESH_TOKEN';
  if (code === 'INVALID_TOKEN' || status === 400) return 'INVALID_TOKEN';
  if (code === 'USER_NOT_FOUND' || status === 404) return 'USER_NOT_FOUND';
  return 'UNKNOWN_ERROR';
};

export const getFindIdWarningType = (status: number, code = ''): FindIdWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'INVALID_INPUT' || status === 400) return 'INVALID_INPUT';
  if (code === 'USER_NOT_FOUND' || status === 404) return 'USER_NOT_FOUND';
  return 'UNKNOWN_ERROR';
};

export const getFindPasswordResetWarningType = (
  status: number,
  code = '',
): FindPasswordResetWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'EMAIL_SEND_FAIL') return 'EMAIL_SEND_FAIL';
  if (code === 'INVALID_INPUT' || status === 400) return 'INVALID_INPUT';
  if (code === 'USER_NOT_FOUND' || status === 404) return 'USER_NOT_FOUND';
  return 'UNKNOWN_ERROR';
};

export const getSignUpWarningType = (status: number, code = ''): SignUpWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'DUPLICATE_USER' || status === 409) return 'DUPLICATE_USER';
  if (code === 'INVALID_INPUT' || status === 400) return 'INVALID_INPUT';
  return 'UNKNOWN_ERROR';
};

export const getNaverLoginWarningType = (status: number, code = ''): NaverLoginWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'EXPIRED_REFRESH_TOKEN' || status === 401) return 'EXPIRED_REFRESH_TOKEN';
  if (code === 'INVALID_TOKEN' || status === 400) return 'INVALID_TOKEN';
  if (code === 'USER_NOT_FOUND' || status === 404) return 'USER_NOT_FOUND';
  return 'UNKNOWN_ERROR';
};

export const getGoogleLoginWarningType = (status: number, code = ''): GoogleLoginWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'EXPIRED_REFRESH_TOKEN' || status === 401) return 'EXPIRED_REFRESH_TOKEN';
  if (code === 'INVALID_TOKEN' || status === 400) return 'INVALID_TOKEN';
  if (code === 'USER_NOT_FOUND' || status === 404) return 'USER_NOT_FOUND';
  return 'UNKNOWN_ERROR';
};

export const getGoogleLoginWarningMessage = (failure: GoogleLoginFailureResult): string => {
  const serverMessage = failure.message?.trim();

  if (serverMessage) {
    return serverMessage;
  }

  if (failure.warningType === 'INVALID_TOKEN') {
    return '유효하지 않은 구글 토큰입니다.';
  }

  if (failure.warningType === 'EXPIRED_REFRESH_TOKEN') {
    return '구글 인증이 만료되었습니다. 다시 시도해주세요.';
  }

  if (failure.warningType === 'USER_NOT_FOUND') {
    return '구글 계정을 찾을 수 없습니다.';
  }

  if (failure.warningType === 'SERVER_ERROR') {
    return '서버가 불안정합니다. 잠시 후 다시 시도해주세요.';
  }

  if (failure.warningType === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }

  return '구글 로그인에 실패했습니다. 다시 시도해주세요.';
};

export const getLoginWarningMessage = (failure: LoginFailureResult): string => {
  if (failure.warningType === 'USER_NOT_FOUND' || failure.warningType === 'PASSWORD_MISMATCH') {
    return '아이디 및 비밀번호를 확인해 주세요.';
  }

  const serverMessage = failure.message?.trim();

  if (serverMessage) {
    return serverMessage;
  }

  if (failure.warningType === 'EMPTY_FIELDS') {
    return '아이디와 비밀번호를 입력해주세요.';
  }

  if (failure.warningType === 'INVALID_INPUT') {
    return '잘못된 요청입니다.';
  }

  if (failure.warningType === 'SERVER_ERROR') {
    return '서버가 불안정합니다. 잠시 후 다시 시도해주세요.';
  }

  if (failure.warningType === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }

  return '로그인에 실패했습니다. 다시 시도해주세요.';
};

export const getNaverLoginWarningMessage = (failure: NaverLoginFailureResult): string => {
  const serverMessage = failure.message?.trim();

  if (serverMessage) {
    return serverMessage;
  }

  if (failure.warningType === 'INVALID_TOKEN') {
    return '유효하지 않은 네이버 토큰입니다.';
  }

  if (failure.warningType === 'EXPIRED_REFRESH_TOKEN') {
    return '네이버 인증이 만료되었습니다. 다시 시도해주세요.';
  }

  if (failure.warningType === 'USER_NOT_FOUND') {
    return '네이버 계정을 찾을 수 없습니다.';
  }

  if (failure.warningType === 'SERVER_ERROR') {
    return '서버가 불안정합니다. 잠시 후 다시 시도해주세요.';
  }

  if (failure.warningType === 'NETWORK_ERROR') {
    return '네트워크 연결을 확인해주세요.';
  }

  return '네이버 로그인에 실패했습니다. 다시 시도해주세요.';
};

export const getSignUpIdCheckMessage = (idCheckStatus: IdCheckStatus) => {
  if (idCheckStatus === 'available') {
    return {
      idMessage: '사용 가능한 아이디입니다.',
      idMessageClass: 'text-statusSuccess',
      idInputClass: 'bg-emailBackground',
    };
  }

  if (idCheckStatus === 'duplicate') {
    return {
      idMessage: '중복된 아이디입니다.',
      idMessageClass: 'text-statusError',
      idInputClass: '',
    };
  }

  if (idCheckStatus === 'error') {
    return {
      idMessage: '아이디 중복 확인 중 오류가 발생했습니다. 다시 시도해주세요.',
      idMessageClass: 'text-statusError',
      idInputClass: '',
    };
  }

  return {
    idMessage: '',
    idMessageClass: 'text-transparent',
    idInputClass: '',
  };
};
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return '알 수 없는 에러가 발생했습니다.';
};
