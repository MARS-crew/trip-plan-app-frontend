import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Android는 런타임 위치 권한을 요청하고, iOS는 Info.plist 설명 문구를 기반으로 인증을 요청한다.
export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  Geolocation.requestAuthorization();
  return true;
};

// 현재 위치 좌표를 조회한다. 권한이 없거나 조회에 실패하면 null을 반환한다.
export const getCurrentPosition = async (): Promise<Coordinates | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    return null;
  }

  return new Promise<Coordinates | null>((resolve) => {
    Geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => {
        console.error('getCurrentPosition Error:', error);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });
};
