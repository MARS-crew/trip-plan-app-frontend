/** @type {import('tailwindcss').Config} */

const colors = {
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
  withdrawDanger: '#FF4D4F',
  withdrawBg: '#FFF5F5',
  inputBackground: '#FCFAF8',
  botoomSheetBackground: '#DBDBDB',
  zero: '#00000000',
  errmassage: '#FF4444',
  kakaoYellow: '#FEE500',
  naverGreen: '#03A94D',

  errormessage: '#FF4444',

};

const fontSize = {
  title: ['24px', { lineHeight: '32px', fontWeight: '700' }], // title - 24px, 32px, Bold
  h: ['20px', { lineHeight: '28px', fontWeight: '700' }], // H - 20px, 28px, Bold
  h1: ['18px', { lineHeight: '28px', fontWeight: '700' }], // H1 - 18px, 28px, Bold
  h2: ['16px', { lineHeight: '24px', fontWeight: '600' }], // H2 - 16px, 24px, Semibold
  h3: ['14px', { lineHeight: '20px', fontWeight: '600' }], // H3 - 14px, 20px, Semibold
  p: ['12px', { lineHeight: '16px', fontWeight: '400' }], // p - 12px, 16px, Regular
  p1: ['14px', { lineHeight: '20px', fontWeight: '500' }], // p1 - 14px, 20px, Medium
};

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Pretendard', 'System'],
        pretendardRegular: ['Pretendard-Regular', 'System'],
        pretendardMedium: ['Pretendard-Medium', 'System'],
        pretendardSemiBold: ['Pretendard-SemiBold', 'System'],
        pretendardBold: ['Pretendard-Bold', 'System'],
      },
      fontSize,
      boxShadow: {
        card: '0 0 3px rgba(0,0,0,0.15)',
        logincard: '0 0 5px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
