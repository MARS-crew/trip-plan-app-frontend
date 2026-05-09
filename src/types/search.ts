import type { ImageSourcePropType } from 'react-native';

export interface GetTravelItemData {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  image: ImageSourcePropType;
}

export interface GetRecentSearch {
  recentSearchId: number;
  keyword: string;
}

export interface GetRecentSearchData {
  searchCount: number;
  recentSearches: GetRecentSearch[];
}

export interface GetPopularSearch {
  keyword: string;
}

export interface GetPopularSearchData {
  popularSearches: GetPopularSearch[];
}
