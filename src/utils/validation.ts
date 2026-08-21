/**
 * 회원가입 이메일/비밀번호 유효성 검증 정책
 * 출처: Figma "정책 디스크립션 예시" > 회원가입 이메일/비밀번호 유효성 검증 정책 (65:340), V1.0
 */

/**
 * 이메일에 사용할 수 없는 문자.
 * 정책: "이메일 주소에는 공백이 포함될 수 없음.
 *        불법적인 문자 ( ) < > [ ] ; : , " 는 사용 불가."
 */
const EMAIL_FORBIDDEN = '\\s()<>\\[\\];:,"';

/**
 * 정책상 유효/무효 예시
 *  유효   user.name@example.com
 *  무효   username@          (도메인 누락)
 *  무효   @example.com       (로컬 부분 누락)
 *  무효   user@@example.com  (이중 '@' 사용)
 *
 * 도메인의 점(.) 요구는 "도메인 누락"을 막기 위한 해석입니다.
 * user@example 처럼 TLD가 없는 형태의 허용 여부는 정책에 명시되어 있지 않습니다.
 */
const EMAIL_PATTERN = new RegExp(
  `^[^${EMAIL_FORBIDDEN}@]+@[^${EMAIL_FORBIDDEN}@]+\\.[^${EMAIL_FORBIDDEN}@]+$`,
);

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

/** 정책: 비밀번호 길이 최소 8자 이상 */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * 정책: 문자 조합 규칙
 * "아래 3가지 유형 중 최소 2가지 이상을 반드시 포함해야 함.
 *  영자(대문자 또는 소문자) / 숫자(0-9) / 특수문자(예: !, @, #, $, %, ^, &, * 등)"
 *
 * 특수문자는 "등"으로 열려 있어 영숫자가 아닌 문자 전부로 해석했습니다.
 */
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
