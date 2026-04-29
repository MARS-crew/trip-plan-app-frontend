export type SavedPlaceFilterType =
  | 'ALL'
  | 'ATTRACTION'
  | 'RESTAURANT'
  | 'BEACH'
  | 'NATURE'
  | 'LANDMARK'
  | 'ACCOMMODATION'
  | 'SHOPPING'
  | 'CULTURE';

export type SavedPlaceType = Exclude<SavedPlaceFilterType, 'ALL'>;

export interface SavedPlace {
  savedPlaceId: number;
  placeId: number;
  name: string;
  location: string;
  countryName: string;
  cityName: string;
  address: string;
  imageUrl: string;
  placeType: SavedPlaceType;
  ratingAvg: number;
  reviewCount: number;
  tags: string[];
  saved: boolean;
}

export interface GetSavedPlacesData {
  empty: boolean;
  emptyMessage: string;
  filterDisplayName: string;
  filterType: SavedPlaceFilterType;
  filteredSavedPlaceCount: number;
  savedPlaceCount: number;
  savedPlaceCountMessage: string;
  savedPlaces: SavedPlace[];
}

export interface SavedPlaceCategory {
  filterDisplayName: string;
  filterType: SavedPlaceFilterType;
  hasSavedPlaces: boolean;
  savedPlaceCount: number;
}

export interface GetSavedPlaceCategoriesData {
  categories: SavedPlaceCategory[];
  categoryCount: number;
  empty: boolean;
  emptyMessage: string;
  totalSavedPlaceCount: number;
}
