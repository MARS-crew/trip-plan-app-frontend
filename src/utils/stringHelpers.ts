/**
 * String Utilities
 * 문자열 처리 함수 모음
 */

/**
 * 문자열의 첫 글자를 대문자로 변환합니다
 * @example capitalize("hello") => "Hello"
 * @example capitalize("") => ""
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 문자열을 snakeCase로 변환합니다
 * @example toSnakeCase("HelloWorld") => "hello_world"
 * @example toSnakeCase("helloWorld") => "hello_world"
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
};

/**
 * 문자열을 camelCase로 변환합니다
 * @example toCamelCase("hello_world") => "helloWorld"
 * @example toCamelCase("hello-world") => "helloWorld"
 */
export const toCamelCase = (str: string): string => {
  return str
    .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
};

/**
 * 문자열을 PascalCase로 변환합니다
 * @example toPascalCase("hello_world") => "HelloWorld"
 */
export const toPascalCase = (str: string): string => {
  return str
    .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toUpperCase());
};

/**
 * 문자열을 kebab-case로 변환합니다
 * @example toKebabCase("HelloWorld") => "hello-world"
 * @example toKebabCase("hello_world") => "hello-world"
 */
export const toKebabCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[_\s]/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
};

/**
 * 문자열을 트림하고 중복 공백을 제거합니다
 * @example trimAndNormalize("  hello   world  ") => "hello world"
 */
export const trimAndNormalize = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

/**
 * 텍스트를 지정된 길이로 잘라내고 생략부호를 추가합니다
 * @example truncate("Hello World", 8) => "Hello..."
 * @example truncate("Hi", 8) => "Hi"
 */
export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

/**
 * 문자열에서 특수문자를 제거합니다
 * @example removeSpecialChars("Hello@World#!") => "HelloWorld"
 */
export const removeSpecialChars = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9가-힣\s]/g, '');
};

/**
 * 문자열에서 숫자만 추출합니다
 * @example extractNumbers("Phone: 010-1234-5678") => "01012345678"
 */
export const extractNumbers = (str: string): string => {
  return str.replace(/\D/g, '');
};

/**
 * 문자열을 반복합니다
 * @example repeat("ha", 3) => "hahaha"
 */
export const repeat = (str: string, count: number): string => {
  return str.repeat(count);
};

/**
 * 문자열을 역순으로 반환합니다
 * @example reverse("hello") => "olleh"
 */
export const reverse = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * 문자열에서 공백을 모두 제거합니다
 * @example removeWhitespace("  hello   world  ") => "helloworld"
 */
export const removeWhitespace = (str: string): string => {
  return str.replace(/\s/g, '');
};

/**
 * 문자열에 마스킹을 적용합니다
 * @example maskString("password123", 3, "*") => "***word123"
 * @example maskString("test@email.com", 4, "*") => "****@email.com"
 */
export const maskString = (
  str: string,
  visibleChars: number = 0,
  maskChar: string = '*',
): string => {
  if (str.length <= visibleChars) return str;
  return maskChar.repeat(str.length - visibleChars) + str.slice(-visibleChars);
};

/**
 * 휴대폰 번호를 포맷합니다
 * @example formatPhoneNumber("01012345678") => "010-1234-5678"
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = extractNumbers(phone);
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

/**
 * 문자열에서 첫 단어를 추출합니다
 * @example getFirstWord("Hello World") => "Hello"
 * @example getFirstWord("") => ""
 */
export const getFirstWord = (str: string): string => {
  return trimAndNormalize(str).split(' ')[0] || '';
};

/**
 * 문자열에서 마지막 단어를 추출합니다
 * @example getLastWord("Hello World") => "World"
 */
export const getLastWord = (str: string): string => {
  const words = trimAndNormalize(str).split(' ');
  return words[words.length - 1] || '';
};

/**
 * 비슷한 정도를 계산합니다 (0-1, 1에 가까울수록 유사)
 * Levenshtein 거리 기반
 */
export const stringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Levenshtein 거리를 계산합니다
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const distances: number[][] = [];

  for (let i = 0; i <= str1.length; i++) {
    distances[i] = [i];
  }

  for (let j = 0; j <= str2.length; j++) {
    distances[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        distances[i][j] = distances[i - 1][j - 1];
      } else {
        distances[i][j] = Math.min(
          distances[i - 1][j - 1] + 1,
          distances[i][j - 1] + 1,
          distances[i - 1][j] + 1,
        );
      }
    }
  }

  return distances[str1.length][str2.length];
};
