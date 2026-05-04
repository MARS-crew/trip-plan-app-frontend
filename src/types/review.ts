export type RatingValue = 1 | 2 | 3 | 4 | 5;
export type imageDomain = 'TRIP' | 'REVIEW';

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewCardProps {
  nickname: string;
  rating: number;
  content: string;
  imageUrls?: string[];
  visitedDate: string;
  createdAt?: string;
}

export interface ReviewData {
  ratingAvg: number;
  reviewCount: number;
  ratingDistribution: RatingDistribution;
  reviews: ReviewCardProps[];
}

export interface StarRatingProps {
  score: number;
  max?: number;
}

export interface ReviewWriteBody {
  visitedPlaceId: number;
  placeName: string;
  visitedAt: string;
  rating: number;
  content: string;
  imageUrls: string[];
}

export interface imageUploadUrl {
  uploadUrl: string;
  storagePath: string;
  domain: imageDomain;
}

export interface Asset {
  uri?: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

export interface ReviewPhoto {
  id: string;
  uri: string;
  fileName?: string;
  type?: string;
}

export interface PhotoUploaderProps {
  photos: ReviewPhoto[];
  maxPhotos?: number;
  onChangePhotos: (photos: ReviewPhoto[]) => void;
}

export interface ReviewPhotoItemProps {
  photo: ReviewPhoto;
  onRemove: (photoId: string) => void;
}

export interface ReviewWriteScreenProps {
  visitedPlaceId: number;
  placeName?: string;
  visitedDate?: string;
  onBack?: () => void;
  onSubmitReview?: (payload: ReviewSubmitPayload) => Promise<void> | void;
}

export interface ReviewSubmitPayload {
  rating: number;
  reviewText: string;
  photos: ReviewPhoto[];
  visitedDate: string;
}

export interface ReviewPhoto {
  id: string;
  uri: string;
  fileName?: string;
  type?: string;
}

export interface StarButtonProps {
  star: number;
  isFilled: boolean;
  onPress: (star: number) => void;
}

export interface ReviewPhotoItemProps {
  photo: ReviewPhoto;
  onRemove: (photoId: string) => void;
}
