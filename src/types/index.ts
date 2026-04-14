// types barrel export
// 전역 TypeScript 타입 정의

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
  GetTripSchedulesResult,
  GetMyTripsOptions,
  GetTripSchedulesByDateOptions,
  GetTripSchedulesOptions,
} from './trip';
