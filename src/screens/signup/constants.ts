/**
 * Signup Screen Constants
 * 회원가입 화면 특정 상수들
 */

import { YEARS, MONTHS, CURRENT_YEAR } from '@/utils/dateConstants';

export { YEARS, MONTHS, CURRENT_YEAR } from '@/utils/dateConstants';

// 국가 목록
export const COUNTRIES = [
  '대한민국',
  '미국',
  '일본',
  '중국',
  '영국',
  '프랑스',
  '독일',
  '캐나다',
  '호주',
] as const;

// 비밀번호 정규표현식 (utils에도 동일한 상수가 있음)
export { PASSWORD_REGEX } from '@/utils/validators';

// Picker 관련 상수
export const ITEM_HEIGHT = 44;
export const VISIBLE_ITEMS = 5;
export const COUNTRY_PICKER_MAX_HEIGHT = 274;

// 포맷팅 유틸리티 (utils에서 재export)
export { pad, getDaysInMonth } from '@/utils/formatters';
