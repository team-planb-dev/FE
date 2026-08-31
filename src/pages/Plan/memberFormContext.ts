import { createContext, useContext } from "react";

/**
 * [6-6] 신규 구성원 등록 플로우 동안만 살아 있는 상태.
 * 회원가입(SignupProvider)과 같은 방식입니다 — 단계가 많아 라우터 state 로 넘기면
 * 중간 화면들이 자기가 쓰지도 않는 값을 계속 들고 다녀야 합니다.
 *
 * Provider 는 MemberFormProvider.tsx 에 있습니다.
 * (컴포넌트와 훅이 한 파일에 있으면 Fast Refresh 가 깨져 파일을 나눴습니다.)
 */

/** 건강·생활조건을 고려할지 — 아직 고르지 않았으면 null */
export type ConsiderHealth = "yes" | "no" | null;

/** Figma 237:6863~6865 — 복수 선택 */
export const CONDITIONS = ["당뇨", "고혈압", "이상지질혈증"] as const;
export type Condition = (typeof CONDITIONS)[number];

/** Figma 237:6870~6872 — 단일 선택 */
export const WALK_LEVELS = [
  "많이 걸어도 좋아요",
  "보통 정도가 좋아요",
  "걷는 시간을 가능한 줄이고 싶어요",
] as const;
export type WalkLevel = (typeof WALK_LEVELS)[number];

export type MemberForm = {
  name: string;
  considerHealth: ConsiderHealth;
  /** 민감정보 수집·이용 동의 — considerHealth 가 "yes" 일 때만 필요합니다 */
  sensitiveAgreed: boolean;
  conditions: Condition[];
  walkLevel: WalkLevel | null;
};

export const EMPTY_MEMBER_FORM: MemberForm = {
  name: "",
  considerHealth: null,
  sensitiveAgreed: false,
  conditions: [],
  walkLevel: null,
};

export type MemberFormContextValue = {
  form: MemberForm;
  setField: <K extends keyof MemberForm>(key: K, value: MemberForm[K]) => void;
  toggleCondition: (condition: Condition) => void;
  reset: () => void;
};

export const MemberFormContext = createContext<MemberFormContextValue | null>(
  null,
);

export function useMemberForm() {
  const ctx = useContext(MemberFormContext);
  if (!ctx) {
    throw new Error(
      "useMemberForm 은 MemberFormProvider 안에서만 쓸 수 있습니다.",
    );
  }
  return ctx;
}
