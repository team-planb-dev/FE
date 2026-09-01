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

const SUGGEST_TITLE = "이런 요청을 할 수 있어요";

const SUGGESTIONS = [
  "덜 걷고 싶어요",
  "정해진 시간에 식사하고 싶어요",
  "관광지 추천을 줄이고 싶어요",
];

const INPUT_PLACEHOLDER = "수정하고 싶은 일정을 구체적으로 알려주세요.";

type Stage = "intro" | "editing" | "result" | "saving" | "saved";

/** AI 일정 수정 대화. stage 로 요청 → 결과 → 저장까지 진행합니다 */
export default function TripEdit() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [stage, setStage] = useState<Stage>("intro");

  const [request, setRequest] = useState("");

  const [choice, setChoice] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [stage]);

  const send = (value: string) => {
    const body = value.trim();
    if (body.length === 0) return;
    setRequest(body);
    setText("");
    setStage("editing");
    window.setTimeout(() => setStage("result"), MOCK_DELAY_MS);
  };

  const pick = (label: string) => {
    setChoice(label);
    setStage("saving");
    window.setTimeout(() => setStage("saved"), MOCK_DELAY_MS);
  };

  const started = stage !== "intro";

  return (
    <div className="trip-edit">
      <div className="trip-edit__glow" aria-hidden="true" />
      <Header
        className="trip-edit__header"
        onBack={() => navigate(PATHS.tripDetail)}
      />

      <div className="trip-edit__scroll" ref={scrollRef}>
        <div className="trip-edit__thread">
          <div className="trip-edit__intro">
            <Avatar />
            <div className="trip-edit__bubbles">
              <ChatBubble className="trip-edit__bubble--wide">
                {GREETING}
              </ChatBubble>
              <ChatBubble>{ASK}</ChatBubble>
            </div>
          </div>

          {started && <ChatBubble variant="user">{request}</ChatBubble>}

          {started && (
            <div className="trip-edit__result">
              {stage === "editing" ? (
                <ChatBubble variant="loading">{EDITING}</ChatBubble>
              ) : (
                <ChatBubble>{EDIT_DONE}</ChatBubble>
              )}

              {stage !== "editing" && (
                <>
                  <div className="trip-edit__compare">
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

              {(stage === "saving" || stage === "saved") && (
                <ChatBubble variant="user">{choice}</ChatBubble>
              )}

              {stage === "saving" && (
                <ChatBubble variant="loading">{SAVING}</ChatBubble>
              )}

              {stage === "saved" && <ChatBubble>{SAVE_DONE}</ChatBubble>}
            </div>
          )}
        </div>
      </div>

      <div className="trip-edit__bottom">
        {!started && (
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
          onSend={() => send(text)}
          placeholder={INPUT_PLACEHOLDER}
          sendIcon={sendIcon}
        />
      </div>
    </div>
  );
}
