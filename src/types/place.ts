export interface RecommendedPlace {
  placeId: number;
  name: string;
  imageUrl: string | null;
  placeType: string;
  cityName: string;
  countryName: string;
  description: string;
  ratingAvg: number;
  reviewCount: number;
  tags: string[];
}

export interface GetRecommendedPlacesData {
  placeCount: number;
  recommendedPlaces: RecommendedPlace[];
}

export interface GetRecommendedPlacesOptions {
  limit?: number;
  signal?: AbortSignal;
}

export interface GetRecommendedPlacesResult {
  data: RecommendedPlace[];
  error: string | null;
}

export interface NearbyRecommendedPlace {
  placeId: number;
  name: string;
  imageUrl: string | null;
  cityName: string;
  countryName: string;
  distanceMeters: number;
}

export interface GetNearbyRecommendedPlacesData {
  placeCount: number;
  nearbyRecommendedPlaces: NearbyRecommendedPlace[];
}

export interface GetNearbyRecommendedPlacesOptions {
  placeId: number;
  signal?: AbortSignal;
}

export interface GetNearbyRecommendedPlacesResult {
  data: NearbyRecommendedPlace[];
  error: string | null;
}

export interface ReviewPreview {
  reviewId: number;
  nickname: string;
  rating: number;
  content: string;
  visitedDate: string;
  imageUrls: string[];
}

export interface PlaceDetail {
  placeId: number;
  name: string;
  countryName: string;
  cityName: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  ratingAvg: number;
  reviewCount: number;
  openingHours: string | null;
  imageUrl: string | null;
  placeType: string;
  saved: boolean;
  tags: string[];
  reviewPreviews: ReviewPreview[];
}

export interface GetPlaceDetailOptions {
  placeId: number;
  signal?: AbortSignal;
}

export interface GetPlaceDetailResult {
  data: PlaceDetail | null;
  error: string | null;
}

export interface PlaceShareData {
  placeId: number;
  placeName: string;
  shareTitle: string;
  shareDescription: string;
  shareUrl: string;
  imageUrl?: string;
}

export interface GetPlaceShareOptions {
  placeId: number;
  signal?: AbortSignal;
}

export interface GetPlaceShareResult {
  data: PlaceShareData | null;
  error: string | null;
}
