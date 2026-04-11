import Config from 'react-native-config';

import type { BaseResponse } from '@/types';
import type { GetRecentSearch, GetRecentSearchData } from '@/types/search';
import type { PlaceSelectionResponse } from '@/types/wishlist';

export const deleteRecentSearch = async (recentSearchId: number): Promise<void> => {
  const response = await fetch(
    `${Config.API_BASE_URL}/api/v1/search/recent-searches/${recentSearchId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${Config.TEMP_TOKEN}` },
    },
  );
  if (!response.ok) {
    throw new Error('최근 검색어 삭제 실패');
  }
};

export const getRecentSearches = async (): Promise<GetRecentSearch[]> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/search/recent-searches`, {
      headers: { Authorization: `Bearer ${Config.TEMP_TOKEN}` },
    });
    if (!response.ok) {
      throw new Error('최근 검색어 조회 실패');
    }
    const json: BaseResponse<GetRecentSearchData> = await response.json();
    return json.data?.recentSearches ?? [];
  } catch (error) {
    console.error('getRecentSearches Error:', error);
    throw error;
  }
};

export const getPlaceSelection = async (tripId: number): Promise<PlaceSelectionResponse> => {
  try {
    const response = await fetch(
      `${Config.API_BASE_URL}/api/v1/trips/${tripId}/place-selection`,
      {
        headers: { Authorization: `Bearer ${Config.TEMP_TOKEN}` },
      },
    );

    if (!response.ok) {
      let detailMessage = '';

      try {
        const errorJson = await response.json();
        detailMessage = errorJson?.message ?? '';
      } catch {
        // ignore json parse error and use status text
      }

      const reason = detailMessage || response.statusText || '알 수 없는 오류';
      throw new Error(`장소 선택 데이터 조회 실패 (${response.status}): ${reason}`);
    }

    const json: PlaceSelectionResponse = await response.json();
    return json;
  } catch (error) {
    console.error('getPlaceSelection Error:', error);
    throw error;
  }
};
