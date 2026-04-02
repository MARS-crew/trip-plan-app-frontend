import type { ImageSourcePropType } from 'react-native';

export interface RoutePoint {
  id: string;
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
  image: ImageSourcePropType;
  categories?: string[];
}

export interface DayGroup {
  day: number;
  points: RoutePoint[];
}
