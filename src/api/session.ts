/**
 * 로그인 세션 상태.
 *
 * Access Token 은 메모리에만 있어서 새로고침하면 사라집니다.
 * 앱이 뜰 때 `refreshToken` 쿠키로 한 번 되살리고, 그 뒤로는
 * 401 을 받을 때마다 client 가 알아서 재발급합니다.
 */

import { useEffect, useState } from "react";

import { restoreSession } from "./auth";
import { getAccessToken, subscribeToken } from "./tokenStore";

export type SessionStatus = "loading" | "authed" | "guest";

/** 앱이 뜰 때 한 번만 복구합니다. 여러 번 불러도 같은 약속을 돌려줍니다 */
let bootstrap: Promise<boolean> | null = null;

export function ensureSession(): Promise<boolean> {
  bootstrap ??= restoreSession();
  return bootstrap;
}

/**
 * 로그인 상태를 구독합니다.
 * 첫 복구가 끝나면 authed·guest 로 바뀌고, 이후 로그인·로그아웃에도 따라갑니다.
 */
export function useSession(): SessionStatus {
  const [status, setStatus] = useState<SessionStatus>(() =>
    getAccessToken() ? "authed" : "loading",
  );

  useEffect(() => {
    let alive = true;

    const unsubscribe = subscribeToken((token) => {
      if (alive) setStatus(token ? "authed" : "guest");
    });

    /* ⚠ ensureSession 은 앱이 뜰 때 딱 한 번만 실행되고 결과를 캐시합니다.
     * 그래서 로그아웃 상태로 시작했다면 로그인한 뒤에 이 훅을 새로 부르는
     * 화면(보호 라우트)에서도 계속 false 를 돌려줍니다.
     * 캐시된 결과가 아니라 지금 토큰이 있는지로 판단해야 합니다 */
    void ensureSession().then(() => {
      if (alive) setStatus(getAccessToken() ? "authed" : "guest");
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return status;
}
