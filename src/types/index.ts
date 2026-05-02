// types barrel export
// 전역 TypeScript 타입 정의

export type {
  LoginData,
  LoginRequest,
  LoginResponse,
  LoginUserDetails,
  ReissueTokenData,
  ReissueTokenRequest,
  ReissueTokenResponse,
  ReissueTokenResult,
  ReissueTokenWarningType,
} from './auth';

export type { FindIdScreenNavigationProp } from './findId';
export type {
  CodeStatus,
  EmailStatus,
  FindPasswordScreenNavigationProp,
  TempPasswordStatus,
} from './findPassword';
export type { FindPasswordCodeSectionProps } from './findPasswordCodeSection';
export type { FindPasswordEmailSectionProps } from './findPasswordEmailSection';
export type { FindPasswordResultCardProps } from './findPasswordResultCard';
export type { HomeScreenNavigationProp } from './home';
export type { LoginScreenNavigationProp, SocialLoginButtonProps } from './login';
export type { AccountSectionProps } from './signupAccount';
export type { EmailSectionProps } from './signupEmail';
export type { ProfileSectionProps } from './signupProfile';
export type { SignUpFormData, SignUpScreenNavigationProp, TermsAgreement } from './signup';
export type { TermsSectionProps } from './signupTerms';

// Navigation 타입
export type { RootTabParamList } from '../navigation/types';

// 공통 타입
export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error 타입
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type {
  TripStatus,
  TripFilterStatus,
  MyTripItem,
  GetMyTripsData,
  TripScheduleDateOption,
  TripScheduleItem,
  TripSchedulesByDateData,
  GetMyTripsResult,
  GetTripSchedulesByDateResult,
  GetMyTripsOptions,
  GetTripSchedulesByDateOptions,
} from './trip';

export type {
  Gender,
  GetMyPageData,
  GetPapagoPhrase,
  GetProfileData,
  PapagoTargetLang,
  SettingItem,
  SettingItemType,
  StatItem,
  StatItemType,
} from './mypage';
export type { GetTripSchedulesOptions, GetTripSchedulesResult } from './tripDetail.types';
export type {
  GetNearbyRecommendedPlacesData,
  GetNearbyRecommendedPlacesOptions,
  GetNearbyRecommendedPlacesResult,
  NearbyRecommendedPlace,
  RecommendedPlace,
  GetRecommendedPlacesData,
  GetRecommendedPlacesOptions,
  GetRecommendedPlacesResult,
} from './place';
