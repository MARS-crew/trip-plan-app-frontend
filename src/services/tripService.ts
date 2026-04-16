import type { BaseResponse } from '@/types';
import { getEnvConfig } from '@/config/env';
import type { ServiceError } from '@/types/trip';
import type {
  GetMyTripsData,
  GetMyTripsOptions,
  GetMyTripsResult,
  GetTripSchedulesByDateOptions,
  GetTripSchedulesByDateResult,
  TripSchedulesByDateData,
} from '@/types/myTrip.types';
import type { TripRequestConfig, TripRequestConfigError } from '@/types/trip';
import type {
  GetTripSchedulesOptions,
  GetTripSchedulesResult,
  GetTripShareOptions,
  GetTripShareResult,
  TripShareData,
} from '@/types/tripDetail.types';

const logErrorCode = (errorCode: string): void => {
  console.error(`[tripService] errorCode=${errorCode}`);
};

const createServiceError = (code: string, message?: string): ServiceError => ({
  success: false,
  code,
  message: message?.trim() || code,
});

const getTripRequestConfig = (): TripRequestConfig | TripRequestConfigError => {
  const { apiBaseUrl, tempToken } = getEnvConfig();

  if (!apiBaseUrl) {
    const error = createServiceError('API_BASE_URL_MISSING', 'API_BASE_URL이 설정되지 않았습니다.');
    logErrorCode(error.code);
    return { error };
  }
  if (!tempToken) {
    const error = createServiceError('TEMP_TOKEN_MISSING', '인증 토큰이 없습니다.');
    logErrorCode(error.code);
    return { error };
  }

  return {
    apiBaseUrl,
    headers: {
      Accept: '*/*',
      Authorization: `Bearer ${tempToken}`,
    },
  };
};

const getResponseError = async (response: Response): Promise<ServiceError> => {
  try {
    const errorJson: { code?: string; message?: string; success?: boolean } = await response.json();
    return createServiceError(errorJson.code ?? `HTTP_${response.status}`, errorJson.message);
  } catch {
    return createServiceError(`HTTP_${response.status}`, '요청 처리 중 오류가 발생했습니다.');
  }
};

const getRequestError = (signal?: AbortSignal): ServiceError => {
  if (signal?.aborted) {
    return createServiceError('REQUEST_ABORTED', '요청이 취소되었습니다.');
  }
  logErrorCode('NETWORK_ERROR');
  return createServiceError('NETWORK_ERROR', '네트워크 오류가 발생했습니다.');
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
      const error = await getResponseError(response);
      logErrorCode(error.code);
      return { data: [], error };
    }

    const json: BaseResponse<GetMyTripsData> = await response.json();
    return { data: json.data?.trips ?? [], error: null };
  } catch {
    const error = getRequestError(signal);
    return { data: [], error };
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
      const error = await getResponseError(response);
      logErrorCode(error.code);
      return { data: null, error };
    }

    const json: BaseResponse<TripSchedulesByDateData> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    const error = getRequestError(signal);
    return { data: null, error };
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
      const error = await getResponseError(response);
      logErrorCode(error.code);
      return { data: null, error };
    }

    const json: BaseResponse<unknown> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    const error = getRequestError(signal);
    return { data: null, error };
  }
};

export const getTripShare = async ({
  tripId,
  signal,
}: GetTripShareOptions): Promise<GetTripShareResult> => {
  const requestConfig = getTripRequestConfig();
  if ('error' in requestConfig) {
    return { data: null, error: requestConfig.error };
  }

  try {
    const requestUrl = `${requestConfig.apiBaseUrl}/api/v1/trips/${tripId}/share`;
    const response = await fetch(requestUrl, {
      headers: requestConfig.headers,
      signal,
    });

    if (!response.ok) {
      const error = await getResponseError(response);
      logErrorCode(error.code);
      return { data: null, error };
    }

    const json: BaseResponse<TripShareData> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    const error = getRequestError(signal);
    return { data: null, error };
  }
};
