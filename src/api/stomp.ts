/*
 * STOMP over WebSocket — AI 일정 수정 대화용.
 */

import { Client } from "@stomp/stompjs";

import { STOMP } from "./endpoints";
import type { SendChatMessageRequest, SendChatMessageResponse } from "./schema";
import { getAccessToken } from "./tokenStore";

const HTTP_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

/* 핸드셰이크 자체가 막힌 경우와 서버가 STOMP 단계에서 거절한 경우를 구분합니다.
 * 앞쪽은 보통 서버의 WebSocket 허용 Origin 설정 문제입니다 */
const HANDSHAKE_REFUSED = "대화 서버가 연결을 거부했어요.";
const CONNECT_FAILED = "대화 서버에 연결하지 못했어요.";
const DISCONNECTED = "연결이 끊어졌어요. 다시 시도해주세요.";
const NO_TOKEN = "로그인이 필요해요.";

/** https → wss, http → ws */
function socketUrl(): string {
  const base = HTTP_BASE || window.location.origin;
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
  });

  client.onConnect = () => {
    client.subscribe(STOMP.subscribe(roomId), (frame) => {
      const parsed = parseMessage(frame.body);
      if (parsed) onMessage(parsed);
    });
    onReady();
  };

  /* 서버가 거절한 이유(CHATROOM_NOT_FOUND, SUBSCRIBER_NOT_MATCHED 등)는
   * ERROR 프레임 헤더에 담겨 옵니다. 지어내지 말고 그대로 보여줍니다 */
  client.onStompError = (frame) => {
    const reason = frame.headers.message?.trim() || frame.body.trim();
    fail(reason || CONNECT_FAILED);
  };

  client.onWebSocketError = () => fail(HANDSHAKE_REFUSED);
  client.onWebSocketClose = () => fail(DISCONNECTED);

  if (token) {
    client.activate();
  } else {
    window.setTimeout(() => fail(NO_TOKEN), 0);
  }

  return {
    send: (body) => {
      if (closed || !client.connected) return false;

      client.publish({
        destination: STOMP.publish(roomId),
        body: JSON.stringify(body),
      });
      return true;
    },
    close: () => {
      closed = true;
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
