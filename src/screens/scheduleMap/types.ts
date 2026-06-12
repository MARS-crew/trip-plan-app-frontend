import type { ImageSourcePropType } from 'react-native';

export interface RoutePoint {
  id: string;
  tripScheduleId?: number | string;
  placeId?: number | string | null;
  day: number;
  order: number;
  latitude: number;
  longitude: number;
  title: string;
  location: string;
  description: string;
  placeCardDescription: string;
  startTime: string;
  endTime: string;
  image?: ImageSourcePropType | null;
  imageText?: string;
  categories?: string[];
  visited?: boolean;
  canAddVisitedPlace?: boolean;
  current?: boolean;
}

export interface DayGroup {
  day: number;
  points: RoutePoint[];
}
