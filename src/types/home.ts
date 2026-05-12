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
}

export interface MainTripCardEmptyProps {
  onAddTrip: () => void;
}

export interface MainTripCardInProgressProps {
  onViewAllSchedule: () => void;
}

export interface MainTripCardPlannedProps {
  onOpenTripSchedule: () => void;
}
