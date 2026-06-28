import { getEnvConfig } from '@/config/env';
import type { FetchAddressResult, FetchPlaceNameResult } from '@/types';

const getGoogleMapsApiKey = (): string | null => {
  const { googleMapsApiKey } = getEnvConfig();
  return googleMapsApiKey ?? null;
};

interface GeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface CountryInfo {
  code: string; // ISO 3166-1 alpha-2 국가 코드 (예: JP, KR)
  name: string; // 현지화된 국가명 (한국어, 예: 일본, 대한민국)
}

// 좌표를 역지오코딩하여 국가 코드(ISO alpha-2)와 한국어 국가명을 반환한다.
// 키가 없거나 조회에 실패하면 null을 반환한다.
export const fetchCountry = async (
  latitude: number,
  longitude: number,
): Promise<CountryInfo | null> => {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&result_type=country&key=${apiKey}`,
    );
    // fetch는 4xx/5xx에도 reject되지 않으므로 ok 여부를 먼저 검증한다.
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.status !== 'OK') {
      return null;
    }

    const components: GeocodeAddressComponent[] = data.results?.[0]?.address_components ?? [];
    const country = components.find((component) => component.types.includes('country'));
    if (!country?.short_name) {
      return null;
    }

    return { code: country.short_name, name: country.long_name ?? country.short_name };
  } catch (error) {
    console.error('fetchCountry Error:', error);
    return null;
  }
};

export const fetchKoreanAddress = async (
  latitude: number,
  longitude: number,
): Promise<FetchAddressResult> => {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return {
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      error: 'GOOGLE_MAPS_API_KEY_MISSING',
    };
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=ko&key=${apiKey}`,
    );
    const data = await response.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return {
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        error: 'GEOCODING_REQUEST_FAILED',
      };
    }

    const address =
      data.results?.[0]?.formatted_address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

    return { address, error: null };
  } catch (error) {
    console.error('fetchKoreanAddress Error:', error);
    return {
      address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      error: 'GEOCODING_REQUEST_FAILED',
    };
  }
};

export const fetchNearestKoreanPlaceName = async (
  latitude: number,
  longitude: number,
): Promise<FetchPlaceNameResult & { summary: string | null }> => {
  // 결과 타입에 summary 추가
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    return {
      name: '알 수 없는 장소',
      types: [],
      placeId: null,
      photoUrl: null,
      summary: null,
      error: 'GOOGLE_MAPS_API_KEY_MISSING',
    };
  }

  try {
    // 1. 주변 장소 검색
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&rankby=distance&type=point_of_interest&language=ko&key=${apiKey}`,
    );
    const data = await response.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return {
        name: '알 수 없는 장소',
        types: [],
        placeId: null,
        photoUrl: null,
        summary: null,
        error: 'PLACES_REQUEST_FAILED',
      };
    }
    const place = data.results?.[0];

    if (!place) {
      return {
        name: '알 수 없는 장소',
        types: [],
        placeId: null,
        photoUrl: null,
        summary: null,
        error: 'PLACE_NOT_FOUND',
      };
    }

    // 2. 상세 요약 정보 추가 호출 (place_id 활용)
    const summary = await fetchPlaceEditorialSummary(place.place_id);

    const photoReference = place.photos?.[0]?.photo_reference;
    const photoUrl = photoReference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`
      : null;

    return {
      name: place.name ?? '알 수 없는 장소',
      types: Array.isArray(place.types) ? place.types.slice(0, 2) : [],
      placeId: place.place_id ?? null,
      photoUrl,
      summary, // 추출한 요약 정보 삽입
      error: null,
    };
  } catch (error) {
    console.error('fetchNearestKoreanPlaceName Error:', error);
    return {
      name: '알 수 없는 장소',
      types: [],
      placeId: null,
      photoUrl: null,
      summary: null,
      error: 'PLACES_REQUEST_FAILED',
    };
  }
};
export interface NearbyPlace {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
}

export const searchNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radiusMeters: number,
): Promise<NearbyPlace[]> => {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radiusMeters}&type=tourist_attraction&language=ko&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') return [];

    return (data.results ?? []).map(
      (place: {
        place_id: string;
        name: string;
        geometry: { location: { lat: number; lng: number } };
        vicinity?: string;
      }) => ({
        id: place.place_id,
        title: place.name,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        address: place.vicinity ?? '',
      }),
    );
  } catch {
    return [];
  }
};

export const fetchPlaceEditorialSummary = async (placeId: string): Promise<string | null> => {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) return null;

  try {
    // editorial_summary 필드를 명시적으로 요청
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=editorial_summary&language=ko&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === 'OK' && data.result?.editorial_summary) {
      return data.result.editorial_summary.overview;
    }
    return null;
  } catch (error) {
    console.error('fetchPlaceEditorialSummary Error:', error);
    return null;
  }
};
