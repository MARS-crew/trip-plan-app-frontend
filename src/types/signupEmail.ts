import type { LayoutChangeEvent } from 'react-native';

import type { SignUpFormData } from './signup';

export interface EmailSectionProps {
  formData: SignUpFormData;
  isEmailVerified: boolean;
  isEmailError: boolean;
  isEmailSent: boolean;
  isCodeError: boolean;
  isVerifyingCode: boolean;
  isCodeFieldVisible: boolean;
  canSendCode: boolean;
  sendCodeButtonText: string;
  showFieldErrors: boolean;
  onChangeEmail: (text: string) => void;
  onSendVerification: () => void;
  onVerifyCode: () => void;
  onChangeVerificationCode: (text: string) => void;
  onEmailLayout: (event: LayoutChangeEvent) => void;
}
