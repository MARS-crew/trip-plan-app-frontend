import Config from 'react-native-config';

import { useAuthStore } from '@/store';
import type { BaseResponse } from '@/types';
import type {
  GetSavedPlaceCategoriesData,
  GetSavedPlacesData,
  SavedPlaceFilterType,
} from '@/types/savedPlace';

const getAccessToken = (): string => {
  return useAuthStore.getState().accessToken ?? '';
};

export const getSavedPlaces = async (
  filterType: SavedPlaceFilterType | string = 'ALL',
): Promise<GetSavedPlacesData> => {
  try {
    const query = encodeURIComponent(filterType);
    const response = await fetch(
      `${Config.API_BASE_URL}/api/v1/places/saved-places?filterType=${query}`,
      {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      },
    );
    if (!response.ok) {
      throw new Error('저장된 장소 조회 실패');
    }
    const json: BaseResponse<GetSavedPlacesData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getSavedPlaces Error:', error);
    throw error;
  }
};

export const getSavedPlaceCategories = async (): Promise<GetSavedPlaceCategoriesData> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/places/saved-places/categories`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    if (!response.ok) {
      throw new Error('저장된 장소 카테고리 조회 실패');
    }
    const json: BaseResponse<GetSavedPlaceCategoriesData> = await response.json();
    return json.data;
  } catch (error) {
    console.error('getSavedPlaceCategories Error:', error);
    throw error;
  }
};
