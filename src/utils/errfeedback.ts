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

// 세션 만료로 로그인 화면으로 강제 이동시킬 때, 그 시점에 진행 중이던 요청들이
// 뒤늦게 실패 처리되며 로그인 화면 위에 무관한 에러 토스트를 띄우는 것을 잠깐 막는다.
// (실제로 버그가 발생한 게 아니라 "세션 만료로 인한 예정된 로그아웃"이므로 에러로 취급하지 않는다.)
// console.error는 건드리지 않는다 — 전역으로 덮어쓰면 이 창(window) 동안 앱 어디서든
// 발생하는 무관한 실제 에러 로그까지 함께 침묵해 디버깅을 어렵게 만든다.
export const suppressUserFacingErrors = (durationMs = 2000): void => {
  suppressToastsUntil = Date.now() + durationMs;
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