/**
 * Access Token 보관소.
 */

let accessToken: string | null = null;

type Listener = (token: string | null) => void;
const listeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  for (const listener of listeners) listener(token);
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

export function hasAccessToken(): boolean {
  return accessToken !== null;
}

/** 로그인 상태가 바뀔 때 알려줍니다. 해제 함수를 돌려줍니다 */
export function subscribeToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * 응답 헤더에서 Access Token 을 꺼냅니다.
 * 로그인 응답은 body 가 아니라 `Authorization` 헤더로 토큰을 내려줍니다.
 *
 * ⚠ 백엔드 CORS 에 `exposedHeaders: Authorization` 이 없으면 여기서 항상 null 이 나옵니다.
 */
export function readTokenFromHeaders(headers: Headers): string | null {
  const raw = headers.get("Authorization") ?? headers.get("authorization");
  if (!raw) return null;

  const trimmed = raw.trim();
  return trimmed.toLowerCase().startsWith("bearer ")
    ? trimmed.slice(7).trim()
    : trimmed;
}
