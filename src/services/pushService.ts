import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import Config from 'react-native-config';

import { useAuthStore } from '@/store';

const DEFAULT_ANDROID_CHANNEL_ID = 'default';

const accessToken = (): string => {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    throw new Error('로그인이 필요합니다.');
  }
  return token;
};

export const requestPushPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

export const registerFcmToken = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`${Config.API_BASE_URL}/api/v1/notifications/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error('FCM 토큰 저장 실패');
    }
  } catch (error) {
    throw error;
  }
};

// 권한 요청 → FCM 토큰 발급 → 서버 저장까지 한 번에 수행한다. 로그인 상태가 된 직후 호출한다.
export const setupPushNotifications = async (): Promise<void> => {
  const granted = await requestPushPermission();
  if (!granted) {
    return;
  }

  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: DEFAULT_ANDROID_CHANNEL_ID,
      name: '기본 알림',
      importance: AndroidImportance.HIGH,
    });
  }

  const token = await messaging().getToken();
  await registerFcmToken(token);
};

export const listenForFcmTokenRefresh = (): (() => void) =>
  messaging().onTokenRefresh((token) => {
    registerFcmToken(token).catch((e) => {
      console.warn('registerFcmToken (refresh) failed:', e);
    });
  });

export const listenForForegroundMessages = (): (() => void) =>
  messaging().onMessage(async (remoteMessage) => {
    if (!remoteMessage.notification) {
      return;
    }

    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId: DEFAULT_ANDROID_CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
      },
    });
  });
