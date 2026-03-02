// Application constants

// API endpoints
// `process`는 Node 환경에서 제공되며, React Native에서는
// Babel 플러그인 또는 환경변수 라이브러리로 정의해야 합니다.
//간단히 타입 오류를 제거하기 위해 아래와 같이 선언합니다.
declare const process: { env: { REACT_APP_API_BASE_URL?: string } };

export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE_URL) ||
  'http://localhost:3000';

// App configuration
export const APP_NAME = 'Trip Plan';
export const APP_VERSION = '0.0.1';

// Tailwind 스타일링에 사용할 수 있는 컬러 차트
// 각 값은 Tailwind 클래스의 색상 슬러그 (예: 'blue-500')
// 예시 컬러로 디자인 완료 후 수정 필요
export const COLORS = {
  primary: 'blue-500',
  secondary: 'gray-700',
  accent: 'pink-500',
  background: 'white',
  text: 'black',
  success: 'green-500',
  warning: 'yellow-500',
  danger: 'red-500',
};

// Add other constants as needed
