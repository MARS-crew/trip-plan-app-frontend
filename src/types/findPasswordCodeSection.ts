export interface FindPasswordCodeSectionProps {
  code: string;
  isCodeError: boolean;
  onChangeCode: (value: string) => void;
  onVerifyCode: () => void;
}
