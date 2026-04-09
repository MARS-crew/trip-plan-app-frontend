import Config from 'react-native-config';

import type { BaseResponse } from '@/types';
import type { GetRecentSearch, GetRecentSearchData } from '@/types/search';

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
