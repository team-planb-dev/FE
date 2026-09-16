/*
 * [S9] AI 일정 수정 대화 상태.
 *
 * 화면 진입 → 채팅방 조회 → STOMP 연결 → 구독까지 한 번에 처리하고,
 * 주고받은 말풍선 목록(entries)을 돌려줍니다.
 *
 * 서버에 지난 대화를 불러오는 API 가 없어서 들어올 때마다 새 대화로 시작합니다.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchMe } from "../../api/auth";
import { fetchTravelChatRoom } from "../../api/chat";
import { ApiRequestError } from "../../api/client";
import type {
  EditPlanPreviewResponse,
  SendChatMessageResponse,
} from "../../api/schema";
import { connectChat, type ChatConnection } from "../../api/stomp";

import {
  CANCELLING,
  EDITING,
  KEEP_NEW,
  KEEP_OLD,
  NEED_LOGIN,
  ROOM_FAILED,
  SAVING,
  SEND_FAILED,
} from "./editScript";

export type ChatEntry =
  | { id: string; kind: "ai" | "user" | "loading"; text: string }
  | {
      id: string;
      kind: "preview";
      preview: EditPlanPreviewResponse;
      /** 아직 저장/취소를 고르지 않았다면 true */
      pending: boolean;
    };

export type EditChatStatus = "connecting" | "ready" | "error";

let seq = 0;
const nextId = () => `entry-${(seq += 1)}`;

/** 수정안이 실제로 볼 만한 내용인지. 빈 미리보기는 카드로 그리지 않습니다 */
function hasPlan(preview: EditPlanPreviewResponse | null): boolean {
  if (!preview) return false;
  if (preview.after?.processable === false) return false;

  return (preview.after?.planDays?.length ?? 0) > 0;
}

/** 토큰이 없거나 죽었을 때. 이 백엔드는 본문 없는 403 으로 돌려줍니다 */
function isLoggedOut(caught: unknown): boolean {
  return (
    caught instanceof ApiRequestError &&
    (caught.isUnauthorized || caught.isForbidden)
  );
}

function messageOf(caught: unknown, fallback: string): string {
  if (caught instanceof ApiRequestError) {
    return caught.message.trim() || fallback;
  }

  return fallback;
}

export function useEditChat(travelId: number) {
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [status, setStatus] = useState<EditChatStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  /** 에러 원인이 로그인 풀림이면 다시 시도 대신 로그인으로 보냅니다 */
  const [needsLogin, setNeedsLogin] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  /** 서버 응답을 기다리는 중 */
  const [busy, setBusy] = useState(false);
  /** CONFIRM · CANCEL 까지 끝난 상태 */
  const [done, setDone] = useState(false);

  const connection = useRef<ChatConnection | null>(null);
  const myId = useRef<number | null>(null);
  /** 방금 내가 보낸 문장. 서버가 그대로 돌려줄 때 두 번 그리지 않으려고 둡니다 */
  const lastSent = useRef<string | null>(null);

  const receive = useCallback((message: SendChatMessageResponse) => {
    const type = message.type;
    /* ENTER · LEAVE 는 서버가 구독/해제 때 알리는 신호라 화면에 쓰지 않습니다 */
    if (type === "ENTER" || type === "LEAVE") return;

    const text = message.message?.trim() ?? "";
    const preview = message.editPreview;

    /* 내가 보낸 문장이 그대로 되돌아온 경우. 화면에는 이미 그려져 있습니다 */
    const isEcho =
      message.senderId !== null &&
      message.senderId === myId.current &&
      preview === null &&
      text === lastSent.current;

    if (isEcho) return;

    setBusy(false);
    setEntries((prev) => {
      const next = prev.filter((entry) => entry.kind !== "loading");
      if (text) next.push({ id: nextId(), kind: "ai", text });
      if (preview && hasPlan(preview)) {
        next.push({ id: nextId(), kind: "preview", preview, pending: true });
      }

      return next;
    });

    if (type === "CONFIRM" || type === "CANCEL") setDone(true);
  }, []);

  useEffect(() => {
    let alive = true;
    let opened: ChatConnection | null = null;

    const fail = (reason: string) => {
      if (!alive) return;
      setStatus("error");
      /* 처음 받은 사유가 진짜 원인입니다. 뒤따르는 연결 종료 메시지로 덮지 않습니다 */
      setError((prev) => prev ?? reason);
      setBusy(false);
    };

    void (async () => {
      try {
        const [me, room] = await Promise.all([
          fetchMe(),
          fetchTravelChatRoom(travelId),
        ]);
        if (!alive) return;

        myId.current = me.userId;
        setNickname(me.nickname);

        const roomId = room.chatRoomId;
        if (roomId === null) {
          fail(ROOM_FAILED);
          return;
        }

        opened = connectChat({
          roomId,
          onMessage: (message) => {
            if (alive) receive(message);
          },
          onReady: () => {
            if (alive) setStatus("ready");
          },
          onError: fail,
        });
        connection.current = opened;
      } catch (caught) {
        if (isLoggedOut(caught)) {
          if (alive) setNeedsLogin(true);
          fail(NEED_LOGIN);
          return;
        }

        fail(messageOf(caught, ROOM_FAILED));
      }
    })();

    return () => {
      alive = false;
      opened?.close();
      connection.current = null;
    };
  }, [travelId, receive]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy || done) return;

      const conn = connection.current;
      if (!conn) return;

      lastSent.current = text;
      setEntries((prev) => [
        ...prev,
        { id: nextId(), kind: "user", text },
        { id: nextId(), kind: "loading", text: EDITING },
      ]);
      setBusy(true);

      if (!conn.send({ type: "TALK", message: text })) {
        setBusy(false);
        setEntries((prev) => [
          ...prev.filter((entry) => entry.kind !== "loading"),
          { id: nextId(), kind: "ai", text: SEND_FAILED },
        ]);
      }
    },
    [busy, done],
  );

  /** accept 면 CONFIRM(수정안 반영), 아니면 CANCEL(수정안 폐기) */
  const decide = useCallback(
    (accept: boolean) => {
      if (busy || done) return;

      const conn = connection.current;
      if (!conn) return;

      const label = accept ? KEEP_NEW : KEEP_OLD;
      lastSent.current = label;
      setEntries((prev) => [
        ...prev.map((entry) =>
          entry.kind === "preview" ? { ...entry, pending: false } : entry,
        ),
        { id: nextId(), kind: "user", text: label },
        { id: nextId(), kind: "loading", text: accept ? SAVING : CANCELLING },
      ]);
      setBusy(true);

      if (!conn.send({ type: accept ? "CONFIRM" : "CANCEL" })) {
        setBusy(false);
        setEntries((prev) => [
          ...prev.filter((entry) => entry.kind !== "loading"),
          { id: nextId(), kind: "ai", text: SEND_FAILED },
        ]);
      }
    },
    [busy, done],
  );

  return {
    entries,
    status,
    error,
    needsLogin,
    nickname,
    busy,
    done,
    send,
    decide,
  };
}
