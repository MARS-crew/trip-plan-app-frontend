import { useAuthStore } from '@/store';
import { AlertItemProps } from '@/types/alert';
import Config from 'react-native-config';

export const getAlerts = async (): Promise<AlertItemProps[]> => {
  const { accessToken } = useAuthStore.getState();

  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/notifications`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      throw new Error('권한 없음');
    }
    if (!response.ok) {
      throw new Error('알림 목록조회 실패');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadAlert = async (): Promise<boolean> => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    return false;
  }
  const response = await fetch(Config.API_BASE_URL + '/api/v1/notifications/unread', {
    headers: { Authorization: 'Bearer ' + accessToken },
  });
  if (response.status === 401) {
    throw new Error('권한 없음');
  }
  if (!response.ok) {
    throw new Error('안 읽은 알림 조회 실패');
  }
  const data = await response.json();
  return data.data?.unread === false;
};
