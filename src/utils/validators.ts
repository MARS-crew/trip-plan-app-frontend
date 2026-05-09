/**
 * Validation Utilities
 * 이메일, 비밀번호, 텍스트 검증 함수 모음
 */

// 정규표현식 상수들
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^01[0-9]-?\d{3,4}-?\d{4}$/;
export const KOREAN_NAME_REGEX = /^[가-힣]+$/;

/**
 * 이메일 유효성을 검사합니다
 * @example isValidEmail("test@example.com") => true
 * @example isValidEmail("invalid.email") => false
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

/**
 * 비밀번호 유효성을 검사합니다
 * 조건: 영문, 숫자, 특수문자 포함, 최소 8자
 * @example isValidPassword("Test1234!") => true
 * @example isValidPassword("test1234") => false (특수문자 없음)
 */
export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
};

/**
 * 비밀번호가 특정 요구사항을 만족하는지 상세히 검사합니다
 * @example validatePasswordStrength("Test1234!")
 * => { isValid: true, hasUpperCase: true, hasLowerCase: true, hasNumber: true, hasSpecial: true, minLength: true }
 */
export const validatePasswordStrength = (password: string) => {
  return {
    isValid: isValidPassword(password),
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    minLength: password.length >= 8,
  };
};

/**
 * 휴대폰 번호 유효성을 검사합니다
 * @example isValidPhoneNumber("010-1234-5678") => true
 * @example isValidPhoneNumber("01012345678") => true
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  return PHONE_REGEX.test(phone);
};

/**
 * 한글 이름 유효성을 검사합니다
 * @example isValidKoreanName("김철수") => true
 * @example isValidKoreanName("Kim123") => false
 */
export const isValidKoreanName = (name: string): boolean => {
  return KOREAN_NAME_REGEX.test(name.trim());
};

/**
 * 일반적인 이름 유효성을 검사합니다 (한글, 영문, 공백만 허용)
 * @example isValidName("김철수") => true
 * @example isValidName("John Doe") => true
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z가-힣\s]+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

/**
 * 닉네임 유효성을 검사합니다 (2-20자, 영문/숫자/한글 허용)
 * @example isValidNickname("User123") => true
 * @example isValidNickname("A") => false (1자)
 * @example isValidNickname("User@123") => false (특수문자)
 */
export const isValidNickname = (nickname: string): boolean => {
  const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;
  return nicknameRegex.test(nickname.trim());
};

/**
 * 사용자 ID 유효성을 검사합니다 (4-20자, 영문/숫자만, 영문으로 시작)
 * @example isValidUserId("user1234") => true
 * @example isValidUserId("123user") => false (숫자로 시작)
 * @example isValidUserId("usr") => false (3자 미만)
 */
export const isValidUserId = (userId: string): boolean => {
  const userIdRegex = /^[a-zA-Z][a-zA-Z0-9]{3,19}$/;
  return userIdRegex.test(userId.trim());
};

/**
 * 생년월일이 유효한지 검사합니다
 * @example isValidBirthDate("1990-01-15") => true
 * @example isValidBirthDate("2025-01-15") => false (미래 날짜)
 */
export const isValidBirthDate = (dateStr: string): boolean => {
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(regex);

  if (!match) return false;

  const [_, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr);
  const month = parseInt(monthStr);
  const day = parseInt(dayStr);

  // 날짜 범위 확인
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  // 실제 날짜인지 확인
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return false;
  }

  // 미래 날짜 확인
  if (date > new Date()) return false;

  return true;
};

/**
 * URL 유효성을 검사합니다
 * @example isValidUrl("https://example.com") => true
 * @example isValidUrl("not a url") => false
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 문자열이 비어있지 않은지 확인합니다 (공백 제거 후)
 * @example isNotEmpty("  test  ") => true
 * @example isNotEmpty("   ") => false
 */
export const isNotEmpty = (text: string): boolean => {
  return text.trim().length > 0;
};

/**
 * 문자열의 길이가 범위 내인지 확인합니다
 * @example isLengthInRange("test", 2, 10) => true
 * @example isLengthInRange("a", 2, 10) => false
 */
export const isLengthInRange = (text: string, min: number, max: number): boolean => {
  const length = text.trim().length;
  return length >= min && length <= max;
};

/**
 * 비밀번호와 비밀번호 확인이 일치하는지 검사합니다
 * @example isPasswordMatching("Password123!", "Password123!") => true
 */
export const isPasswordMatching = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * 숫자만 포함하는지 확인합니다
 * @example isNumeric("12345") => true
 * @example isNumeric("123a5") => false
 */
export const isNumeric = (text: string): boolean => {
  return /^\d+$/.test(text);
};

/**
 * 여러 필드의 유효성을 한 번에 검사합니다
 * @example validateMultiple({
 *   email: { value: "test@example.com", validator: isValidEmail },
 *   password: { value: "Pass1234!", validator: isValidPassword }
 * })
 * => { isValid: true, errors: {} }
 */
export const validateMultiple = (
  fields: Record<string, { value: string; validator: (val: string) => boolean }>,
): { isValid: boolean; errors: Record<string, boolean> } => {
  const errors: Record<string, boolean> = {};

  Object.entries(fields).forEach(([key, { value, validator }]) => {
    if (!validator(value)) {
      errors[key] = true;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
