export type RatingValue = 1 | 2 | 3 | 4 | 5;

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
