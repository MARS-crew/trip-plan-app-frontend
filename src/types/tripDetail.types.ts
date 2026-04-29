import type { RouteProp } from '@react-navigation/native';
import type { SharedValue } from 'react-native-reanimated';

import type { TripDetailCardProps } from '@/components/ui/TripDetailCard';
import type { RootStackParamList } from '@/navigation/types';
import type { ServiceError } from './trip';

export type TripDetailRoute = RouteProp<RootStackParamList, 'TripDetail'>;

export interface TripDetailCardItem {
  id: number;
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

export type TripDetailCardMenuItem = Pick<
  TripDetailCardProps,
  'id' | 'order' | 'title' | 'location' | 'description' | 'startTime' | 'endTime' | 'isCurrentSchedule'
> & { id: number };

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
  onClose: () => void;
}

export interface KebabMenuSheetProps {
  isVisible: boolean;
  translateY: SharedValue<number>;
  onClose: () => void;
  onPressDelete?: () => void;
}

export interface DeleteWarningModalProps {
  visible: boolean;
  onConfirm: () => void;
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

export interface DeleteTripOptions {
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

export interface DeleteTripResult {
  data: unknown;
  error: string | null;
export interface GetTripShareResult {
  data: TripShareData | null;
  error: ServiceError | null;
}
