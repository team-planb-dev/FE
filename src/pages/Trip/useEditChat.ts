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
  NO_REPLY,
  REPLY_TIMEOUT_MS,
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

/** 백엔드가 서버 로그를 맞춰볼 수 있도록 시각을 남깁니다 */
const stamp = () => new Date().toLocaleTimeString("ko-KR", { hour12: false });

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
  /* 서버가 첫 입장 때 보내주는 안내 말풍선. 화면 맨 위 인사 자리를 채웁니다 */
  const [greeting, setGreeting] = useState<string[] | null>(null);
  /* 사용자가 한 번이라도 말을 걸었는지. 추천 칩을 언제 감출지 정합니다 */
  const [started, setStarted] = useState(false);
  /** 서버 응답을 기다리는 중 */
  const [busy, setBusy] = useState(false);
  /** CONFIRM · CANCEL 까지 끝난 상태 */
  const [done, setDone] = useState(false);

  const connection = useRef<ChatConnection | null>(null);
  const myId = useRef<number | null>(null);
  /** 방금 내가 보낸 문장. 서버가 그대로 돌려줄 때 두 번 그리지 않으려고 둡니다 */
  const lastSent = useRef<string | null>(null);
  const startedRef = useRef(false);
  /* 답을 기다리는 타이머. 서버가 조용하면 무한 로딩 대신 사유를 보여줍니다 */
  const waitTimer = useRef<number | null>(null);

  const stopWaiting = useCallback(() => {
    if (waitTimer.current !== null) {
      window.clearTimeout(waitTimer.current);
      waitTimer.current = null;
    }
  }, []);

  const startWaiting = useCallback(() => {
    stopWaiting();
    waitTimer.current = window.setTimeout(() => {
      waitTimer.current = null;
      if (import.meta.env.DEV)
        console.log(`[CHAT] ${stamp()} 응답 없이 시간 초과`);
      setBusy(false);
      setEntries((prev) => [
        ...prev.filter((entry) => entry.kind !== "loading"),
        { id: nextId(), kind: "ai", text: NO_REPLY },
      ]);
    }, REPLY_TIMEOUT_MS);
  }, [stopWaiting]);

  const receive = useCallback(
    (message: SendChatMessageResponse) => {
      const type = message.type;
      /* ENTER · LEAVE 는 서버가 구독/해제 때 알리는 신호라 화면에 쓰지 않습니다 */
      if (type === "ENTER" || type === "LEAVE") {
        if (import.meta.env.DEV) console.log("[CHAT] 버림 — 입퇴장 신호");
        return;
      }

      const text = message.message?.trim() ?? "";
      const preview = message.editPreview;

      /* 내가 보낸 문장이 그대로 되돌아온 경우. 화면에는 이미 그려져 있습니다 */
      const isEcho =
        message.senderId !== null &&
        message.senderId === myId.current &&
        preview === null &&
        text === lastSent.current;

      if (isEcho) {
        if (import.meta.env.DEV)
          console.log("[CHAT] 버림 — 내가 보낸 것의 메아리");
        return;
      }

      /*
       * 사용자가 말을 걸기 전에 오는 메시지는 채팅방 입장 안내입니다.
       * 디자인에서 화면 맨 위에 고정으로 놓인 인사 자리라서, 대화 목록에
       * 쌓지 않고 그 자리를 채웁니다. 그냥 쌓으면 인사가 두 번 나옵니다
       */
      if (!startedRef.current && !preview) {
        if (text) setGreeting((prev) => [...(prev ?? []), text]);
        return;
      }

      stopWaiting();
      setBusy(false);
      setEntries((prev) => {
        const next = prev.filter((entry) => entry.kind !== "loading");
        if (text) next.push({ id: nextId(), kind: "ai", text });
        if (import.meta.env.DEV && preview && !hasPlan(preview)) {
          console.log("[CHAT] 수정안이 비어 있어 카드를 그리지 않습니다");
        }
        if (preview && hasPlan(preview)) {
          next.push({ id: nextId(), kind: "preview", preview, pending: true });
        }

        return next;
      });

      if (type === "CONFIRM" || type === "CANCEL") setDone(true);
    },
    [stopWaiting],
  );

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
      stopWaiting();
    };
  }, [travelId, receive, stopWaiting]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy || done) return;

      const conn = connection.current;
      if (!conn) return;

      if (import.meta.env.DEV) console.log(`[CHAT] ${stamp()} 전송`, text);
      lastSent.current = text;
      startedRef.current = true;
      setStarted(true);
      setEntries((prev) => [
        ...prev,
        { id: nextId(), kind: "user", text },
        { id: nextId(), kind: "loading", text: EDITING },
      ]);
      setBusy(true);
      startWaiting();

      if (!conn.send({ type: "TALK", message: text })) {
        stopWaiting();
        setBusy(false);
        setEntries((prev) => [
          ...prev.filter((entry) => entry.kind !== "loading"),
          { id: nextId(), kind: "ai", text: SEND_FAILED },
        ]);
      }
    },
    [busy, done, startWaiting, stopWaiting],
  );

  /** accept 면 CONFIRM(수정안 반영), 아니면 CANCEL(수정안 폐기) */
  const decide = useCallback(
    (accept: boolean) => {
      if (busy || done) return;

      const conn = connection.current;
      if (!conn) return;

      const label = accept ? KEEP_NEW : KEEP_OLD;
      if (import.meta.env.DEV) console.log(`[CHAT] ${stamp()} 전송`, label);
      lastSent.current = label;
      startedRef.current = true;
      setStarted(true);
      setEntries((prev) => [
        ...prev.map((entry) =>
          entry.kind === "preview" ? { ...entry, pending: false } : entry,
        ),
        { id: nextId(), kind: "user", text: label },
        { id: nextId(), kind: "loading", text: accept ? SAVING : CANCELLING },
      ]);
      setBusy(true);
      startWaiting();

      if (!conn.send({ type: accept ? "CONFIRM" : "CANCEL" })) {
        stopWaiting();
        setBusy(false);
        setEntries((prev) => [
          ...prev.filter((entry) => entry.kind !== "loading"),
          { id: nextId(), kind: "ai", text: SEND_FAILED },
        ]);
      }
    },
    [busy, done, startWaiting, stopWaiting],
  );

  return {
    entries,
    greeting,
    started,
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
