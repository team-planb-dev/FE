import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./TripEdit.css";

import Header from "../../components/Header/Header";
import Avatar from "../../components/Avatar/Avatar";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import ChatInput from "../../components/ChatInput/ChatInput";
import BtnWithIcon from "../../components/BtnWithIcon/BtnWithIcon";
import CompareCard from "../../components/CompareCard/CompareCard";
import EditNote from "../../components/EditNote/EditNote";
import Btn from "../../components/Btn/Btn";

import sparkleIcon from "../../assets/icn_sparkle.svg";
import sendIcon from "../../assets/icn_send.svg";

import { TRAVEL_THEME_LABEL } from "../../api/labels";
import type {
  EditPlanPreviewResponse,
  PlanDayDetail,
} from "../../api/schema";
import { PATHS, tripDetailPath } from "../../routes/paths";

import {
  ASK,
  COMPARE_THEME_FALLBACK,
  COMPARE_TITLE_FALLBACK,
  CONNECTING,
  DONE_LABEL,
  INPUT_PLACEHOLDER,
  KEEP_NEW,
  KEEP_OLD,
  LOGIN_LABEL,
  NO_TRAVEL,
  RETRY_LABEL,
  SUGGESTIONS,
  SUGGEST_TITLE,
  greetingOf,
} from "./editScript";
import { useEditChat } from "./useEditChat";

/** 카드에 쓸 대표 이미지. 일정 중 처음 나오는 사진을 씁니다 */
function coverOf(days: PlanDayDetail[] | null): string | undefined {
  for (const day of days ?? []) {
    for (const schedule of day.schedules ?? []) {
      const image = schedule.thumbNailImageUrl ?? schedule.imageUrl;
      if (image) return image;
    }
  }

  return undefined;
}

/** Before/After 카드에 넣을 값. 테마는 after 에 없어서 before 것을 같이 씁니다 */
function cardsOf(preview: EditPlanPreviewResponse) {
  const theme = preview.before?.travelTheme;
  const themeLabel = theme ? TRAVEL_THEME_LABEL[theme] : COMPARE_THEME_FALLBACK;

  return {
    themeLabel,
    before: {
      title: preview.before?.planName?.trim() || COMPARE_TITLE_FALLBACK,
      image: coverOf(preview.before?.planDays ?? null),
    },
    after: {
      title:
        preview.after?.planName?.trim() ||
        preview.before?.planName?.trim() ||
        COMPARE_TITLE_FALLBACK,
      image: coverOf(preview.after?.planDays ?? null),
    },
  };
}

/**
 * [S9] AI 일정 수정 대화.
 *
 * REST 가 아니라 STOMP(WebSocket)로 주고받습니다.
 * 보내는 것은 TALK · CONFIRM · CANCEL 세 가지뿐이고,
 * 수정안은 응답의 editPreview 로 옵니다.
 */
export default function TripEdit() {
  const navigate = useNavigate();
  const { travelId: idParam } = useParams();

  const travelId = useMemo(() => {
    const id = Number(idParam);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [idParam]);

  if (travelId === null) return <MissingTravel />;

  return <EditChat travelId={travelId} onDone={() => navigate(tripDetailPath(travelId))} />;
}

function MissingTravel() {
  const navigate = useNavigate();

  return (
    <div className="trip-edit">
      <Header className="trip-edit__header" onBack={() => navigate(-1)} />
      <div className="trip-edit__scroll">
        <div className="trip-edit__thread">
          <ChatBubble>{NO_TRAVEL}</ChatBubble>
        </div>
      </div>
    </div>
  );
}

function EditChat({
  travelId,
  onDone,
}: {
  travelId: number;
  onDone: () => void;
}) {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const {
    entries,
    status,
    error,
    needsLogin,
    nickname,
    busy,
    done,
    send,
    decide,
  } = useEditChat(travelId);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, status]);

  const submit = () => {
    send(text);
    setText("");
  };

  const started = entries.length > 0;

  return (
    <div className="trip-edit">
      <div className="trip-edit__glow" aria-hidden="true" />
      <Header className="trip-edit__header" onBack={() => navigate(-1)} />

      <div className="trip-edit__scroll" ref={scrollRef}>
        <div className="trip-edit__thread">
          <div className="trip-edit__intro">
            <Avatar />
            <div className="trip-edit__bubbles">
              <ChatBubble className="trip-edit__bubble--wide">
                {greetingOf(nickname)}
              </ChatBubble>
              <ChatBubble>{ASK}</ChatBubble>
            </div>
          </div>

          {status === "connecting" && (
            <ChatBubble variant="loading">{CONNECTING}</ChatBubble>
          )}

          {entries.map((entry) => {
            if (entry.kind === "preview") {
              const { themeLabel, before, after } = cardsOf(entry.preview);
              const changes = entry.preview.after?.changes ?? [];

              return (
                <div className="trip-edit__result" key={entry.id}>
                  <div className="trip-edit__compare">
                    <CompareCard
                      badge="Before"
                      title={before.title}
                      theme={themeLabel}
                      image={before.image}
                    />
                    <CompareCard
                      badge="After"
                      title={after.title}
                      theme={themeLabel}
                      image={after.image}
                    />
                  </div>

                  {changes.length > 0 && <EditNote items={changes} />}

                  {entry.pending && (
                    <>
                      <Btn
                        variant="accent"
                        size="md"
                        onClick={() => decide(true)}
                      >
                        {KEEP_NEW}
                      </Btn>
                      <Btn
                        variant="accent"
                        size="md"
                        onClick={() => decide(false)}
                      >
                        {KEEP_OLD}
                      </Btn>
                    </>
                  )}
                </div>
              );
            }

            if (entry.kind === "loading") {
              return (
                <ChatBubble variant="loading" key={entry.id}>
                  {entry.text}
                </ChatBubble>
              );
            }

            return (
              <ChatBubble variant={entry.kind} key={entry.id}>
                {entry.text}
              </ChatBubble>
            );
          })}

          {/* 서버가 사유를 주면 그대로 보여줍니다. 지어내면 진짜 원인을 덮습니다 */}
          {status === "error" && error && (
            <div className="trip-edit__result">
              <ChatBubble>{error}</ChatBubble>
              <Btn
                variant="accent"
                size="md"
                onClick={() =>
                  needsLogin ? navigate(PATHS.login) : navigate(0)
                }
              >
                {needsLogin ? LOGIN_LABEL : RETRY_LABEL}
              </Btn>
            </div>
          )}

          {done && (
            <Btn variant="accent" size="md" onClick={onDone}>
              {DONE_LABEL}
            </Btn>
          )}
        </div>
      </div>

      <div className="trip-edit__bottom">
        {!started && status !== "error" && (
          <div className="trip-edit__suggest">
            <p className="trip-edit__suggest-title">{SUGGEST_TITLE}</p>
            <div className="trip-edit__suggest-list">
              {SUGGESTIONS.map((label) => (
                <BtnWithIcon
                  key={label}
                  size="m"
                  label={label}
                  icon={sparkleIcon}
                  onClick={() => setText(label)}
                />
              ))}
            </div>
          </div>
        )}

        <ChatInput
          value={text}
          onChange={setText}
          onSend={submit}
          placeholder={INPUT_PLACEHOLDER}
          sendIcon={sendIcon}
          disabled={status !== "ready" || busy || done}
        />
      </div>
    </div>
  );
}
