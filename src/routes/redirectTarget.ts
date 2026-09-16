/*
 * 로그인 후 돌아갈 주소 보관소.
 *
 * 가드가 `Navigate` 의 state 로도 넘겨주지만, 그건 브라우저 히스토리에 얹히는
 * 값이라 로그인 화면에서 회원가입을 다녀오거나 주소를 다시 입력하면 사라집니다.
 * 탭 안에서만 사는 sessionStorage 에 같이 적어두고, 둘 중 있는 쪽을 씁니다.
 *
 * 시크릿 모드나 저장소 차단 환경에서는 접근만 해도 예외가 날 수 있어 전부 감쌉니다.
 */

const KEY = "planb.redirectAfterLogin";

/** 로그인·회원가입 화면으로 돌려보내면 무한히 맴돕니다 */
const BLOCKED = ["/login", "/signup", "/find-email", "/find-password"];

function isSafe(path: string): boolean {
  // 다른 사이트로 튕겨보내는 값이 들어오지 않도록 내부 경로만 받습니다
  if (!path.startsWith("/") || path.startsWith("//")) return false;

  return !BLOCKED.some((blocked) => path.startsWith(blocked));
}

export function rememberRedirect(path: string): void {
  if (!isSafe(path)) return;

  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // 저장이 막혀 있으면 Navigate 의 state 로만 갑니다
  }
}

/** 한 번 쓰고 비웁니다. 다음 로그인까지 남아 있으면 엉뚱한 곳으로 갑니다 */
export function takeRedirect(): string | null {
  try {
    const stored = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);

    return stored && isSafe(stored) ? stored : null;
  } catch {
    return null;
  }
}

export { isSafe as isSafeRedirect };
