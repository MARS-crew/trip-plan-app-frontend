export interface LoginRequest {
  usersId: string;
  password: string;
}

export interface LoginUserDetails {
  id: number;
  usersId: string;
  name: string;
  email: string;
  role: string;
  loginType: string;
  nickname: string;
  gender: string;
  birth: string;
  countryCode: string;
  privacyAgreed: string;
  marketingAgreed: string;
  nightMarketingAgreed: string;
  createdAt: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  userDetails: LoginUserDetails;
}

export type NaverLoginWarningType =
  | 'INVALID_TOKEN'
  | 'EXPIRED_REFRESH_TOKEN'
  | 'USER_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface NaverSignUpData {
  loginType: string;
  socialProviderId: string;
  nickname: string;
  email: string;
  name: string;
  gender: string;
  birth: string;
}

export interface NaverLoginData {
  nextAction: 'login' | 'signup';
  login?: LoginData | null;
  signupResponse?: NaverSignUpData | null;
}

export interface NaverLoginResponse {
  success: boolean;
  code: string;
  message: string;
  data?: NaverLoginData | null;
}

export interface NaverLoginSuccessResult {
  ok: true;
  data: NaverLoginData;
}

export interface NaverLoginFailureResult {
  ok: false;
  warningType: NaverLoginWarningType;
  message?: string;
}

export type NaverLoginResult = NaverLoginSuccessResult | NaverLoginFailureResult;

export interface LoginResponse {
  success: boolean;
  code: string;
  message: string;
  data?: LoginData | null;
}

export interface ReissueTokenRequest {
  refreshToken: string;
}

export interface ReissueTokenData {
  accessToken: string;
  refreshToken: string;
}

export interface ReissueTokenResponse {
  success: boolean;
  code: string;
  message: string;
  data?: ReissueTokenData | null;
}

export type LoginWarningType =
  | 'EMPTY_FIELDS'
  | 'INVALID_INPUT'
  | 'PASSWORD_MISMATCH'
  | 'USER_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface LoginSuccessResult {
  ok: true;
  data: LoginData;
}

export interface LoginFailureResult {
  ok: false;
  warningType: LoginWarningType;
  message?: string;
}

export type LoginResult = LoginSuccessResult | LoginFailureResult;

export type ReissueTokenWarningType =
  | 'INVALID_TOKEN'
  | 'EXPIRED_REFRESH_TOKEN'
  | 'USER_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface ReissueTokenSuccessResult {
  ok: true;
  data: ReissueTokenData;
}

export interface ReissueTokenFailureResult {
  ok: false;
  warningType: ReissueTokenWarningType;
  message?: string;
}

export type ReissueTokenResult = ReissueTokenSuccessResult | ReissueTokenFailureResult;

export interface EmailRequestData {
  email: string;
}

export interface EmailVerifyData {
  email: string;
  email_verified: 'Y' | 'N';
}

export interface FindIdRequest {
  nickname: string;
  email: string;
}

export interface FindIdData {
  usersId: string;
}

export interface FindIdResponse {
  success: boolean;
  code: string;
  message: string;
  data?: FindIdData | null;
}

export type FindIdWarningType =
  | 'INVALID_INPUT'
  | 'USER_NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface FindIdSuccessResult {
  ok: true;
  data: FindIdData;
}

export interface FindIdFailureResult {
  ok: false;
  warningType: FindIdWarningType;
  message?: string;
}

export type FindIdResult = FindIdSuccessResult | FindIdFailureResult;

export interface SignUpRequest {
  usersId: string;
  name: string;
  email: string;
  nickname: string;
  password?: string;
  passwordConfirm?: string;
  gender: string;
  birth: string;
  countryCode: string;
  privacyAgreed: string;
  marketingAgreed: string;
  nightMarketingAgreed: string;
  loginType: string;
  socialProviderId?: string;
}

export interface SignUpData {
  id: number;
  usersId: string;
  name: string;
  email: string;
  role: string;
  loginType: string;
  nickname: string;
  gender: string;
  birth: string;
  countryCode: string;
  privacyAgreed: string;
  marketingAgreed: string;
  nightMarketingAgreed: string;
  createdAt: string;
}

export interface SignUpResponse {
  success: boolean;
  code: string;
  message: string;
  data?: SignUpData | null;
}

export type SignUpWarningType =
  | 'EMPTY_FIELDS'
  | 'INVALID_INPUT'
  | 'DUPLICATE_USER'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface SignUpSuccessResult {
  ok: true;
  data: SignUpData;
}

export interface SignUpFailureResult {
  ok: false;
  warningType: SignUpWarningType;
  message?: string;
}

export type SignUpResult = SignUpSuccessResult | SignUpFailureResult;
