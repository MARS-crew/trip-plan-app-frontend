import { useAuthStore } from '@/store';
import { imageUploadUrl, ReviewData, ReviewWriteBody } from '@/types/review';
import Config from 'react-native-config';

type ImageDomain = 'TRIP' | 'REVIEW';

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

export const postReviewWrite = async (body: ReviewWriteBody) => {
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.status === 404) {
      throw new Error('장소를 찾을수 없습니다.');
    }
    if (!response.ok) {
      throw new Error('리뷰 등록 실패');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getUpLoadImageUrl = async (
  fileName: string,
  domain: ImageDomain, // ← domain 파라미터 추가
): Promise<imageUploadUrl> => {
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await fetch(
      `${Config.API_BASE_URL}/api/v1/image/${domain}/upload-url?fileName=${fileName}`, // ← 수정
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (response.status === 404) throw new Error('업로드 경로를 찾을 수 없습니다.');
    if (!response.ok) throw new Error('이미지 URL 발급 실패');

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const uploadToMinio = async (
  uploadUrl: string,
  file: { uri: string; type?: string },
): Promise<void> => {
  const res = await fetch(file.uri);
  const blob = await res.blob();

  const result = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type ?? 'image/jpeg' },
    body: blob,
  });

  if (!result.ok) throw new Error('MinIO 업로드 실패');
};
