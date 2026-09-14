/*
 * 로그인 · 로그아웃 · 토큰 재발급.
 */

import {
  ApiRequestError,
  requestRaw,
  setRefreshHandler,
  request,
} from "./client";
import type { LoginResponse, ReissueResponse, UserAuthCache } from "./schema";
import {
  clearAccessToken,
  readTokenFromHeaders,
  setAccessToken,
} from "./tokenStore";

export const AUTH_PATH = {
  login: "/login",
  logout: "/logout",
  reissue: "/api/v1/refresh/reissue",
  me: "/api/v1/user/me",
} as const;

export class LoginFailedError extends Error {
  readonly errorCode: string | null;

  constructor(message: string, errorCode: string | null) {
    super(message);
    this.name = "LoginFailedError";
    this.errorCode = errorCode;
  }
}

/** CORS 에 exposedHeaders 가 빠져 토큰을 읽지 못한 경우 */
export class TokenNotExposedError extends Error {
  constructor() {
    super(
      "로그인은 됐지만 응답에서 인증 토큰을 읽지 못했어요. 서버 설정을 확인해야 합니다.",
    );
    this.name = "TokenNotExposedError";
  }
}

/**
 * 로그인.
 * 성공하면 Access Token 을 보관하고 body 를 돌려줍니다.
 */
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse | null> {
  const { response, payload } = await requestRaw(AUTH_PATH.login, {
    method: "POST",
    body: { username, password },
    auth: false,
  });

  if (!response.ok) {
    const error = errorOf(payload);
    throw new LoginFailedError(
      error?.message ?? "잘못된 이메일 또는 비밀번호입니다.",
      error?.errorCode ?? null,
    );
  }

  const envelope = payload as { success?: boolean; data?: LoginResponse } | null;
  if (envelope && envelope.success === false) {
    const error = errorOf(payload);
    throw new LoginFailedError(
      error?.message ?? "잘못된 이메일 또는 비밀번호입니다.",
      error?.errorCode ?? null,
    );
  }

  const token = readTokenFromHeaders(response.headers);
  if (!token) throw new TokenNotExposedError();

  setAccessToken(token);
  return envelope?.data ?? null;
}

/** 로그아웃. 서버 호출이 실패해도 클라이언트 상태는 비웁니다 */
export async function logout(): Promise<void> {
  try {
    await requestRaw(AUTH_PATH.logout, { method: "POST" });
  } finally {
    clearAccessToken();
  }
}

/**
 * refreshToken 쿠키로 Access Token 을 다시 받습니다.
 *
 * ⚠ 쿠키가 없거나 만료면 **HTTP 200 + `success: false`** 로 옵니다.
 */
export async function reissue(): Promise<boolean> {
  try {
    const { response, payload } = await requestRaw(AUTH_PATH.reissue, {
      method: "POST",
      auth: false,
    });

    if (!response.ok) {
      clearAccessToken();
      return false;
    }

    const envelope = payload as {
      success?: boolean;
      data?: ReissueResponse;
    } | null;

    if (!envelope?.success || !envelope.data?.accessToken) {
      clearAccessToken();
      return false;
    }

    setAccessToken(envelope.data.accessToken);
    return true;
  } catch {
    clearAccessToken();
    return false;
  }
}

/** 내 인증 정보. 새로고침 후 로그인 상태 확인에 씁니다 */
export function fetchMe(): Promise<UserAuthCache> {
  return request<UserAuthCache>(AUTH_PATH.me);
}

/**
 * 앱 시작 시 한 번 부릅니다.
 *  - 401 을 받으면 재발급 후 한 번 재시도하도록 client 에 연결합니다.
 *  - 새로고침으로 날아간 Access Token 을 쿠키로 복구합니다.
 *
 * 로그인 상태면 true 를 돌려줍니다.
 */
export async function restoreSession(): Promise<boolean> {
  setRefreshHandler(reissue);
  return reissue();
}

function errorOf(
  payload: unknown,
): { errorCode: string | null; message: string | null } | null {
  if (payload === null || typeof payload !== "object") return null;
  const candidate = (payload as Record<string, unknown>).error;
  if (candidate === null || typeof candidate !== "object") return null;

  const error = candidate as Record<string, unknown>;
  return {
    errorCode: typeof error.errorCode === "string" ? error.errorCode : null,
    message: typeof error.message === "string" ? error.message : null,
  };
}

export { ApiRequestError };
