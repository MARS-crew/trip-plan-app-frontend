import { useAuthStore } from '@/store';
import { imageUploadUrl, ReviewData, ReviewWriteBody } from '@/types/review';
import { authorizedFetch } from '@/utils/authorizedFetch';
import Config from 'react-native-config';

type ImageDomain = 'TRIP' | 'REVIEW';

export const getReviewList = async (placeId: number): Promise<ReviewData> => {
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await authorizedFetch(`${Config.API_BASE_URL}/api/v1/reviews/place/${placeId}`, {
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
    const response = await authorizedFetch(`${Config.API_BASE_URL}/api/v1/reviews`, {
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
    const response = await authorizedFetch(
      `${Config.API_BASE_URL}/api/v1/image/${domain}/upload-url?fileName=${encodeURIComponent(fileName)}`,
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
  // fetch(file.uri)로 로컬 file:// URI를 직접 읽으면 Android에서 "Network request failed"가 발생함.
  // { uri } 형태로 body를 넘기면 네이티브에서 파일을 스트리밍해서 전송해준다.
  const result = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type ?? 'image/jpeg' },
    body: { uri: file.uri } as unknown as BodyInit_,
  });

  if (!result.ok) throw new Error('MinIO 업로드 실패');
};
