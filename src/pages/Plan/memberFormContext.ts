import { createContext, useContext } from "react";

import type { TimeValue } from "../../components/TimeSelect/TimeSelect";

/** 구성원 등록 폼 컨텍스트 */
export type ConsiderHealth = "yes" | "no" | null;

export const CONDITIONS = ["당뇨", "고혈압", "이상지질혈증"] as const;
export type Condition = (typeof CONDITIONS)[number];

export const WALK_LEVELS = [
  "많이 걸어도 좋아요",
  "보통 정도가 좋아요",
  "걷는 시간을 가능한 줄이고 싶어요",
] as const;
export type WalkLevel = (typeof WALK_LEVELS)[number];

export type TakesMeds = "yes" | "no" | null;

export const MEDS_TIMINGS = [
  "특정 시간대에 먹어요",
  "식사를 기준으로 기억해요",
  "잘 모르겠어요",
] as const;
export type MedsTiming = (typeof MEDS_TIMINGS)[number];

export const MEALS = ["아침", "점심", "저녁"] as const;
export type Meal = (typeof MEALS)[number];

export const MEAL_RELATIONS = ["식전", "식사 중", "식후", "무관"] as const;
export type MealRelation = (typeof MEAL_RELATIONS)[number];

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
  sensitiveAgreed: boolean;
  conditions: Condition[];
  walkLevel: WalkLevel | null;
  takesMeds: TakesMeds;
  medsLabel: string;
  medsTiming: MedsTiming | null;
  medsTime: { meridiem: string; hour: string; minute: string };
  mealMeds: Record<Meal, MealMedsSetting>;
  medsIntervalMinutes: string;
  reflectMealtime: "yes" | "no" | null;
  mealTimes: Record<Meal, { checked: boolean; time: TimeValue }>;
  hasAllergy: "yes" | "no" | null;
  allergyText: string;
  hasDislikedFood: "yes" | "no" | null;
  dislikedFoodText: string;
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
  reflectMealtime: null,
  mealTimes: {
    아침: { checked: false, time: { meridiem: "", hour: "", minute: "" } },
    점심: { checked: false, time: { meridiem: "", hour: "", minute: "" } },
    저녁: { checked: false, time: { meridiem: "", hour: "", minute: "" } },
  },
  hasAllergy: null,
  allergyText: "",
  hasDislikedFood: null,
  dislikedFoodText: "",
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
