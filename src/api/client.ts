/*
 * API 호출 공통 래퍼.
 */

import type { ApiResult } from "./schema";
import { ERROR_CODE } from "./schema";
import { clearAccessToken, getAccessToken } from "./tokenStore";

export const BACKEND_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(
  /\/+$/,
  "",
);

/*
 * 개발에서는 Vite, 배포에서는 Vercel의 `/backend` 프록시를 사용합니다.
 * 브라우저가 API를 프론트와 같은 출처로 호출해야 refreshToken 쿠키가
 * 서드파티 쿠키로 차단되지 않습니다.
 */
export const API_BASE = "/backend";

const BASE_URL = API_BASE;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly errorCode: string | null;

  constructor(message: string, status: number, errorCode: string | null) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errorCode = errorCode;
  }

  /** 토큰이 없거나 만료된 경우 */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }
}

export type QueryValue = string | number | boolean | null | undefined;

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Authorization 헤더를 붙일지. 기본값 true */
  auth?: boolean;
  signal?: AbortSignal;
};

/* ─────────────── 401 처리 훅 ───────────────
 */

type RefreshHandler = () => Promise<boolean>;
let refreshHandler: RefreshHandler | null = null;
let inFlightRefresh: Promise<boolean> | null = null;

export function setRefreshHandler(handler: RefreshHandler | null): void {
  refreshHandler = handler;
}

/* ─────────────── 호출 ─────────────── */

/** ApiResult 봉투를 벗겨 data 를 돌려줍니다. success 가 false 면 throw 합니다 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { response, payload } = await send(path, options, true);
  return unwrap<T>(response, payload);
}

export async function requestRaw(
  path: string,
  options: RequestOptions = {},
): Promise<{ response: Response; payload: unknown }> {
  return send(path, options, false);
}

/* ─────────────── 내부 ─────────────── */

async function send(
  path: string,
  options: RequestOptions,
  allowRetry: boolean,
): Promise<{ response: Response; payload: unknown }> {
  const { method = "GET", body, query, auth = true, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(BASE_URL + buildPath(path, query), {
    method,
    headers,
    // refreshToken 쿠키를 주고받으려면 필요합니다
    credentials: "include",
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const payload = await readJson(response);

  /*
   * 토큰 문제로 보일 때만 한 번 재발급하고 재시도합니다.
   *
   * 401 은 만료된 Access Token 입니다.
   *
   * 403 은 두 가지가 섞여 있어 본문으로 가릅니다.
   *  - Security Filter 가 막은 경우: 본문이 비어 있습니다
   *    (2026-09-16 확인: 토큰 없이 `user/me` 를 부르면 401 이 아니라 403 + 빈 본문)
   *  - 권한 부족(남의 여행 조회 등): 서버가 ApiResult 에 사유를 담아 보냅니다
   *
   * 뒤쪽까지 재발급하면 Refresh Token 을 쓸데없이 회전시킵니다.
   * 이 서버는 회전한 새 토큰을 쿠키로 내려주지 않아서, 한 번 헛돌 때마다
   * 로그인이 풀립니다
   */
  const looksLikeMissingToken = response.status === 403 && payload === null;
  const needsToken = response.status === 401 || looksLikeMissingToken;
  if (needsToken && auth && allowRetry && refreshHandler) {
    const refreshed = await refreshOnce();
    if (refreshed) return send(path, options, false);
  }

  return { response, payload };
}

function unwrap<T>(response: Response, payload: unknown): T {
  const envelope = asEnvelope(payload);

  if (envelope) {
    if (envelope.success) return envelope.data as T;

    // 다른 기기에서 로그인해 이 세션이 끊긴 경우입니다. 재발급도 안 되므로 바로 비웁니다
    if (envelope.error?.errorCode === ERROR_CODE.sessionExpired) {
      clearAccessToken();
    }

    throw new ApiRequestError(
      envelope.error?.message ?? "요청을 처리하지 못했어요.",
      response.status,
      envelope.error?.errorCode ?? null,
    );
  }

  // 봉투가 아닌 응답 (Security Filter 등)
  if (!response.ok) {
    throw new ApiRequestError(
      `요청을 처리하지 못했어요. (${response.status})`,
      response.status,
      null,
    );
  }

  return payload as T;
}

function asEnvelope(payload: unknown): ApiResult<unknown> | null {
  if (payload === null || typeof payload !== "object") return null;
  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.success !== "boolean") return null;
  if (!("data" in candidate) && !("error" in candidate)) return null;
  return candidate as unknown as ApiResult<unknown>;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function buildPath(path: string, query?: Record<string, QueryValue>): string {
  if (!query) return path;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") continue;
    params.append(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `${path}?${serialized}` : path;
}

/** 동시에 여러 요청이 401 을 받아도 재발급은 한 번만 돕니다 */
function refreshOnce(): Promise<boolean> {
  if (!refreshHandler) return Promise.resolve(false);

  inFlightRefresh ??= refreshHandler().finally(() => {
    inFlightRefresh = null;
  });

  return inFlightRefresh;
}
