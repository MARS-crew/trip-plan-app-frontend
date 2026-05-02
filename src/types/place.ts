export interface RecommendedPlace {
  placeId: number;
  name: string;
  imageUrl: string | null;
  placeType: string;
  cityName: string;
  countryName: string;
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
