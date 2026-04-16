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
} from './myTrip.types';

export type {
  GetTripSchedulesResult,
  GetTripSchedulesOptions,
  TripShareData,
  GetTripShareOptions,
  GetTripShareResult,
} from './tripDetail.types';

export interface ServiceError {
  success: false;
  code: string;
  message: string;
}

export interface TripRequestConfig {
  apiBaseUrl: string;
  headers: Record<string, string>;
}

export interface TripRequestConfigError {
  error: ServiceError;
}
