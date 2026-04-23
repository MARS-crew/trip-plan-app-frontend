import type { RouteProp } from '@react-navigation/native';
import type { SharedValue } from 'react-native-reanimated';

import type { RootStackParamList } from '@/navigation/types';
import type { ServiceError } from './trip';

export type TripDetailRoute = RouteProp<RootStackParamList, 'TripDetail'>;

export interface TripDetailCardItem {
  id: number;
  tripScheduleId?: number;
  order: number;
  title: string;
  location: string;
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
  tripDayCount?: number;
}

export type TripDetailCardMenuItem = TripDetailCardItem;

export interface HeaderProps {
  onPressKebab: () => void;
  title?: string;
  dateText?: string;
  imageUrl?: string;
}

export interface DaySectionProps {
  dayNo: number;
  dayLabel: string;
  cards?: TripDetailCardMenuItem[];
  showMapIcon?: boolean;
  onPressCard: (id: number, yOffset: number) => void;
  onPressAction: (id: number) => void;
}

export interface CardContextMenuProps {
  card: TripDetailCardMenuItem;
  opacity: SharedValue<number>;
  topOffset: number;
  accentColor?: string;
  onPressDelete: (card: TripDetailCardMenuItem) => void;
  onClose: () => void;
}

export interface DeleteWarningModalProps {
  visible: boolean;
  title: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export interface KebabMenuSheetProps {
  isVisible: boolean;
  translateY: SharedValue<number>;
  onClose: () => void;
  onPressShare?: () => void;
}

export interface GetTripSchedulesResult {
  data: unknown;
  error: ServiceError | null;
}

export interface GetTripSchedulesOptions {
  tripId: number;
  signal?: AbortSignal;
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

export interface DeleteTripScheduleData {
  deleted: boolean;
  tripId: number;
  tripScheduleId: number;
}

export interface DeleteTripScheduleOptions {
  tripId: number;
  tripScheduleId: number;
  signal?: AbortSignal;
}

export interface DeleteTripScheduleResult {
  data: DeleteTripScheduleData | null;
  error: ServiceError | null;
}
