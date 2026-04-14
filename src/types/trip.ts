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

export interface GetMyTripsResult {
  data: MyTripItem[];
  error: string | null;
}

export interface GetMyTripsOptions {
  filterStatus?: TripFilterStatus;
  signal?: AbortSignal;
}
