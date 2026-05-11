import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { HomeStackParamList, RootStackParamList } from '@/navigation/types';

export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

// Home Components Types
export interface ChatCaseContentProps {
  currentCaseIndex: number;
}

export interface MainTripCardProps {
  hasPlannedTrip: boolean;
  isInTripScheduleView: boolean;
  onAddTrip: () => void;
  onOpenTripSchedule: () => void;
  onViewAllSchedule: () => void;
  nearbyTrip?: import('@/types/myTrip.types').NearbyScheduleData | null;
}

export interface MainTripCardEmptyProps {
  onAddTrip: () => void;
}

export interface MainTripCardInProgressProps {
  onViewAllSchedule: () => void;
}

export interface MainTripCardPlannedProps {
  onOpenTripSchedule: () => void;
  daysUntilTrip?: number;
  tripDayCount?: number;
  progressRate?: number;
}

export interface MainTripCardPlannedViewProps extends MainTripCardPlannedProps {
  tripTitle?: string;
  startDate?: string;
  endDate?: string;
  scheduleCount?: number;
}

export interface MainTripCardInProgressViewProps extends MainTripCardInProgressProps {
  tripTitle?: string;
  nextSchedules?: import('@/types/myTrip.types').TripScheduleItem[];
}
