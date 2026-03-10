// tailwind.config.js에서 정의된 텍스트 사이즈와 동기화

interface TextSizeConfig {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
}

export const TEXT_SIZES: Record<string, TextSizeConfig> = {
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  h: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  h1: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '700',
  },
  h2: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  p: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  p1: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  tabBarLabel: {
    fontSize: 10,
    lineHeight: 1.2,
    fontWeight: '500',
  },
} as const;

// Tailwind 클래스 이름 (className용)
export const TEXT_SIZE_CLASSES = {
  title: 'text-title',
  h: 'text-h',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  p: 'text-p',
  p1: 'text-p1',
} as const;

