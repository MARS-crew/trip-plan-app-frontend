import Config from 'react-native-config';
import type { BaseResponse } from '@/types';
import type {
  GetRecentSearch,
  GetRecentSearchData,
  GetPopularSearchData,
  SearchResult,
  SearchResultData,
} from '@/types/search';
import { useAuthStore } from '@/store';

export const deleteRecentSearch = async (recentSearchId: number): Promise<void> => {
  const { accessToken } = useAuthStore.getState();
  const response = await fetch(
    `${Config.API_BASE_URL}/api/v1/search/recent-searches/${recentSearchId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!response.ok) {
    throw new Error('최근 검색어 삭제 실패');
  }
};

export const getRecentSearches = async (): Promise<GetRecentSearch[]> => {
  const { accessToken } = useAuthStore.getState();
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/search/recent-searches`, {
      headers: { Authorization: `Bearer ${accessToken}` },
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

export const getPopularSearches = async (): Promise<string[]> => {
  const { accessToken } = useAuthStore.getState();
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/search/popular-searches`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) {
      throw new Error('인기 검색어 조회 실패');
    }
    const json: BaseResponse<GetPopularSearchData> = await response.json();
    return json.data?.popularSearches.map((item) => item.keyword) ?? [];
  } catch (error) {
    console.error('getPopularSearches Error:', error);
    throw error;
  }
};

export const getSearchResults = async (keyword: string): Promise<SearchResult[]> => {
  const { accessToken } = useAuthStore.getState();
  try {
    const response = await fetch(
      `${Config.API_BASE_URL}/api/v1/search/results?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    if (!response.ok) {
      throw new Error('검색 결과 조회 실패');
    }
    const json: BaseResponse<SearchResultData> = await response.json();
    return json.data?.searchResults ?? [];
  } catch (error) {
    console.error('getSearchResults Error:', error);
    throw error;
  }
};

export const deleteAllRecentSearch = async (): Promise<void> => {
  const { accessToken } = useAuthStore.getState();
  const response = await fetch(`${Config.API_BASE_URL}/api/v1/search/recent-searches`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error('최근 검색어 전체 삭제 실패');
  }
};
