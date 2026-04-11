import type { WishlistBottomSheetTabId } from '@/screens/wishList/components';

export interface LikedIdsByTab {
  saved: Set<string>;
  wishlist: Set<string>;
}

export type LikeTabId = keyof LikedIdsByTab;

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface WishlistTabConfig {
  id: WishlistBottomSheetTabId;
  label: string;
}
