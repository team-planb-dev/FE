/** [S9] AI 일정 수정 대화 문구 */

const NAME_FALLBACK = "여행자";

/** AI 이름. 디자인 시안의 {이름} 자리입니다 */
export const AI_NAME = "여로";

export const greetingOf = (nickname: string | null) =>
  `안녕하세요. ${nickname?.trim() || NAME_FALLBACK}님의\n여행 일정을 계획해줄 AI ${AI_NAME}예요.`;

export const ASK = "일정을 어떻게 수정하고 싶나요?";

export const CONNECTING = "대화를 준비하고 있어요..";

export const EDITING = "일정을 수정중이에요..";

export const SAVING = "일정을 저장중이에요..";

export const CANCELLING = "원래 일정으로 되돌리는 중이에요..";

export const KEEP_NEW = "이 일정으로 저장할게요";
export const KEEP_OLD = "원래 일정으로 저장할게요";

export const SUGGEST_TITLE = "이런 요청을 할 수 있어요";

export const SUGGESTIONS = [
  "덜 걷고 싶어요",
  "정해진 시간에 식사하고 싶어요",
  "관광지 추천을 줄이고 싶어요",
];

export const INPUT_PLACEHOLDER = "수정하고 싶은 일정을 구체적으로 알려주세요.";

export const COMPARE_TITLE_FALLBACK = "여행 일정";
export const COMPARE_THEME_FALLBACK = "여행 테마";

export const DONE_LABEL = "일정 보러가기";
export const RETRY_LABEL = "다시 시도하기";
export const LOGIN_LABEL = "로그인하러 가기";

/* 실패 문구 — 서버가 사유를 주면 그걸 쓰고, 없을 때만 이걸 씁니다 */
export const ROOM_FAILED = "대화방을 열지 못했어요.";
export const SEND_FAILED = "아직 연결 중이에요. 잠시 후 다시 보내주세요.";
export const NO_REPLY = "답이 오지 않았어요. 잠시 후 다시 시도해주세요.";

/** 이 시간이 지나도 응답이 없으면 무한 로딩 대신 사유를 보여줍니다 */
export const REPLY_TIMEOUT_MS = 150_000;
export const NO_TRAVEL = "수정할 일정을 찾을 수 없어요.";
export const NEED_LOGIN = "로그인이 풀렸어요. 다시 로그인해주세요.";
