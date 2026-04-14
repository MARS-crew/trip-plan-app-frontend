export type TripStatus = 'ONGOING' | 'UPCOMING' | 'COMPLETED';

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
