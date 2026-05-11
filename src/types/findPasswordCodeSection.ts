export interface FindPasswordCodeSectionProps {
  code: string;
  isCodeError: boolean;
  isVerifyingCode?: boolean;
  onChangeCode: (value: string) => void;
  onVerifyCode: () => void | Promise<void>;
}
