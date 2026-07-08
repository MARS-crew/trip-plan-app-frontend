import { ToastAndroid } from 'react-native';

export const getFriendlyErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof TypeError) {
    return '네트워크를 찾을 수 없습니다. 다시 시도해주세요.';
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};

let suppressToastsUntil = 0;
let consoleErrorRestoreTimer: ReturnType<typeof setTimeout> | null = null;
const originalConsoleError = console.error;

// 세션 만료로 로그인 화면으로 강제 이동시킬 때, 그 시점에 진행 중이던 요청들이
// 뒤늦게 실패 처리되며 로그인 화면 위에 무관한 에러 토스트/LogBox 알림을 띄우는 것을 잠깐 막는다.
// (실제로 버그가 발생한 게 아니라 "세션 만료로 인한 예정된 로그아웃"이므로 에러로 취급하지 않는다.)
export const suppressUserFacingErrors = (durationMs = 2000): void => {
  suppressToastsUntil = Date.now() + durationMs;

  if (consoleErrorRestoreTimer) {
    clearTimeout(consoleErrorRestoreTimer);
  } else {
    console.error = () => {};
  }

  consoleErrorRestoreTimer = setTimeout(() => {
    console.error = originalConsoleError;
    consoleErrorRestoreTimer = null;
  }, durationMs);
};

export const showToastMessage = (message: string): void => {
  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return;
  }

  if (Date.now() < suppressToastsUntil) {
    return;
  }

  ToastAndroid.show(trimmedMessage, ToastAndroid.SHORT);
};