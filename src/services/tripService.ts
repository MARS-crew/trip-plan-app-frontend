import type { BaseResponse } from '@/types';
import { getEnvConfig } from '@/config/env';

export type TripStatus = 'ONGOING' | 'UPCOMING' | 'PLANNED' | 'COMPLETED' | 'PAST';
export type TripFilterStatus = 'ALL' | 'UPCOMING' | 'PAST';

export interface MyTripItem {
  tripId: number;
  title: string;
  imageUrl: string;
  tripStatus: TripStatus;
  tripStatusLabel: string;
  startDate: string;
  endDate: string;
  scheduleCount: number;
  tripDayCount: number;
}

interface GetMyTripsData {
  tripCount: number;
  trips: MyTripItem[];
}

export interface GetMyTripsResult {
  data: MyTripItem[];
  error: string | null;
}

interface GetMyTripsOptions {
  filterStatus?: TripFilterStatus;
  signal?: AbortSignal;
}

export const getMyTrips = async ({
  filterStatus = 'ALL',
  signal,
}: GetMyTripsOptions = {}): Promise<GetMyTripsResult> => {
  try {
    const { apiBaseUrl, tempToken } = getEnvConfig();

    if (!apiBaseUrl) {
      console.error('[tripService] errorCode=API_BASE_URL_MISSING');
      return { data: [], error: 'API_BASE_URL_MISSING' };
    }
    if (!tempToken) {
      console.error('[tripService] errorCode=TEMP_TOKEN_MISSING');
      return { data: [], error: 'TEMP_TOKEN_MISSING' };
    }

    const headers: Record<string, string> = { Accept: '*/*' };
    const normalizedToken = tempToken;

    if (normalizedToken) {
      headers.Authorization = `Bearer ${normalizedToken}`;
    }
    if (!headers.Authorization) {
      console.error('[tripService] errorCode=TOKEN_INVALID_FORMAT');
      return { data: [], error: 'TOKEN_INVALID_FORMAT' };
    }

    const requestUrl =
      filterStatus === 'ALL'
        ? `${apiBaseUrl}/api/v1/trips/filter`
        : `${apiBaseUrl}/api/v1/trips/filter?tripStatus=${encodeURIComponent(filterStatus)}&status=${encodeURIComponent(filterStatus)}`;
    const response = await fetch(requestUrl, {
      headers,
      signal,
    });

    if (!response.ok) {
      try {
        const errorJson: { code?: string } = await response.json();
        const errorCode = errorJson.code ?? `HTTP_${response.status}`;
        console.error(`[tripService] errorCode=${errorCode}`);
        return { data: [], error: errorCode };
      } catch {
        const errorCode = `HTTP_${response.status}`;
        console.error(`[tripService] errorCode=${errorCode}`);
        return { data: [], error: errorCode };
      }
    }

    const json: BaseResponse<GetMyTripsData> = await response.json();
    return { data: json.data?.trips ?? [], error: null };
  } catch {
    if (signal?.aborted) {
      return { data: [], error: 'REQUEST_ABORTED' };
    }
    console.error('[tripService] errorCode=NETWORK_ERROR');
    return { data: [], error: 'NETWORK_ERROR' };
  }
};
