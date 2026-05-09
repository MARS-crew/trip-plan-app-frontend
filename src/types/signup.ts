import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/navigation/types';

export type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface SignUpFormData {
  accountId: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other' | '';
  country: string;
  email: string;
  verificationCode: string;
}

export interface TermsAgreement {
  allTerms: boolean;
  serviceTerms: boolean;
  privacyPolicy: boolean;
  marketingConsent: boolean;
  nightMarketingConsent: boolean;
}

export type AccountFieldKey = 'accountId' | 'nickname' | 'password' | 'passwordConfirm';
export type EmailStatus = 'none' | 'sent' | 'error';
export type CodeStatus = 'none' | 'success' | 'error';
export type IdCheckStatus = 'idle' | 'available' | 'duplicate' | 'error';
export type RequiredFieldKey =
  | 'accountId'
  | 'nickname'
  | 'password'
  | 'passwordConfirm'
  | 'name'
  | 'birthDate'
  | 'gender'
  | 'country'
  | 'email';
export type SectionKey = 'account' | 'profile' | 'email';

export type CountryDropdownLayout = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
};

export interface SpinnerColumnProps {
  items: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  format?: (n: number) => string;
}
