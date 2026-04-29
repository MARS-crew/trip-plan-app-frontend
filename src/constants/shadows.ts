import { COLORS } from './colors';

export const CARD_SHADOW = {
  shadowColor: COLORS.gray,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 1,
} as const;

export const CARD_SHADOW_DARK = {
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
  elevation: 1,
} as const;

export const CARD_SHADOW_SUBTLE = {
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.08,
  shadowRadius: 1.5,
  elevation: 1,
} as const;
