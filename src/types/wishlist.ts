import type { ImageSourcePropType, TextInput } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export type WishlistBottomSheetTabId = 'trending' | 'saved' | 'wishlist';

export interface WishPlace {
  id: string;
  title: string;
  location?: string;
  description: string;
  image: ImageSourcePropType;
  categories?: string[];
}

export interface CategoryChipProps {
  label: string;
  onPress?: () => void;
  isSelected?: boolean;
  className?: string;
  textClassName?: string;
}

export interface WishContentContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface PlaceCardProps {
  place: WishPlace;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
  isTrending?: boolean;
}

export interface WishTabTrendingProps {
  places: WishPlace[];
  onToggleLike: (id: string) => void;
}

export interface WishTabSaveProps {
  places: WishPlace[];
  isLiked: (id: string) => boolean;
  onToggleLike: (id: string) => void;
}

export interface WishTabWishlistProps {
  places: WishPlace[];
  isLiked: (id: string) => boolean;
  onToggleLike: (id: string) => void;
}

export interface WishModalProps {
  isVisible: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  ModalIcon?: string;
  title: string;
  showCloseButton: boolean;
  buttonContainerClass?: string;
  primaryLabel: string;
  ModalContainer: string;
  onPrimaryPress: () => void;
  primaryBtnClass?: string;
  primaryIcon?: React.ReactNode;
  primaryTextClass?: string;
  primaryTitleTextClass?: string;
  secondaryLabel: string;
  onSecondaryPress: () => void;
  secondaryBtnClass?: string;
  secondaryTextClass?: string;
}

export interface WishlistBottomSheetTab {
  id: WishlistBottomSheetTabId;
  label: string;
}

export interface WishlistBottomSheetProps {
  translateY: SharedValue<number>;
  onStateChange: (expanded: boolean) => void;
  maxTopSnap?: number;
  tabs: WishlistBottomSheetTab[];
  selectedCategory: WishlistBottomSheetTabId;
  onSelectCategory: (tabId: WishlistBottomSheetTabId) => void;
  onPressComplete: () => void;
  renderTabContent: () => React.ReactNode;
}

export interface WishlistSearchBarProps {
  searchInputRef: React.RefObject<TextInput | null>;
  searchQuery: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onFocusInput: () => void;
  onPressBack: () => void;
}

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
