import type { PlanStop } from "../../components/PlanCard/PlanCard";
import type { PlanGap } from "../../components/PlanSide/PlanSide";

/** 일정 타임라인 목업 데이터 */
export type PlanItem =
  | { type: "stop"; stop: PlanStop }
  | { type: "gap"; gap: PlanGap };

export function buildAiSummary(conditions: string[]) {
  return conditions.filter(Boolean).join(", ");
}

const DAY_1: PlanItem[] = [
  {
    type: "stop",
    stop: {
      id: "d1-1",
      kind: "food",
      name: "{장소 이름}",
      time: "AM 8:00 - 9:00",
      category: "식당",
      tags: ["알레르기 주의", "식사시간 반영", "탄수화물 참고"],
      recommendedMenu: "보리밥정식",
    },
  },
  {
    type: "gap",
    gap: { id: "d1-g1", label: "복약체크", parts: ["{00}분"] },
  },
  {
    type: "gap",
    gap: {
      id: "d1-g2",
      label: "이동시간",
      parts: ["{00}분", "·", "걷기 부담 낮음"],
    },
  },
  {
    type: "stop",
    stop: {
      id: "d1-2",
      kind: "sight",
      name: "{장소 이름}",
      time: "AM 8:00 - 9:00",
      category: "관광지",
      tags: ["역사문화", "걷기부담낮음", "짧은동선"],
    },
  },
  {
    type: "gap",
    gap: {
      id: "d1-g3",
      label: "이동시간",
      parts: ["{00}분", "·", "걷기 부담 낮음"],
    },
  },
  {
    type: "stop",
    stop: {
      id: "d1-3",
      kind: "food",
      name: "{장소 이름}",
      time: "AM 8:00 - 9:00",
      category: "식당",
      tags: ["알레르기 주의", "식사시간 반영", "탄수화물 참고"],
    },
  },
];

export const MOCK_PLAN_DAYS: PlanItem[][] = [DAY_1, DAY_1];

export function dayTabLabels(dayCount: number) {
  const names = ["첫째 날", "둘째 날", "셋째 날", "넷째 날"];
  return Array.from({ length: dayCount }, (_, i) => names[i] ?? `${i + 1}일차`);
}
