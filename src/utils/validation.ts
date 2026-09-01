const EMAIL_FORBIDDEN = '\\s()<>\\[\\];:,"';

const EMAIL_PATTERN = new RegExp(
  `^[^${EMAIL_FORBIDDEN}@]+@[^${EMAIL_FORBIDDEN}@]+\\.[^${EMAIL_FORBIDDEN}@]+$`,
);

/** 이메일·비밀번호 검증 */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

/** 비밀번호 최소 길이 */
export const PASSWORD_MIN_LENGTH = 8;

/** 영자 / 숫자 / 특수문자 중 최소 2가지 포함 */
export const PASSWORD_MIN_CHAR_TYPES = 2;

export function countPasswordCharTypes(password: string): number {
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return [hasLetter, hasDigit, hasSpecial].filter(Boolean).length;
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    countPasswordCharTypes(password) >= PASSWORD_MIN_CHAR_TYPES
  );
}
