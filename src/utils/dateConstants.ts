/**
 * Date Constants
 * 날짜 관련 상수 모음 (signup 등에서 재사용 가능)
 */

export const CURRENT_YEAR = new Date().getFullYear();
export const CURRENT_MONTH = new Date().getMonth() + 1;
export const CURRENT_DATE = new Date().getDate();

/**
 * 년도 배열 (현재 기준 과거 100년)
 */
export const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

/**
 * 월 배열 (1-12)
 */
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * 요일 (영문)
 */
export const WEEKDAYS_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * 요일 (축약형 영문)
 */
export const WEEKDAYS_EN_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * 요일 (한글)
 */
export const WEEKDAYS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/**
 * 요일 (축약형 한글)
 */
export const WEEKDAYS_KO_SHORT = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 월 (영문)
 */
export const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * 월 (축약형 영문)
 */
export const MONTHS_EN_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * 월 (한글)
 */
export const MONTHS_KO = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

/**
 * 시간 범위 (0-23)
 */
export const HOURS = Array.from({ length: 24 }, (_, i) => i);

/**
 * 분 범위 (0-59, 15분 단위)
 */
export const MINUTES_BY_15 = Array.from({ length: 4 }, (_, i) => i * 15);

/**
 * 분 범위 (0-59, 30분 단위)
 */
export const MINUTES_BY_30 = Array.from({ length: 2 }, (_, i) => i * 30);

/**
 * 분 범위 (0-59, 1분 단위)
 */
export const MINUTES = Array.from({ length: 60 }, (_, i) => i);

/**
 * 시간 단위 (밀리초)
 */
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  WEEK: 1000 * 60 * 60 * 24 * 7,
  MONTH: 1000 * 60 * 60 * 24 * 30,
  YEAR: 1000 * 60 * 60 * 24 * 365,
} as const;

/**
 * 주중(월-금) 날짜 필터
 */
export const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};

/**
 * 주말(토-일) 날짜 필터
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * 윤년 확인
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * 분기 계산 (1-4)
 */
export const getQuarter = (month: number): number => {
  return Math.ceil(month / 3);
};

/**
 * 연도별 일수
 */
export const getDaysInYear = (year: number): number => {
  return isLeapYear(year) ? 366 : 365;
};

/**
 * 분기 시작 월
 */
export const getQuarterStartMonth = (quarter: number): number => {
  return (quarter - 1) * 3 + 1;
};

/**
 * 분기 종료 월
 */
export const getQuarterEndMonth = (quarter: number): number => {
  return quarter * 3;
};
