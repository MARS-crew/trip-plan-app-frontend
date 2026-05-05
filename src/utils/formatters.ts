/**
 * Date/Number Formatting Utilities
 * 재사용 가능한 포맷팅 함수 모음
 */

/**
 * 숫자를 2자리 문자열로 패딩합니다
 * @example pad(5) => "05", pad(12) => "12"
 */
export const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * 월에 포함된 날짜의 수를 반환합니다
 * @example getDaysInMonth(2024, 2) => 29 (윤년)
 * @example getDaysInMonth(2024, 1) => 31
 */
export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

/**
 * Date 객체를 "YYYY-MM-DD" 형식의 문자열로 변환합니다
 * @example formatDateToString(new Date(2024, 4, 5)) => "2024-05-05"
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

/**
 * "YYYY-MM-DD" 형식의 문자열을 Date 객체로 변환합니다
 * @example parseDateString("2024-05-05") => Date(2024, 4, 5)
 */
export const parseDateString = (dateStr: string): Date | null => {
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(regex);

  if (!match) {
    return null;
  }

  const [_, year, month, day] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // 유효한 날짜인지 확인
  if (
    date.getFullYear() !== parseInt(year) ||
    date.getMonth() !== parseInt(month) - 1 ||
    date.getDate() !== parseInt(day)
  ) {
    return null;
  }

  return date;
};

/**
 * 두 날짜 사이의 일수를 계산합니다
 * @example getDaysBetween(new Date(2024, 0, 1), new Date(2024, 0, 5)) => 4
 */
export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 나이를 계산합니다 (생년월일 기준)
 * @example getAge(new Date(1990, 0, 15)) => 34 (2024년 기준)
 */
export const getAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

/**
 * 시간을 "HH:MM" 형식으로 포맷합니다
 * @example formatTime(new Date(2024, 0, 1, 9, 5)) => "09:05"
 */
export const formatTime = (date: Date): string => {
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${hours}:${minutes}`;
};

/**
 * 날짜를 "YYYY년 MM월 DD일" 형식으로 포맷합니다 (한글)
 * @example formatDateKorean(new Date(2024, 4, 5)) => "2024년 05월 05일"
 */
export const formatDateKorean = (date: Date): string => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 상대적 시간을 텍스트로 변환합니다 (예: "2시간 전")
 * @example getRelativeTime(new Date(Date.now() - 3600000)) => "1시간 전"
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDateKorean(date);
};

/**
 * 숫자를 금액 형식으로 포맷합니다
 * @example formatCurrency(10000) => "10,000"
 * @example formatCurrency(10000, '원') => "10,000원"
 */
export const formatCurrency = (amount: number, currency: string = ''): string => {
  const formatted = Math.floor(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formatted}${currency}`;
};

/**
 * 백분율을 포맷합니다
 * @example formatPercent(0.75) => "75%"
 * @example formatPercent(0.753, 1) => "75.3%"
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};
