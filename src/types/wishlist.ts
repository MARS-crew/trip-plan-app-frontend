export interface PlaceSelectionPlace {
  address: string;
  cityName: string;
  countryName: string;
  imageUrl: string;
  name: string;
  placeId: number;
  placeType: string;
  selectionId: number;
}

export interface PlaceSelectionResponseData {
  savedPlaceCount: number;
  savedPlaces: PlaceSelectionPlace[];
  tripId: number;
  tripTitle: string;
  wishlistPlaceCount: number;
  wishlistPlaces: PlaceSelectionPlace[];
}

export interface PlaceSelectionResponse {
  message: string;
  code: string;
  data: PlaceSelectionResponseData;
  success: boolean;
}
