import type { ImageSourcePropType } from 'react-native';

export interface RoutePoint {
  id: string;
  placeId: number;
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
  image: ImageSourcePropType | null;
  categories?: string[];
  current: boolean;
  canAddVisitedPlace: boolean;
  visited: boolean;
}

export interface DayGroup {
  day: number;
  points: RoutePoint[];
}
