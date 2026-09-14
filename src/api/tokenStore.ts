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
 * 응답 헤더에서 Access Token 을 꺼냅니다. 로그인 응답은 body 가 아니라 헤더로 줍니다.
 *
 * 서버는 `Authorization: Bearer ...` 로 내려줍니다.
 * 2026-09-14 이전에는 CORS 노출 이름이 `AccessToken` 으로 엇갈려 있어 읽히지 않았고,
 * 지금은 `Authorization` 으로 고쳐졌습니다. 옛 이름도 폴백으로 남겨둡니다.
 */
const TOKEN_HEADER_NAMES = ["Authorization", "AccessToken"];

export function readTokenFromHeaders(headers: Headers): string | null {
  for (const name of TOKEN_HEADER_NAMES) {
    const raw = headers.get(name)?.trim();
    if (!raw) continue;

    return raw.toLowerCase().startsWith("bearer ")
      ? raw.slice(7).trim()
      : raw;
  }

  return null;
}
