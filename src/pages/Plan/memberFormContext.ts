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

/** 여행 중 챙겨야 하는 약이 있는지 — 아직 고르지 않았으면 null */
export type TakesMeds = "yes" | "no" | null;

/** Figma 237:6697~6699 — 단일 선택 */
export const MEDS_TIMINGS = [
  "특정 시간대에 먹어요",
  "식사를 기준으로 기억해요",
  "잘 모르겠어요",
] as const;
export type MedsTiming = (typeof MEDS_TIMINGS)[number];

/** Figma 237:6770 / 6780 / 6790 */
export const MEALS = ["아침", "점심", "저녁"] as const;
export type Meal = (typeof MEALS)[number];

/** Figma 237:6772~6775 — 식사 기준 복약 시점 */
export const MEAL_RELATIONS = ["식전", "식사 중", "식후", "무관"] as const;
export type MealRelation = (typeof MEAL_RELATIONS)[number];

/** 끼니별 설정 — 체크했는지와 식전/식후 중 무엇인지 */
export type MealMedsSetting = {
  checked: boolean;
  relation: MealRelation | null;
};

export const EMPTY_MEAL_MEDS: Record<Meal, MealMedsSetting> = {
  아침: { checked: false, relation: null },
  점심: { checked: false, relation: null },
  저녁: { checked: false, relation: null },
};

export type MemberForm = {
  name: string;
  considerHealth: ConsiderHealth;
  /** 민감정보 수집·이용 동의 — considerHealth 가 "yes" 일 때만 필요합니다 */
  sensitiveAgreed: boolean;
  conditions: Condition[];
  walkLevel: WalkLevel | null;
  takesMeds: TakesMeds;
  /** 일정에 표시할 약 이름 */
  medsLabel: string;
  medsTiming: MedsTiming | null;
  /** '특정 시간대에 먹어요' — 복약 시간 (237:6740) */
  medsTime: { meridiem: string; hour: string; minute: string };
  /** '식사를 기준으로 기억해요' — 끼니별 설정 (237:6763) */
  mealMeds: Record<Meal, MealMedsSetting>;
  /** 정확한 간격을 안내받았다면 — 분 (237:6796) */
  medsIntervalMinutes: string;
};

export const EMPTY_MEMBER_FORM: MemberForm = {
  name: "",
  considerHealth: null,
  sensitiveAgreed: false,
  conditions: [],
  walkLevel: null,
  takesMeds: null,
  medsLabel: "",
  medsTiming: null,
  medsTime: { meridiem: "", hour: "", minute: "" },
  mealMeds: EMPTY_MEAL_MEDS,
  medsIntervalMinutes: "",
};

export type MemberFormContextValue = {
  form: MemberForm;
  setField: <K extends keyof MemberForm>(key: K, value: MemberForm[K]) => void;
  toggleCondition: (condition: Condition) => void;
  setMealMeds: (meal: Meal, patch: Partial<MealMedsSetting>) => void;
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
