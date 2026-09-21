/*
 * STOMP over WebSocket — AI 일정 수정 대화용.
 */

import { Client } from "@stomp/stompjs";

import { API_BASE, BACKEND_BASE } from "./client";
import { STOMP } from "./endpoints";
import type { SendChatMessageRequest, SendChatMessageResponse } from "./schema";
import { getAccessToken } from "./tokenStore";

/* 핸드셰이크 자체가 막힌 경우와 서버가 STOMP 단계에서 거절한 경우를 구분합니다.
 * 앞쪽은 보통 서버의 WebSocket 허용 Origin 설정 문제입니다 */
/* 괄호 안 코드는 어느 단계에서 막혔는지 구분하려고 붙입니다.
 * 화면 캡처 한 장만 받아도 원인을 가를 수 있어야 합니다 */
const HANDSHAKE_REFUSED = "대화 서버가 연결을 거부했어요. (WS-REFUSED)";
const CONNECT_FAILED = "대화 서버에 연결하지 못했어요. (WS-ERROR)";
const CONNECT_TIMEOUT = "대화 서버가 응답하지 않아요. (WS-TIMEOUT)";
const DISCONNECTED = "연결이 끊어졌어요. 다시 시도해주세요. (WS-CLOSED)";
const NO_TOKEN = "로그인이 필요해요. (NO-TOKEN)";

/** 이 시간 안에 연결이 열리지 않으면 실패로 봅니다 */
const CONNECT_TIMEOUT_MS = 10_000;

/** https → wss, http → ws */
function socketUrl(): string {
  /* Vercel의 rewrite는 WebSocket 프록시가 아니므로 배포에서는 Railway에
   * 직접 연결하고, 개발 환경만 Vite의 ws 프록시를 사용합니다. */
  const base = import.meta.env.DEV
    ? window.location.origin + API_BASE
    : BACKEND_BASE || window.location.origin;

  return `${base.replace(/^http/, "ws")}${STOMP.endpoint}`;
}

export type ChatConnection = {
  /** 연결이 아직 안 열렸으면 false 를 돌려줍니다 */
  send: (body: SendChatMessageRequest) => boolean;
  close: () => void;
};

export type ChatHandlers = {
  roomId: number;
  onMessage: (message: SendChatMessageResponse) => void;
  onReady: () => void;
  onError: (message: string) => void;
};

export function connectChat({
  roomId,
  onMessage,
  onReady,
  onError,
}: ChatHandlers): ChatConnection {
  const token = getAccessToken();
  let closed = false;

  const fail = (message: string) => {
    if (!closed) onError(message);
  };

  const client = new Client({
    brokerURL: socketUrl(),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 0,
    /*
     * 개발 중에는 주고받는 STOMP 프레임을 콘솔에 남깁니다.
     * 답이 안 올 때 보낸 게 갔는지부터 확인할 수 있어야 합니다.
     *
     * ⚠ undefined 를 넘기면 안 됩니다. Client 는 설정 객체를 그대로 덮어써서
     *   기본 debug 함수까지 지워지고, _connect() 가 소켓을 만들기 전에
     *   this.debug(...) 에서 터집니다. 배포 빌드에서만 나던 증상입니다
     */
    debug: import.meta.env.DEV
      ? (line) => console.log("[STOMP]", line)
      : () => {},
  });

  /* 소켓이 열리지도, 에러를 내지도 않으면 화면이 "연결 대기" 에 갇힙니다.
   * 사유와 다시 시도를 보여줄 수 있게 시간을 끊습니다 */
  let timer: number | null = window.setTimeout(() => {
    timer = null;
    fail(CONNECT_TIMEOUT);
  }, CONNECT_TIMEOUT_MS);

  const stopTimer = () => {
    if (timer === null) return;
    window.clearTimeout(timer);
    timer = null;
  };

  client.onConnect = () => {
    stopTimer();
    client.subscribe(STOMP.subscribe(roomId), (frame) => {
      const parsed = parseMessage(frame.body);
      if (parsed) onMessage(parsed);
    });
    onReady();
  };

  /* 서버가 거절한 이유(CHATROOM_NOT_FOUND, SUBSCRIBER_NOT_MATCHED 등)는
   * ERROR 프레임 헤더에 담겨 옵니다. 지어내지 말고 그대로 보여줍니다 */
  client.onStompError = (frame) => {
    stopTimer();
    const reason = frame.headers.message?.trim() || frame.body.trim();
    fail(reason ? `${reason} (STOMP-ERROR)` : CONNECT_FAILED);
  };

  client.onWebSocketError = () => {
    stopTimer();
    fail(HANDSHAKE_REFUSED);
  };

  client.onWebSocketClose = () => {
    stopTimer();
    fail(DISCONNECTED);
  };

  if (token) {
    client.activate();
  } else {
    stopTimer();
    window.setTimeout(() => fail(NO_TOKEN), 0);
  }

  return {
    send: (body) => {
      if (closed || !client.connected) return false;

      client.publish({
        destination: STOMP.publish(roomId),
        /* CONNECT 에서 이미 검증하지만, 스웨거가 SEND 에도 Authorization 을
         * 필수로 표시해둬서 같이 실어 보냅니다 */
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify(body),
      });
      return true;
    },
    close: () => {
      closed = true;
      stopTimer();
      void client.deactivate();
    },
  };
}

function parseMessage(body: string): SendChatMessageResponse | null {
  try {
    const value: unknown = JSON.parse(body);
    if (value === null || typeof value !== "object") return null;

    return value as SendChatMessageResponse;
  } catch {
    return null;
  }
}
