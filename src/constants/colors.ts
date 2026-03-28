// tailwind.config.js에서 정의된 색상과 동기화
// Tailwind 테마 색상 사용 권장, 필요 시에만 직접 참조

export const COLORS = {
  main: '#DF6C20',
  black: '#251D18',
  gray: '#8C7B73',
  serve: '#DF6C201A',
  statusError: '#EF4444',
  statusSuccess: '#30A69A',
  inputBackground: '#FCFAF8',
  emailBackground: '#E1EBFA',
  background: '#E8E6E5',
  white: '#FFFFFF',
  borderGray: '#E5E0DC',
  subtleBorder: '#D9D9D9',
  chatHeaderCircleBackground: '#FCF0E9',
  chip: '#F4F0EC',
  screenBackground: '#FDFBF9',
  contentBackground: '#FCF0E8',
  locationTeal: '#24A89A',
  logoutRed: '#F04A3E',
  sunday: '#EF4444',
  saturday: '#0088FF',
  muted: '#8C7B7366',
  buttonDisabled: '#E8D3C1',
  buttonDisabledOverlay: '#DF6C2080',
} as const;


// 일정 지도 페이지 핀 전용 색상
export const TRIP_DAY_COLOR_PALETTE = [
  '#FB2C36',
  '#FD9A00',
  '#EFB100',
  '#7CCF00',
  '#00C951',
  '#00BC7D',
  '#00BBA7',
  '#00B8DB',
  '#00A6F4',
  '#2B7FFF',
  '#615FFF',
  '#8E51FF',
] as const;

// 네비게이션바 전용 색상 상수
export const COLOR_VALUES = {
  main: COLORS.main,
  gray: COLORS.gray,
  borderGray: COLORS.borderGray,
} as const;
