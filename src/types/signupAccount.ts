import type { LayoutChangeEvent } from 'react-native';

import type { SignUpFormData } from './signup';

export interface AccountSectionProps {
  formData: SignUpFormData;
  idCheckStatus: 'idle' | 'available' | 'duplicate' | 'error';
  idMessage: string;
  idMessageClass: string;
  idInputClass: string;
  showFieldErrors: boolean;
  isIdVerified: boolean;
  isPasswordValid: boolean;
  isPasswordMatched: boolean;
  hasPasswordError: boolean;
  passwordInputClassName: string;
  onCheckId: () => void;
  onChangeId: (text: string) => void;
  onChangeNickname: (text: string) => void;
  onChangePassword: (text: string) => void;
  onChangePasswordConfirm: (text: string) => void;
  onIdLayout: (event: LayoutChangeEvent) => void;
  onNicknameLayout: (event: LayoutChangeEvent) => void;
  onPasswordLayout: (event: LayoutChangeEvent) => void;
  onPasswordConfirmLayout: (event: LayoutChangeEvent) => void;
}
