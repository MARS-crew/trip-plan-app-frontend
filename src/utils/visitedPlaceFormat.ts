import type { VisitedPlace, VisitedPlaceItem } from '@/types/mypage';

const PLACE_TYPE_LABEL: Record<string, string> = {
  ATTRACTION: '관광지',
  RESTAURANT: '음식점',
  BEACH: '해변',
  NATURE: '자연',
  LANDMARK: '명소',
  ACCOMMODATION: '숙소',
  SHOPPING: '쇼핑',
  CULTURE: '문화',
};

export const formatVisitedDate = (visitedAt: string): string => {
  if (!visitedAt) {
    return '';
  }

  const datePart = visitedAt.split('T')[0];
  return datePart.replace(/-/g, '.');
};

export const buildLocation = (cityName: string, countryName: string): string => {
  if (cityName && countryName) {
    return `${cityName}, ${countryName}`;
  }
  return cityName || countryName || '';
};

export const buildTags = (placeType: string): string[] => {
  if (!placeType) {
    return [];
  }
  return [PLACE_TYPE_LABEL[placeType] ?? placeType];
};

export const mapVisitedPlace = (place: VisitedPlace): VisitedPlaceItem => {
  const hasReview = place.reviewWrittenYn === 'Y';
  return {
    id: String(place.visitedPlaceId),
    placeId: String(place.placeId),
    date: formatVisitedDate(place.visitedAt),
    title: place.placeName,
    location: buildLocation(place.cityName, place.countryName),
    tags: buildTags(place.placeType),
    reviewCta: hasReview ? '리뷰 확인하기' : '리뷰 쓰기',
    hasReview,
    imageUrl: place.imageUrl,
  };
};

export const groupVisitedPlacesByDate = (
  items: VisitedPlaceItem[],
): Array<[string, VisitedPlaceItem[]]> => {
  const grouped = new Map<string, VisitedPlaceItem[]>();

  items.forEach((item) => {
    const dateItems = grouped.get(item.date);
    if (dateItems) {
      dateItems.push(item);
    } else {
      grouped.set(item.date, [item]);
    }
  });

  return Array.from(grouped.entries());
};
