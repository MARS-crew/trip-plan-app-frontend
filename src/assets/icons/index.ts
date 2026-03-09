// assets/icons barrel export
export { default as HomeIcon } from '../home.svg';
export { default as SearchIcon } from '../search.svg';
export { default as MapIcon } from '../map.svg';
export { default as BookmarkIcon } from '../bookmark.svg';
export { default as MyPageIcon } from '../mypage.svg';

// 타입 정의
export interface IconProps {
  fill?: string;
  width?: number;
  height?: number;
  color?: string;
}

// 별칭 export (편의를 위한)
export { default as MyTripIcon } from '../map.svg';
