import type { BaseResponse } from '@/types';
import { getEnvConfig } from '@/config/env';
import { useAuthStore } from '@/store/authStore';
import type {
  GetNearbyRecommendedPlacesData,
  GetNearbyRecommendedPlacesOptions,
  GetNearbyRecommendedPlacesResult,
  GetPlaceDetailOptions,
  GetPlaceDetailResult,
  GetPlaceShareOptions,
  GetPlaceShareResult,
  GetRecommendedPlacesData,
  GetRecommendedPlacesOptions,
  GetRecommendedPlacesResult,
  PlaceDetail,
  PlaceShareData,
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
  const { apiBaseUrl } = getEnvConfig();
  const accessToken = useAuthStore.getState().accessToken;
  const resolvedToken = accessToken ?? undefined;

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

const performPlaceRequest = async <TResponse, TSelected>({
  requestUrl,
  signal,
  selector,
}: {
  requestUrl: string;
  signal?: AbortSignal;
  selector: (data: TResponse | undefined) => TSelected | null;
}): Promise<{ data: TSelected | null; error: string | null }> => {
  const requestConfig = getPlaceRequestConfig();
  if ('error' in requestConfig) {
    return { data: null, error: requestConfig.error };
  }

  try {
    const response = await fetch(requestUrl, {
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const errorCode = await getResponseErrorCode(response);
      logErrorCode(errorCode);
      return { data: null, error: errorCode };
    }

    const json: BaseResponse<TResponse> = await response.json();
    return { data: selector(json.data), error: null };
  } catch {
    const errorCode = getRequestErrorCode(signal);
    return { data: null, error: errorCode };
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

  const requestUrl = `${apiBaseUrl}/api/v1/places/recommended?requestDto.limit=${encodeURIComponent(String(limit))}`;
  const result = await performPlaceRequest<
    GetRecommendedPlacesData,
    GetRecommendedPlacesResult['data']
  >({
    requestUrl,
    signal,
    selector: (data) => data?.recommendedPlaces ?? null,
  });

  return { data: result.data ?? [], error: result.error };
};

export const getPlaceDetail = async ({
  placeId,
  signal,
}: GetPlaceDetailOptions): Promise<GetPlaceDetailResult> => {
  const { apiBaseUrl } = getEnvConfig();
  if (!apiBaseUrl) {
    const error = 'API_BASE_URL_MISSING';
    logErrorCode(error);
    return { data: null, error };
  }

  const result = await performPlaceRequest<PlaceDetail, PlaceDetail>({
    requestUrl: `${apiBaseUrl}/api/v1/places/${placeId}`,
    signal,
    selector: (data) => data ?? null,
  });

  return { data: result.data, error: result.error };
};

export const getPlaceShare = async ({
  placeId,
  signal,
}: GetPlaceShareOptions): Promise<GetPlaceShareResult> => {
  const { apiBaseUrl } = getEnvConfig();
  if (!apiBaseUrl) {
    const error = 'API_BASE_URL_MISSING';
    logErrorCode(error);
    return { data: null, error };
  }

  const result = await performPlaceRequest<PlaceShareData, PlaceShareData>({
    requestUrl: `${apiBaseUrl}/api/v1/places/${placeId}/share`,
    signal,
    selector: (data) => data ?? null,
  });

  return { data: result.data, error: result.error };
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
  const result = await performPlaceRequest<
    GetNearbyRecommendedPlacesData,
    GetNearbyRecommendedPlacesResult['data']
  >({
    requestUrl,
    signal,
    selector: (data) => data?.nearbyRecommendedPlaces ?? null,
  });

  return { data: result.data ?? [], error: result.error };
};
