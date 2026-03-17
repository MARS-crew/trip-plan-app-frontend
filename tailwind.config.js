/** @type {import('tailwindcss').Config} */

const colors = {
  main: '#DF6C20',
  black: '#251D18',
  gray: '#8C7B73',
  serve: '#DF6C201A',
  background: '#E8E6E5',
  white: '#FFFFFF',
  navborder: '#E5E0DC',
  chip: '#F4F0EC',
  screenBackground: '#FDFBF9',
};

const fontSize = {
  h: ['20px', { lineHeight: '1.2', fontWeight: '700' }], // H - 20px Bold
  h1: ['18px', { lineHeight: '1.2', fontWeight: '700' }], // H1 - 18px Bold
  h2: ['16px', { lineHeight: '1.2', fontWeight: '700' }], // H2 - 16px Bold
  h3: ['14px', { lineHeight: '1.2', fontWeight: '500' }], // H3 - 14px Medium
  p: ['12px', { lineHeight: '1.5', fontWeight: '400' }], // p - 12px Regular
};

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['Pretendard', 'System'],
      },
      fontSize,
    },
  },
  plugins: [],
};
