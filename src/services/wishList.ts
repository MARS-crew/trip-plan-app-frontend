import Config from 'react-native-config';

import { useAuthStore } from '@/store';
import type { BaseResponse } from '@/types';
import { authorizedFetch } from '@/utils/authorizedFetch';

interface AddWishlistPlacePayload {
  placeId: number;
  sourceType?: 'RECOMMEND' | 'SEARCH' | 'SAVED' | string;
  scheduleDate?: string;
  dayNo?: number;
}

interface AddWishlistPlaceData {
  wishlistPlaceId?: number;
  tripId?: number;
  placeId?: number;
  placeName?: string;
  scheduleDate?: string;
  dayNo?: number;
  sourceType?: 'RECOMMEND' | 'SEARCH' | 'SAVED' | string;
  added: boolean;
}

interface WishlistRecommendationPlace {
  placeId: number;
  googlePlaceId?: string;
  name: string;
  countryName?: string;
  cityName?: string;
  address?: string;
  description?: string;
  imageUrl?: string;
  placeType?: string;
  ratingAvg?: number;
  reviewCount?: number;
  tags?: string[];
}

interface WishlistRecommendationsData {
  tripId: number;
  tripTitle: string;
  recommendedPlaceCount: number;
  recommendedPlaceEmpty: boolean;
  recommendedPlaceEmptyMessage: string;
  recommendedPlaces: WishlistRecommendationPlace[];
}

interface GetWishlistRecommendationsParams {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
}

const getAccessToken = (): string => {
  return useAuthStore.getState().accessToken ?? '';
};

export const addWishlistPlace = async (
  tripId: number,
  payload: AddWishlistPlacePayload,
): Promise<AddWishlistPlaceData> => {
  try {
    const response = await authorizedFetch(
      `${Config.API_BASE_URL}/api/v1/trips/${tripId}/wishlist-places`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      let detailMessage = '';
      let errorData: Partial<AddWishlistPlaceData> | undefined;

      try {
        const errorJson: { message?: string; data?: Partial<AddWishlistPlaceData> } =
          await response.json();
        detailMessage = errorJson?.message?.trim() ?? '';
        errorData = errorJson?.data;
      } catch {
        // ignore
      }

      if (response.status === 409 && detailMessage.includes('이미 위시리스트에 추가한 장소')) {
        return {
          ...errorData,
          tripId: errorData?.tripId ?? tripId,
          placeId: errorData?.placeId ?? payload.placeId,
          sourceType: errorData?.sourceType ?? payload.sourceType,
          added: true,
        };
      }

      const reason = detailMessage || response.statusText || '알 수 없는 오류';
      throw new Error(`위시리스트 장소 추가 실패 (${response.status}): ${reason}`);
    }

    const json: BaseResponse<AddWishlistPlaceData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('addWishlistPlace Error:', error);
    throw error;
  }
};

export const deleteWishlistPlace = async (
  tripId: number,
  wishlistPlaceId: number,
): Promise<void> => {
  try {
    const response = await authorizedFetch(
      `${Config.API_BASE_URL}/api/v1/trips/${tripId}/wishlist-places/${wishlistPlaceId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${getAccessToken()}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`위시리스트 장소 삭제 실패 (${response.status})`);
    }
  } catch (error) {
    console.error('deleteWishlistPlace Error:', error);
    throw error;
  }
};

export const getWishlistRecommendations = async (
  tripId: number,
  params: GetWishlistRecommendationsParams,
): Promise<WishlistRecommendationsData> => {
  try {
    const queryParams: Array<[string, string]> = [
      ['latitude', String(params.latitude)],
      ['longitude', String(params.longitude)],
    ];

    if (params.radiusMeters != null) {
      queryParams.push(['radiusMeters', String(params.radiusMeters)]);
    }

    if (params.limit != null) {
      queryParams.push(['limit', String(params.limit)]);
    }

    const query = queryParams
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await authorizedFetch(
      `${Config.API_BASE_URL}/api/v1/trips/${tripId}/wishlist-places/recommendations?${query}`,
      {
        method: 'GET',
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${getAccessToken()}`,
        },
      },
    );

    if (!response.ok) {
      let detailMessage = '';

      try {
        const errorJson: { message?: string } = await response.json();
        detailMessage = errorJson?.message?.trim() ?? '';
      } catch {
        // ignore
      }

      const reason = detailMessage || response.statusText || '알 수 없는 오류';
      throw new Error(`실시간 추천 장소 조회 실패 (${response.status}): ${reason}`);
    }

    const json: BaseResponse<WishlistRecommendationsData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getWishlistRecommendations Error:', error);
    throw error;
  }
};

export type {
  AddWishlistPlacePayload,
  AddWishlistPlaceData,
  GetWishlistRecommendationsParams,
  WishlistRecommendationPlace,
  WishlistRecommendationsData,
};
