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

export const showToastMessage = (message: string): void => {
  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return;
  }

  ToastAndroid.show(trimmedMessage, ToastAndroid.SHORT);
};