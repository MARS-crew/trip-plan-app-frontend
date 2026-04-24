import type { BaseResponse } from '@/types';
import { getEnvConfig } from '@/config/env';
import { useAuthStore } from '@/store';
import type {
  GetMyTripsData,
  GetMyTripsOptions,
  GetMyTripsResult,
  TripRequestConfig,
  TripRequestConfigError,
  GetTripSchedulesByDateOptions,
  GetTripSchedulesByDateResult,
  TripSchedulesByDateData,
} from '@/types/trip';
import type {
  DeleteTripOptions,
  DeleteTripResult,
  GetTripSchedulesOptions,
  GetTripSchedulesResult,
} from '@/types/tripDetail.types';

const logErrorCode = (errorCode: string): void => {
  console.error(`[tripService] errorCode=${errorCode}`);
};

const getResolvedToken = (): string | undefined => {
  const storeToken = useAuthStore.getState().accessToken?.trim();
  if (storeToken) {
    return storeToken;
  }
  return undefined;
};

const getTripRequestConfig = (): TripRequestConfig | TripRequestConfigError => {
  const { apiBaseUrl } = getEnvConfig();
  const resolvedToken = getResolvedToken();

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

export const getMyTrips = async ({
  filterStatus = 'ALL',
  signal,
}: GetMyTripsOptions = {}): Promise<GetMyTripsResult> => {
  const requestConfig = getTripRequestConfig();
  if ('error' in requestConfig) {
    return { data: [], error: requestConfig.error };
  }

  try {
    const requestUrl =
      filterStatus === 'ALL'
        ? `${requestConfig.apiBaseUrl}/api/v1/trips/filter`
        : `${requestConfig.apiBaseUrl}/api/v1/trips/filter?tripStatus=${encodeURIComponent(filterStatus)}`;
    const response = await fetch(requestUrl, {
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const errorCode = await getResponseErrorCode(response);
      logErrorCode(errorCode);
      return { data: [], error: errorCode };
    }

    const json: BaseResponse<GetMyTripsData> = await response.json();
    return { data: json.data?.trips ?? [], error: null };
  } catch {
    const errorCode = getRequestErrorCode(signal);
    return { data: [], error: errorCode };
  }
};

export const getTripSchedulesByDate = async ({
  tripId,
  targetDate,
  signal,
}: GetTripSchedulesByDateOptions): Promise<GetTripSchedulesByDateResult> => {
  const requestConfig = getTripRequestConfig();
  if ('error' in requestConfig) {
    return { data: null, error: requestConfig.error };
  }

  try {
    const requestUrl = `${requestConfig.apiBaseUrl}/api/v1/trips/${tripId}/schedules/by-date?targetDate=${encodeURIComponent(targetDate)}`;
    const response = await fetch(requestUrl, {
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const errorCode = await getResponseErrorCode(response);
      logErrorCode(errorCode);
      return { data: null, error: errorCode };
    }

    const json: BaseResponse<TripSchedulesByDateData> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    const errorCode = getRequestErrorCode(signal);
    return { data: null, error: errorCode };
  }
};

export const getTripSchedules = async ({
  tripId,
  signal,
}: GetTripSchedulesOptions): Promise<GetTripSchedulesResult> => {
  const requestConfig = getTripRequestConfig();
  if ('error' in requestConfig) {
    return { data: null, error: requestConfig.error };
  }

  try {
    const requestUrl = `${requestConfig.apiBaseUrl}/api/v1/trips/${tripId}/schedules`;
    const response = await fetch(requestUrl, {
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const errorCode = await getResponseErrorCode(response);
      logErrorCode(errorCode);
      return { data: null, error: errorCode };
    }

    if (response.status === 204) {
      return { data: null, error: null };
    }

    const json: BaseResponse<unknown> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    const errorCode = getRequestErrorCode(signal);
    return { data: null, error: errorCode };
  }
};

export const deleteTrip = async ({
  tripId,
  signal,
}: DeleteTripOptions): Promise<DeleteTripResult> => {
  const requestConfig = getTripRequestConfig();
  if ('error' in requestConfig) {
    return { data: null, error: requestConfig.error };
  }

  try {
    const requestUrl = `${requestConfig.apiBaseUrl}/api/v1/trips/${tripId}`;
    const response = await fetch(requestUrl, {
      method: 'DELETE',
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const errorCode = await getResponseErrorCode(response);
      logErrorCode(errorCode);
      return { data: null, error: errorCode };
    }

    const json: BaseResponse<unknown> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    const errorCode = getRequestErrorCode(signal);
    return { data: null, error: errorCode };
  }
};
