import type { LoginWarningType, ReissueTokenWarningType, SignUpWarningType } from '@/types/auth';

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

export const getSignUpWarningType = (status: number, code = ''): SignUpWarningType => {
  if (status >= 500 || code === 'INTERNAL_ERROR') return 'SERVER_ERROR';
  if (code === 'DUPLICATE_USER' || status === 409) return 'DUPLICATE_USER';
  if (code === 'INVALID_INPUT' || status === 400) return 'INVALID_INPUT';
  return 'UNKNOWN_ERROR';
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
