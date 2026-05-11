import type { ImageSourcePropType } from 'react-native';

export interface SearchResultItem {
  placeId: number;
  name: string;
  countryName: string;
  cityName: string;
  imageUrl: string;
  description: string;
  placeType: string;
  latitude: number;
  longitude: number;
  ratingAvg: number;
  reviewCount: number;
  tags: string[];
}

export interface GetSearchResultsData {
  keyword: string;
  resultCount: number;
  searchResults: SearchResultItem[];
}

export interface GetTravelItemData {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  image: ImageSourcePropType;
}

export interface TravelItemProps {
  item: GetTravelItemData;
  onPress?: (item: GetTravelItemData) => void;
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

export interface SearchResult {
  cityName: string;
  countryName: string;
  description: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  name: string;
  placeId: number;
  placeType: string;
  ratingAvg: number;
  reviewCount: number;
  tags: string[];
}

export interface SearchResultData {
  keyword: string;
  resultCount: number;
  searchResults: SearchResult[];
}
