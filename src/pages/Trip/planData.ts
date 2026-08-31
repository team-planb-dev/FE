import type { PlanStop } from "../../components/PlanCard/PlanCard";
import type { PlanGap } from "../../components/PlanSide/PlanSide";

/**
 * [8-1] AI가 만든 일정. Figma 344:10800
 *
 * TODO(api): 일정 생성 API로 교체하세요.
 *
 * ⚠ 디자인은 값이 전부 `{장소 이름}` `{00}분` 같은 플레이스홀더입니다.
 *   태그와 추천메뉴만 실제 문구가 적혀 있어 그대로 옮겼고,
 *   이름·시간은 눈으로 확인할 수 있게 채웠습니다.
 */

export type PlanItem =
  | { type: "stop"; stop: PlanStop }
  | { type: "gap"; gap: PlanGap };

/** 개발 노트 1 — {조건 A} 여행 스타일, {조건 B} 여행 테마, {조건 C} 복약/알레르기 */
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

/** [8-3]은 같은 목록을 저장된 상태로 보여줍니다 */
export const MOCK_PLAN_DAYS: PlanItem[][] = [DAY_1, DAY_1];

/** 344:10205 / 344:10206 — 날짜 탭 */
export function dayTabLabels(dayCount: number) {
  const names = ["첫째 날", "둘째 날", "셋째 날", "넷째 날"];
  return Array.from({ length: dayCount }, (_, i) => names[i] ?? `${i + 1}일차`);
}
