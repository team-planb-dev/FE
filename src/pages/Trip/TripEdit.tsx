import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import {
  ASK,
  COMPARE_THEME,
  COMPARE_TITLE,
  EDITING,
  EDIT_DONE,
  EDIT_NOTES,
  GREETING,
  KEEP_NEW,
  KEEP_OLD,
  MOCK_DELAY_MS,
  SAVE_DONE,
  SAVING,
} from "./editScript";
import { PATHS } from "../../routes/paths";

/** 393:10987 */
const SUGGEST_TITLE = "이런 요청을 할 수 있어요";

/** 393:10989 / 393:10990 / 393:10991 — 디자인에 적힌 문구 그대로 */
const SUGGESTIONS = [
  "덜 걷고 싶어요",
  "정해진 시간에 식사하고 싶어요",
  "관광지 추천을 줄이고 싶어요",
];

/** 120:1144 */
const INPUT_PLACEHOLDER = "수정하고 싶은 일정을 구체적으로 알려주세요.";

/**
 * 대화가 어디까지 왔는지.
 *  intro   [9-1] 393:10977  — 인사 + 요청 예시
 *  editing [9-2] 393:10996  — 사용자가 요청을 보낸 직후
 *  result  [9-2] 393:11026  — 수정 결과(카드 + 수정 사항) + 선택지
 *  saving  [9-2] 393:11064  — 선택지를 고른 직후
 *  saved   [9-2] 393:11087  — 저장 완료
 */
type Stage = "intro" | "editing" | "result" | "saving" | "saved";

/**
 * Figma: [S9] 여행 일정 수정하기
 *  [9-1] AI 수정   (393:10977)     — intro
 *  [9-2] 빠른 수정 (393:10996 ~ 393:11110) — 같은 화면의 대화 진행 단계
 *
 * 7개 화면이 각각 다른 페이지가 아니라 **하나의 채팅 화면**입니다.
 * 사용자가 요청을 보내면 대화가 아래로 쌓입니다.
 *
 * ⚠ 개발 노트가 없어 정해지지 않은 것들(확인 필요 문서 참고)
 *   - 로딩 문구가 떠 있는 시간 → 임시로 1.2초
 *   - [9-2] 마지막 화면(393:11110)이 [8-1] 일정 화면입니다. 저장까지 끝났는데
 *     하단 바에 [수정하기]·[저장하기]가 그대로 있어 [8-3]이 맞아 보이지만
 *     디자인 그대로 [8-1](/trip/detail)로 보냈습니다.
 */
export default function TripEdit() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("intro");
  /** 사용자가 보낸 요청 문장 (393:11035) */
  const [request, setRequest] = useState("");
  /** 사용자가 고른 선택지 (393:11083) */
  const [choice, setChoice] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // 대화가 길어지면 항상 마지막이 보이게 합니다
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [stage]);

  // TODO(api): 보낸 내용을 AI 에 전달하고 실제 응답으로 대체하세요.
  const send = (value: string) => {
    const body = value.trim();
    if (body.length === 0) return;
    setRequest(body);
    setText("");
    setStage("editing");
    window.setTimeout(() => setStage("result"), MOCK_DELAY_MS);
  };

  // TODO(api): 선택 결과(새 일정 / 원래 일정)를 서버에 저장하세요.
  const pick = (label: string) => {
    setChoice(label);
    setStage("saving");
    window.setTimeout(() => setStage("saved"), MOCK_DELAY_MS);
  };

  const started = stage !== "intro";

  return (
    <div className="trip-edit">
      {/* Rectangle 12 (393:10978) — 390×320 초록 그라데이션 */}
      <div className="trip-edit__glow" aria-hidden="true" />

      {/* Header (393:10979) — 뒤로가기만 있는 기본형 */}
      <Header
        className="trip-edit__header"
        onBack={() => navigate(PATHS.tripDetail)}
      />

      {/* 393:11028 — x24 w342, 대화가 쌓이는 곳. 턴 사이 gap 40 */}
      <div className="trip-edit__scroll" ref={scrollRef}>
        <div className="trip-edit__thread">
          {/* 393:11029 — 아바타 + 인사 말풍선 2개, 세로 gap 20 */}
          <div className="trip-edit__intro">
            <Avatar />
            <div className="trip-edit__bubbles">
              <ChatBubble className="trip-edit__bubble--wide">
                {GREETING}
              </ChatBubble>
              <ChatBubble>{ASK}</ChatBubble>
            </div>
          </div>

          {/* 393:11034 — 보낸 요청 */}
          {started && <ChatBubble variant="user">{request}</ChatBubble>}

          {/* 393:11036 — 수정 결과 묶음, 세로 gap 12 */}
          {started && (
            <div className="trip-edit__result">
              {stage === "editing" ? (
                <ChatBubble variant="loading">{EDITING}</ChatBubble>
              ) : (
                <ChatBubble>{EDIT_DONE}</ChatBubble>
              )}

              {stage !== "editing" && (
                <>
                  {/* 393:12619 — 카드 두 장(240 + gap 12)이 342 를 넘어 가로 스크롤 */}
                  <div className="trip-edit__compare">
                    {/* TODO(api): 수정 전후 일정을 받아 채워주세요. */}
                    <CompareCard
                      badge="Before"
                      title={COMPARE_TITLE}
                      theme={COMPARE_THEME}
                    />
                    <CompareCard
                      badge="After"
                      title={COMPARE_TITLE}
                      theme={COMPARE_THEME}
                    />
                  </div>

                  <EditNote items={EDIT_NOTES} />
                </>
              )}

              {/* 393:11061 / 393:11062 — 고르면 사라집니다 */}
              {stage === "result" && (
                <>
                  <Btn
                    variant="accent"
                    size="md"
                    onClick={() => pick(KEEP_NEW)}
                  >
                    {KEEP_NEW}
                  </Btn>
                  <Btn
                    variant="accent"
                    size="md"
                    onClick={() => pick(KEEP_OLD)}
                  >
                    {KEEP_OLD}
                  </Btn>
                </>
              )}

              {/* 393:11082 — 고른 선택지가 사용자 말풍선으로 남습니다 */}
              {(stage === "saving" || stage === "saved") && (
                <ChatBubble variant="user">{choice}</ChatBubble>
              )}

              {/* 393:11084 / 393:11107 */}
              {stage === "saving" && (
                <ChatBubble variant="loading">{SAVING}</ChatBubble>
              )}
              {/* TODO(route): [9-2] 마지막 화면(393:11110)이 [8-1] 일정 화면인데
                  무엇을 눌러 넘어가는지 디자인에 없습니다. 지금은 헤더 화살표로만
                  돌아갑니다(확인 필요 문서 참고). */}
              {stage === "saved" && <ChatBubble>{SAVE_DONE}</ChatBubble>}
            </div>
          )}
        </div>
      </div>

      {/* 393:10985 — 요청 예시는 첫 화면에만 나옵니다 */}
      <div className="trip-edit__bottom">
        {!started && (
          <div className="trip-edit__suggest">
            <p className="trip-edit__suggest-title">{SUGGEST_TITLE}</p>

            {/* 393:10988 — 가로 gap 8, 넘치면 다음 줄 */}
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

        {/* chat (393:10992) — 390×120 */}
        <ChatInput
          value={text}
          onChange={setText}
          onSend={() => send(text)}
          placeholder={INPUT_PLACEHOLDER}
          sendIcon={sendIcon}
        />
      </div>
    </div>
  );
}
