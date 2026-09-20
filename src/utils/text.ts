/** 한글 조사 처리 */

/**
 * 앞말의 받침에 따라 목적격 조사(을/를)를 고릅니다.
 *
 * 문장을 서버가 통째로 주지 않고 화면에서 조립하기 때문에 필요합니다.
 * 한글 음절이 아닌 글자로 끝나면 "를" 로 둡니다.
 */
export function objectParticle(word: string): string {
  const last = word.trim().slice(-1);
  if (!last) return "를";

  const code = last.charCodeAt(0);
  const isHangulSyllable = code >= 0xac00 && code <= 0xd7a3;
  if (!isHangulSyllable) return "를";

  return (code - 0xac00) % 28 === 0 ? "를" : "을";
}
