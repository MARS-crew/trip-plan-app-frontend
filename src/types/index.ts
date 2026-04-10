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
