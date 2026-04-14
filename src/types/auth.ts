export interface EmailRequestData {
  email: string;
}

export interface EmailVerifyData {
  email: string;
  email_verified: 'Y' | 'N';
}
