import type { BaseResponse } from '@/types';
import { getEnvConfig } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import type {
  GetNearbyRecommendedPlacesData,
  GetNearbyRecommendedPlacesOptions,
  GetNearbyRecommendedPlacesResult,
  GetRecommendedPlacesData,
  GetRecommendedPlacesOptions,
  GetRecommendedPlacesResult,
} from '@/types/place';

interface PlaceRequestConfig {
  apiBaseUrl: string;
  headers: Record<string, string>;
}

interface PlaceRequestConfigError {
  error: string;
}

const logErrorCode = (errorCode: string): void => {
  console.error(`[placeService] errorCode=${errorCode}`);
};

const getPlaceRequestConfig = (): PlaceRequestConfig | PlaceRequestConfigError => {
  const { apiBaseUrl, tempToken } = getEnvConfig();
  const accessToken = useAuthStore.getState().accessToken;
  const resolvedToken = tempToken ?? accessToken ?? undefined;

  if (!apiBaseUrl) {
    const error = 'API_BASE_URL_MISSING';
    logErrorCode(error);
    return { error };
  }

  if (!resolvedToken) {
    const error = 'AUTH_TOKEN_MISSING';
    logErrorCode(error);
    return { error };
  }

  return {
    apiBaseUrl,
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${resolvedToken}`,
    },
  };
};

const getResponseErrorCode = async (response: Response): Promise<string> => {
  try {
    const errorJson: { code?: string } = await response.json();
    return errorJson.code ?? `HTTP_${response.status}`;
  } catch {
    return `HTTP_${response.status}`;
  }
};

const getRequestErrorCode = (signal?: AbortSignal): string => {
  if (signal?.aborted) {
    return 'REQUEST_ABORTED';
  }

  logErrorCode('NETWORK_ERROR');
  return 'NETWORK_ERROR';
};

const performPlaceRequest = async <T>({
  requestUrl,
  signal,
  selector,
}: {
  requestUrl: string;
  signal?: AbortSignal;
  selector: (data: T | undefined) => unknown[] | undefined;
}): Promise<{ data: unknown[]; error: string | null }> => {
  const requestConfig = getPlaceRequestConfig();
  if ('error' in requestConfig) {
    return { data: [], error: requestConfig.error };
  }

  try {
    const response = await fetch(requestUrl, {
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const errorCode = await getResponseErrorCode(response);
      logErrorCode(errorCode);
      return { data: [], error: errorCode };
    }

    const json: BaseResponse<T> = await response.json();
    return { data: selector(json.data) ?? [], error: null };
  } catch {
    const errorCode = getRequestErrorCode(signal);
    return { data: [], error: errorCode };
  }
};

export const getRecommendedPlaces = async ({
  limit = 3,
  signal,
}: GetRecommendedPlacesOptions = {}): Promise<GetRecommendedPlacesResult> => {
  const { apiBaseUrl } = getEnvConfig();
  if (!apiBaseUrl) {
    const error = 'API_BASE_URL_MISSING';
    logErrorCode(error);
    return { data: [], error };
  }

  const requestUrl = `${apiBaseUrl}/api/v1/places/recommended?limit=${encodeURIComponent(String(limit))}`;
  const result = await performPlaceRequest<GetRecommendedPlacesData>({
    requestUrl,
    signal,
    selector: (data) => data?.recommendedPlaces,
  });

  return { data: result.data as GetRecommendedPlacesResult['data'], error: result.error };
};

export const getNearbyRecommendedPlaces = async ({
  placeId,
  signal,
}: GetNearbyRecommendedPlacesOptions): Promise<GetNearbyRecommendedPlacesResult> => {
  const { apiBaseUrl } = getEnvConfig();
  if (!apiBaseUrl) {
    const error = 'API_BASE_URL_MISSING';
    logErrorCode(error);
    return { data: [], error };
  }

  const requestUrl = `${apiBaseUrl}/api/v1/places/${placeId}/nearby-recommendations`;
  const result = await performPlaceRequest<GetNearbyRecommendedPlacesData>({
    requestUrl,
    signal,
    selector: (data) => data?.nearbyRecommendedPlaces,
  });

  return { data: result.data as GetNearbyRecommendedPlacesResult['data'], error: result.error };
};
