import Config from 'react-native-config';
import { NativeModules } from 'react-native';

import type { BaseResponse } from '@/types';

export type TripStatus = 'ONGOING' | 'UPCOMING' | 'COMPLETED';

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

interface ConfigShape {
  API_BASE_URL?: string;
  TEMP_TOKEN?: string;
}

const pickNonEmptyString = (values: Array<string | undefined>): string =>
  values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';

export const getMyTrips = async (): Promise<MyTripItem[]> => {
  try {
    const nativeModuleConfig: ConfigShape =
      NativeModules?.RNCConfigModule?.getConfig?.()?.config ??
      NativeModules?.RNCConfigModule?.getConstants?.()?.config ??
      {};
    const nestedConfig: ConfigShape = (Config as { config?: ConfigShape }).config ?? {};
    const directConfig: ConfigShape = (Config as unknown as ConfigShape) ?? {};

    const apiBaseUrl = pickNonEmptyString([
      directConfig.API_BASE_URL,
      nestedConfig.API_BASE_URL,
      nativeModuleConfig.API_BASE_URL,
    ]);
    const rawToken = pickNonEmptyString([
      directConfig.TEMP_TOKEN,
      nestedConfig.TEMP_TOKEN,
      nativeModuleConfig.TEMP_TOKEN,
    ]);

    if (!apiBaseUrl) {
      console.error('[tripService] errorCode=API_BASE_URL_MISSING');
      return [];
    }
    if (!rawToken) {
      console.error('[tripService] errorCode=TEMP_TOKEN_MISSING');
      return [];
    }

    const headers: Record<string, string> = { Accept: '*/*' };
    const normalizedToken = rawToken
      .replace(/^Bearer\s+/i, '')
      .trim()
      .replace(/^['"]|['"]$/g, '')
      .replace(/[\u200B-\u200D\uFEFF\s]/g, '');

    if (normalizedToken) {
      headers.Authorization = `Bearer ${normalizedToken}`;
    }
    if (!headers.Authorization) {
      console.error('[tripService] errorCode=TOKEN_INVALID_FORMAT');
      return [];
    }

    const requestUrl = `${apiBaseUrl}/api/v1/trips`;
    const response = await fetch(requestUrl, {
      headers,
    });

    if (!response.ok) {
      try {
        const errorJson: { code?: string } = await response.json();
        console.error(
          `[tripService] errorCode=${errorJson.code ?? `HTTP_${response.status}`}`,
        );
      } catch {
        console.error(`[tripService] errorCode=HTTP_${response.status}`);
      }
      return [];
    }

    const json: BaseResponse<GetMyTripsData> = await response.json();
    return json.data?.trips ?? [];
  } catch {
    console.error('[tripService] errorCode=NETWORK_ERROR');
    return [];
  }
};
