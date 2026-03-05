import {
  DEFAULT_SEARCH_RADIUS_METER,
  DEFAULT_TOUR_PLACE_TYPES,
  GOOGLE_PLACES_API_KEY,
} from '../constants';
import type { LatLng, PlaceDetail, PlaceReview, PlaceSummary } from '../types';

const PLACES_BASE_URL = 'https://places.googleapis.com/v1/places';

const getHeaders = (fieldMask: string) => ({
  'Content-Type': 'application/json',
  'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
  'X-Goog-FieldMask': fieldMask,
});

const toReview = (review: any): PlaceReview => ({
  name: review.authorAttribution?.displayName,
  relativePublishTimeDescription: review.relativePublishTimeDescription,
  rating: review.rating,
  text: review.text?.text,
});

export const searchNearbyPlaces = async (
  center: LatLng,
  radius: number = DEFAULT_SEARCH_RADIUS_METER,
  includedTypes: string[] = DEFAULT_TOUR_PLACE_TYPES,
): Promise<PlaceSummary[]> => {
  const response = await fetch(`${PLACES_BASE_URL}:searchNearby`, {
    method: 'POST',
    headers: getHeaders(
      'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount',
    ),
    body: JSON.stringify({
      includedTypes,
      languageCode: 'ko',
      regionCode: 'KR',
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center,
          radius,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('search nearby failed');
  }

  const data = (await response.json()) as { places?: any[] };

  return (
    data.places
      ?.filter(place => place.id && place.displayName?.text && place.location)
      .map(place => ({
        id: place.id,
        displayName: place.displayName?.text ?? '이름 없음',
        formattedAddress: place.formattedAddress,
        location: {
          latitude: place.location!.latitude,
          longitude: place.location!.longitude,
        },
        rating: place.rating,
        userRatingCount: place.userRatingCount,
      })) ?? []
  );
};

export const getPlaceDetail = async (placeId: string): Promise<PlaceDetail> => {
  const fieldMask = 'id,displayName,formattedAddress,editorialSummary,rating,userRatingCount,reviews';

  const response = await fetch(`${PLACES_BASE_URL}/${placeId}`, {
    method: 'GET',
    headers: getHeaders(fieldMask),
  });

  if (!response.ok) {
    throw new Error('place detail failed');
  }

  const data = (await response.json()) as any;

  return {
    id: data.id,
    displayName: data.displayName?.text ?? '이름 없음',
    formattedAddress: data.formattedAddress,
    editorialSummary: data.editorialSummary?.text,
    rating: data.rating,
    userRatingCount: data.userRatingCount,
    reviews: (data.reviews ?? []).slice(0, 5).map(toReview),
  };
};
