export type TripStatus = 'ONGOING' | 'UPCOMING' | 'PLANNED' | 'COMPLETED' | 'PAST';
export type TripFilterStatus = 'ALL' | 'UPCOMING' | 'PAST';

export interface MyTripItem {
  tripId: number;
  title: string;
  imageUrl: string;
  tripStatus: TripStatus;
  tripStatusLabel: string;
  startDate: string;
  endDate: string;
  scheduleCount: number;
  tripDayCount: number;
}

export interface GetMyTripsData {
  tripCount: number;
  trips: MyTripItem[];
}

export interface TripScheduleDateOption {
  dayNo: number;
  scheduleDate: string;
  displayLabel: string;
}

export interface TripScheduleItem {
  tripScheduleId: number;
  title: string;
  placeName: string;
  address: string;
  startTime: string;
  endTime: string;
  memo?: string;
}

export interface TripSchedulesByDateData {
  tripId: number;
  tripTitle: string;
  selectedDate: string;
  selectedDayNo: number;
  selectedDayLabel: string;
  scheduleCount: number;
  dateOptions: TripScheduleDateOption[];
  schedules: TripScheduleItem[];
}

export interface GetMyTripsResult {
  data: MyTripItem[];
  error: string | null;
}

export interface GetTripSchedulesByDateResult {
  data: TripSchedulesByDateData | null;
  error: string | null;
}

export interface GetMyTripsOptions {
  filterStatus?: TripFilterStatus;
  signal?: AbortSignal;
}

export interface GetTripSchedulesByDateOptions {
  tripId: number;
  targetDate: string;
  signal?: AbortSignal;
}
