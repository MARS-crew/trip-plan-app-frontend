import type { ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import type { ServiceError } from './trip';

export type TripFilter = '전체' | '예정된 여행' | '지난 여행';
export type TripCardStatus = 'traveling' | 'scheduled' | 'completed';
export type TripStatus = 'ONGOING' | 'UPCOMING' | 'PLANNED' | 'COMPLETED' | 'PAST';
export type TripFilterStatus = 'ALL' | 'UPCOMING' | 'PAST';

export interface TripCardViewModel {
  id: number;
  city: string;
  startDate: string;
  dateText: string;
  scheduleText: string;
  scheduleCountText: string;
  imageSource: ImageSourcePropType;
  status: TripCardStatus;
}

export interface TripCardProps {
  city: string;
  dateText: string;
  scheduleText: string;
  scheduleCountText: string;
  imageSource: ImageSourcePropType;
  status: TripCardStatus;
  isOpen: boolean;
  onToggle: () => void;
  onImagePress?: () => void;
  children?: ReactNode;
}

export interface TripTimelineItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  description?: string;
}

export interface TripTimelineDateOption {
  dayNo: number;
  scheduleDate: string;
  displayLabel: string;
}

export interface TripTimelineProps {
  dateOptions: TripTimelineDateOption[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  items: TripTimelineItem[];
  isLoading?: boolean;
}

export interface TripTimelineStateItem {
  selectedDate: string;
  dateOptions: TripTimelineDateOption[];
  items: TripTimelineItem[];
  isLoading: boolean;
}

export interface TripTimelineListItemProps {
  item: TripTimelineItem;
  isLast: boolean;
}

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
  error: ServiceError | null;
}

export interface GetTripSchedulesByDateResult {
  data: TripSchedulesByDateData | null;
  error: ServiceError | null;
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

export interface CreateTripRequest {
  title: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export interface CreateTripData {
  tripId: number;
  title: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}

export interface CreateTripResult {
  data: CreateTripData | null;
  error: ServiceError | null;
}

export interface CreateTripOptions {
  payload: CreateTripRequest;
  signal?: AbortSignal;
}
