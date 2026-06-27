import {
  DEFAULT_PAPAGO_TARGET_LANG,
  PAPAGO_TARGET_LANGS,
  type PapagoTargetLang,
} from '@/types/mypage';

/**
 * 어휘 번역에 넘길 대상 언어 코드를 검증한다.
 * 백엔드가 지원하는 언어(PAPAGO_TARGET_LANGS)면 그대로 반환하고,
 * 지원하지 않는 나라/언어가 들어오면 en(영어)으로 폴백한다.
 */
export const normalizePapagoTargetLang = (lang?: string | null): PapagoTargetLang => {
  if (lang && (PAPAGO_TARGET_LANGS as readonly string[]).includes(lang)) {
    return lang as PapagoTargetLang;
  }
  return DEFAULT_PAPAGO_TARGET_LANG;
};

// ISO 3166-1 alpha-2 국가 코드 → 지원 언어 코드 매핑.
// 여기에 없는 국가는 en(영어)으로 폴백한다.
const COUNTRY_TO_PAPAGO_LANG: Record<string, PapagoTargetLang> = {
  JP: 'ja',
  CN: 'zh-CN',
  TW: 'zh-TW',
  HK: 'zh-TW',
  MO: 'zh-TW',
  VN: 'vi',
  TH: 'th',
  ID: 'id',
  FR: 'fr',
  MC: 'fr',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  RU: 'ru',
  BY: 'ru',
  DE: 'de',
  AT: 'de',
  IT: 'it',
};

/**
 * 역지오코딩으로 얻은 국가 코드를 어휘 번역 대상 언어로 변환한다.
 * 매핑되지 않은 국가는 en(영어)으로 폴백한다.
 */
export const countryCodeToPapagoLang = (countryCode?: string | null): PapagoTargetLang => {
  if (!countryCode) {
    return DEFAULT_PAPAGO_TARGET_LANG;
  }
  return normalizePapagoTargetLang(COUNTRY_TO_PAPAGO_LANG[countryCode.toUpperCase()]);
};
