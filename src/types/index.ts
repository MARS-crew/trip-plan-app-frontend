export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface PlaceSummary {
  id: string;
  displayName: string;
  formattedAddress?: string;
  location: LatLng;
  rating?: number;
  userRatingCount?: number;
}

export interface PlaceReview {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: string;
}

export interface PlaceDetail {
  id: string;
  displayName: string;
  formattedAddress?: string;
  editorialSummary?: string;
  rating?: number;
  userRatingCount?: number;
  reviews: PlaceReview[];
}
