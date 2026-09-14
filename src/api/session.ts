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

    void ensureSession().then((ok) => {
      if (alive) setStatus(ok ? "authed" : "guest");
    });

    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return status;
}
