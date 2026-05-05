export interface PlaceCardProps {
  title: string;
  region: string;
  rating: number;
  categoryLabel: string;
  imageUrl?: string;
  tags?: string[];
  isSaved?: boolean;
  onPress: () => void;
  onBookmarkPress: () => void;
}
