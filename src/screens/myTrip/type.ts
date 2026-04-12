import type { ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';

export type TripFilter = '전체' | '예정된 여행' | '지난 여행';
export type TripCardStatus = 'traveling' | 'scheduled' | 'completed';

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
