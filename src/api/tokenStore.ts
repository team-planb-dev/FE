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
 * ⚠ 2026-09-14 현재 서버 설정이 엇갈려 있습니다.
 *   실제로 오는 헤더는 `Authorization: Bearer ...` 인데,
 *   CORS `access-control-expose-headers` 에는 `AccessToken` 이 적혀 있습니다.
 *   존재하지 않는 헤더를 노출하고 있어서 브라우저에서는 둘 다 읽히지 않습니다.
 *   백엔드가 노출 이름을 `Authorization` 으로 고치면 바로 동작합니다.
 *   어느 쪽으로 정리되든 되도록 두 이름을 모두 봅니다.
 */
const TOKEN_HEADER_NAMES = ["AccessToken", "Authorization"];

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
