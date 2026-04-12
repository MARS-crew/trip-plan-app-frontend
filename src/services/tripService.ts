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

export interface TripScheduleDateOption {
  dayNo: number;
  scheduleDate: string;
  displayLabel: string;
}

export interface TripScheduleItem {
  tripScheduleId: number;
  title: string;
  placeName: string;
  address: string;
  startTime: string;
  endTime: string;
  memo?: string;
}

export interface TripSchedulesByDateData {
  tripId: number;
  tripTitle: string;
  selectedDate: string;
  selectedDayNo: number;
  selectedDayLabel: string;
  scheduleCount: number;
  dateOptions: TripScheduleDateOption[];
  schedules: TripScheduleItem[];
}

export interface GetMyTripsResult {
  data: MyTripItem[];
  error: string | null;
}

export interface GetTripSchedulesByDateResult {
  data: TripSchedulesByDateData | null;
  error: string | null;
}

interface GetMyTripsOptions {
  filterStatus?: TripFilterStatus;
  signal?: AbortSignal;
}

interface GetTripSchedulesByDateOptions {
  tripId: number;
  targetDate: string;
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
    headers.Authorization = `Bearer ${tempToken}`;

    const requestUrl =
      filterStatus === 'ALL'
        ? `${apiBaseUrl}/api/v1/trips/filter`
        : `${apiBaseUrl}/api/v1/trips/filter?tripStatus=${encodeURIComponent(filterStatus)}`;
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

export const getTripSchedulesByDate = async ({
  tripId,
  targetDate,
  signal,
}: GetTripSchedulesByDateOptions): Promise<GetTripSchedulesByDateResult> => {
  try {
    const { apiBaseUrl, tempToken } = getEnvConfig();

    if (!apiBaseUrl) {
      console.error('[tripService] errorCode=API_BASE_URL_MISSING');
      return { data: null, error: 'API_BASE_URL_MISSING' };
    }
    if (!tempToken) {
      console.error('[tripService] errorCode=TEMP_TOKEN_MISSING');
      return { data: null, error: 'TEMP_TOKEN_MISSING' };
    }

    const requestUrl = `${apiBaseUrl}/api/v1/trips/${tripId}/schedules/by-date?targetDate=${encodeURIComponent(targetDate)}`;
    const response = await fetch(requestUrl, {
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${tempToken}`,
      },
      signal,
    });

    if (!response.ok) {
      try {
        const errorJson: { code?: string } = await response.json();
        const errorCode = errorJson.code ?? `HTTP_${response.status}`;
        console.error(`[tripService] errorCode=${errorCode}`);
        return { data: null, error: errorCode };
      } catch {
        const errorCode = `HTTP_${response.status}`;
        console.error(`[tripService] errorCode=${errorCode}`);
        return { data: null, error: errorCode };
      }
    }

    const json: BaseResponse<TripSchedulesByDateData> = await response.json();
    return { data: json.data ?? null, error: null };
  } catch {
    if (signal?.aborted) {
      return { data: null, error: 'REQUEST_ABORTED' };
    }
    console.error('[tripService] errorCode=NETWORK_ERROR');
    return { data: null, error: 'NETWORK_ERROR' };
  }
};
