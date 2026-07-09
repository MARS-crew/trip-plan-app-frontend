import { resetToLogin } from '@/navigation/navigationRef';
import { postReissueToken } from '@/services/authService';
import { useAuthStore } from '@/store';
import { suppressUserFacingErrors } from '@/utils/errfeedback';

let reissuePromise: Promise<boolean> | null = null;

const reissueTokenOnce = (): Promise<boolean> => {
  if (reissuePromise) {
    return reissuePromise;
  }

  reissuePromise = (async () => {
    const refreshToken = useAuthStore.getState().refreshToken?.trim();

    if (!refreshToken) {
      return false;
    }

    const result = await postReissueToken({ refreshToken });

    if (!result.ok) {
      useAuthStore.getState().clearTokens();
      suppressUserFacingErrors();
      resetToLogin();
      return false;
    }

    useAuthStore.getState().setTokens(result.data.accessToken, result.data.refreshToken);
    return true;
  })();

  return reissuePromise.finally(() => {
    reissuePromise = null;
  });
};

const withAuthHeader = (headers?: HeadersInit_): HeadersInit_ => {
  const accessToken = useAuthStore.getState().accessToken?.trim();
  const merged = new Headers(headers);

  if (accessToken) {
    merged.set('Authorization', `Bearer ${accessToken}`);
  }

  return merged;
};

// fetch wrapper that transparently reissues the access token on a 401 and retries once.
export const authorizedFetch = async (url: string, init: RequestInit = {}): Promise<Response> => {
  const response = await fetch(url, { ...init, headers: withAuthHeader(init.headers) });

  if (response.status !== 401) {
    return response;
  }

  const reissued = await reissueTokenOnce();

  if (!reissued) {
    return response;
  }

  return fetch(url, { ...init, headers: withAuthHeader(init.headers) });
};
