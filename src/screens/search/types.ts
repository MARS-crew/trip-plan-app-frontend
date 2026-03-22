import type { ImageSourcePropType } from 'react-native';

export interface TravelItemData {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  image: ImageSourcePropType;
}
