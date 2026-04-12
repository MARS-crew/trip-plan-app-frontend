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
}

export type AccountFieldKey = 'accountId' | 'nickname' | 'password' | 'passwordConfirm';
