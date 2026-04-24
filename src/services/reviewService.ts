import { useAuthStore } from '@/store';
import { ReviewData } from '@/types/review';
import Config from 'react-native-config';

export const getReviewList = async (placeId: number): Promise<ReviewData> => {
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/reviews/place/${placeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 404) {
      throw new Error('장소를 찾을수 없습니다.');
    }
    if (!response.ok) {
      throw new Error('리뷰 조회 실패');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};
