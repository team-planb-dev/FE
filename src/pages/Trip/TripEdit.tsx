import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TripEdit.css";

import Header from "../../components/Header/Header";
import Avatar from "../../components/Avatar/Avatar";
import ChatBubble from "../../components/ChatBubble/ChatBubble";
import ChatInput from "../../components/ChatInput/ChatInput";
import BtnWithIcon from "../../components/BtnWithIcon/BtnWithIcon";

import sparkleIcon from "../../assets/icn_sparkle.svg";
import sendIcon from "../../assets/icn_send.svg";

import { PATHS } from "../../routes/paths";

/**
 * 393:8339 — 첫 말풍선. `{user}` `{이름}` 은 디자인의 플레이스홀더라
 * 실제 값이 정해질 때까지 임시 문구로 둡니다.
 * TODO(api): 로그인한 사용자 이름과 AI 이름을 받아 채워주세요.
 */
const GREETING = "안녕하세요. {user}님의\n여행 일정을 계획해줄 AI {이름}예요.";
const ASK = "일정을 어떻게 수정하고 싶나요?";

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
 * Figma: [9-1] AI 수정 (393:10977)
 *
 * [8-1]에서 [수정하기]를 누르면 들어오는 화면입니다.
 * 상단 320 은 초록 그라데이션(393:10978), 하단은 입력바(393:10992)입니다.
 *
 * ⚠ 개발 노트가 없습니다. 다음이 정해져 있지 않습니다(확인 필요 문서 참고).
 *   - 요청 예시 버튼을 누르면 바로 전송인지, 입력창에 채워 넣는 것인지
 *   - 헤더 화살표가 [8-1]로 돌아가는 것인지 홈인지
 *   여기서는 예시 버튼을 누르면 입력창에 채워 넣고, 화살표는 이전 화면으로 갑니다.
 */
export default function TripEdit() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  // TODO(api): 보낸 내용을 AI에 전달하고 [9-2]·[9-3] 대화로 이어가세요.
  const send = () => {
    if (text.trim().length === 0) return;
    setText("");
  };

  return (
    <div className="trip-edit">
      {/* Rectangle 12 (393:10978) — 390×320 초록 그라데이션 */}
      <div className="trip-edit__glow" aria-hidden="true" />

      {/* Header (393:10979) — 뒤로가기만 있는 기본형 */}
      <Header
        className="trip-edit__header"
        onBack={() => navigate(PATHS.tripDetail)}
      />

      {/* 393:10980 — x24 y94, w216, 세로 gap 20 */}
      <div className="trip-edit__intro">
        <Avatar />

        {/* 393:10982 — 세로 gap 12 */}
        <div className="trip-edit__bubbles">
          <ChatBubble className="trip-edit__bubble--wide">{GREETING}</ChatBubble>
          <ChatBubble>{ASK}</ChatBubble>
        </div>
      </div>

      {/* 393:10985 — y583, 세로 gap 20 */}
      <div className="trip-edit__bottom">
        {/* 393:10986 — padding 0/24, 세로 gap 12 */}
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

        {/* chat (393:10992) — 390×120 */}
        <ChatInput
          value={text}
          onChange={setText}
          onSend={send}
          placeholder={INPUT_PLACEHOLDER}
          sendIcon={sendIcon}
        />
      </div>
    </div>
  );
}
