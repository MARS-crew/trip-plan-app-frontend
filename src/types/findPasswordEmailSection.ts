export interface FindPasswordEmailSectionProps {
  email: string;
  canSendCode: boolean;
  sendCodeButtonText: string;
  isEmailSent: boolean;
  isEmailError: boolean;
  isCodeVerified: boolean;
  onChangeEmail: (value: string) => void;
  onSendVerification: () => void;
}
