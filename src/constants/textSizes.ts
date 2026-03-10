// tailwind.config.js에서 정의된 텍스트 사이즈와 동기화

interface TextSizeConfig {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
}

export const TEXT_SIZES: Record<string, TextSizeConfig> = {
  h: {
    fontSize: 20,
    lineHeight: 1.2,
    fontWeight: '700',
  },
  h1: {
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: '700',
  },
  h2: {
    fontSize: 16,
    lineHeight: 1.2,
    fontWeight: '700',
  },
  h3: {
    fontSize: 14,
    lineHeight: 1.2,
    fontWeight: '500',
  },
  p: {
    fontSize: 12,
    lineHeight: 1.5,
    fontWeight: '400',
  },
  tabBarLabel: {
    fontSize: 10,
    lineHeight: 1.2,
    fontWeight: '500',
  },
} as const;

// Tailwind 클래스 이름 (className용)
export const TEXT_SIZE_CLASSES = {
  h: 'text-h',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  p: 'text-p',
} as const;

