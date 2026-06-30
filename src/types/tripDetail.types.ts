import type { RouteProp } from '@react-navigation/native';
import type { SharedValue } from 'react-native-reanimated';

import type { TripDetailCardProps } from '@/components/ui/TripDetailCard';
import type { RootStackParamList } from '@/navigation/types';
import type { ServiceError } from './trip';

export type TripDetailRoute = RouteProp<RootStackParamList, 'TripDetail'>;
export type TripShareRoute = RouteProp<RootStackParamList, 'TripShare'>;

export interface TripDetailCardItem {
  id: number;
  tripScheduleId?: number;
  placeId?: number;
  scheduleDate?: string;
  order: number;
  title: string;
  location: string;
  address?: string;
  description: string;
  startTime: string;
  endTime: string;
  isCurrentSchedule?: boolean;
}

export interface TripDetailSection {
  dayNo: number;
  dayLabel: string;
  cards: TripDetailCardItem[];
  showMapIcon: boolean;
}

export interface TripDetailHeader {
  title: string;
  dateText: string;
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
  tripDayCount?: number;
}

export type TripDetailCardMenuItem = Pick<
  TripDetailCardProps,
  | 'id'
  | 'order'
  | 'title'
  | 'location'
  | 'description'
  | 'startTime'
  | 'endTime'
  | 'isCurrentSchedule'
> & { id: number; tripScheduleId?: number };

export interface HeaderProps {
  onPressKebab?: () => void;
  tripId?: number;
  title?: string;
  dateText?: string;
  imageUrl?: string;
  isReadOnly?: boolean;
}

export interface DaySectionProps {
  dayNo: number;
  dayLabel: string;
  cards?: TripDetailCardMenuItem[];
  showMapIcon?: boolean;
  tripId?: number;
  tripTitle?: string;
  onPressCard: (id: number, yOffset: number) => void;
  onPressAction: (id: number) => void;
  isReadOnly?: boolean;
}

export interface CardContextMenuProps {
  card: TripDetailCardItem;
  opacity: SharedValue<number>;
  topOffset: number;
  accentColor?: string;
  onPressEdit: (card: TripDetailCardItem) => void;
  onPressRoute: (card: TripDetailCardItem) => void;
  onPressDelete: (card: TripDetailCardItem) => void;
  onClose: () => void;
}

export interface KebabMenuSheetProps {
  isVisible: boolean;
  translateY: SharedValue<number>;
  onClose: () => void;
  onPressEditTitle?: () => void;
  onPressEditDate?: () => void;
  onPressShare?: () => void;
  onPressShareTest?: () => void;
  onPressDelete?: () => void;
}

export interface DeleteWarningModalProps {
  visible: boolean;
  title?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export interface EditTitleModalProps {
  visible: boolean;
  value: string;
  maxLength: number;
  isSubmitting?: boolean;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export interface GetTripSchedulesResult {
  data: unknown;
  error: ServiceError | null;
}

export interface GetTripSchedulesOptions {
  tripId: number;
  signal?: AbortSignal;
}

export interface TripScheduleLocationItem {
  tripScheduleId: number;
  dayNo: number;
  scheduleDate: string;
  scheduleOrder: number;
  pinOrder?: number | null;
  placeId?: number | string | null;
  title: string;
  placeName?: string | null;
  address?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  memo?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  hasLocation: boolean;
  visited: boolean;
  canAddVisitedPlace: boolean;
  current: boolean;
}

export interface TripScheduleLocationsData {
  tripId: number;
  tripTitle: string;
  tripStatus: string;
  startDate: string;
  endDate: string;
  totalScheduleCount: number;
  locationScheduleCount: number;
  visitVerificationRadiusMeters: number;
  schedules: TripScheduleLocationItem[];
}

export interface GetTripScheduleLocationsOptions {
  tripId: number;
  signal?: AbortSignal;
}

export interface GetTripScheduleLocationsResult {
  data: TripScheduleLocationsData | null;
  error: ServiceError | null;
}

export interface CreateVisitedPlaceRequest {
  placeId: number;
  tripScheduleId: number;
}

export interface VisitedPlaceData {
  visitedPlaceId: number;
  tripId: number;
  tripScheduleId: number;
  placeId: number;
  placeName: string;
  visitedAt: string;
  visited: boolean;
}

export interface CreateVisitedPlaceOptions {
  tripId: number;
  payload: CreateVisitedPlaceRequest;
  signal?: AbortSignal;
}

export interface CreateVisitedPlaceResult {
  data: VisitedPlaceData | null;
  error: ServiceError | null;
}

export interface TripShareData {
  tripId: number;
  tripTitle: string;
  startDate: string;
  endDate: string;
  shareTitle: string;
  shareDescription: string;
  shareUrl: string;
  imageUrl?: string;
}

export interface GetTripShareOptions {
  tripId: number;
  signal?: AbortSignal;
}

export interface GetTripShareResult {
  data: TripShareData | null;
  error: ServiceError | null;
}

export interface GenerateTripSchedulesOptions {
  tripId: number;
  signal?: AbortSignal;
}

export interface GenerateTripSchedulesData {
  tripId: number;
  tripTitle: string;
  imageUrl?: string;
  tripStatus: string;
  tripStatusLabel: string;
  startDate: string;
  endDate: string;
  tripDayCount: number;
  totalScheduleCount: number;
  locationScheduleCount: number;
  hasCurrentSchedule: boolean;
  currentSchedule: unknown | null;
  canViewMap: boolean;
  canEditTrip: boolean;
  canAddSchedule: boolean;
  dailySchedules: unknown[];
}

export interface GenerateTripSchedulesResult {
  data: GenerateTripSchedulesData | null;
  error: ServiceError | null;
}

export interface GetTripRouteData {
  destinationAddress: string;
  destinationName: string;
  googleDirectionsUrl: string;
  hasCoordinate: boolean;
  latitude: number;
  longitude: number;
  placeId: number;
  tripId: number;
  tripScheduleId: number;
}

export interface GetTripRouteOptions {
  tripId: number;
  tripScheduleId: number;
  signal?: AbortSignal;
}

export interface GetTripRouteResult {
  data: GetTripRouteData | null;
  error: ServiceError | null;
}

export interface DeleteTripOptions {
  tripId: number;
  signal?: AbortSignal;
}

export interface DeleteTripResult {
  error: ServiceError | null;
}

export interface DeleteTripScheduleOptions {
  tripId: number;
  tripScheduleId: number;
  signal?: AbortSignal;
}

export interface DeleteTripScheduleResult {
  error: ServiceError | null;
}

export interface UpdateTripTitleRequest {
  title: string;
}

export interface UpdateTripTitleOptions {
  tripId: number;
  payload: UpdateTripTitleRequest;
  signal?: AbortSignal;
}

export interface UpdateTripTitleResult {
  error: ServiceError | null;
}

export interface UpdateTripDateRequest {
  startDate: string;
  endDate: string;
}

export interface UpdateTripDateOptions {
  tripId: number;
  payload: UpdateTripDateRequest;
  signal?: AbortSignal;
}

export interface UpdateTripDateResult {
  error: ServiceError | null;
}

export interface UpdateTripScheduleRequest {
  title: string;
  scheduleDate: string;
  startTime?: string;
  endTime?: string;
  placeId?: number;
  placeName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  memo?: string;
}

export interface UpdateTripScheduleOptions {
  tripId: number;
  tripScheduleId: number;
  payload: UpdateTripScheduleRequest;
  signal?: AbortSignal;
}

export interface UpdateTripScheduleResult {
  error: ServiceError | null;
}
