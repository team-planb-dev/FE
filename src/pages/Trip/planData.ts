/**
 * 하루치 일정을 [8-1] 타임라인 항목으로 바꿉니다.
 *
 * 서버 응답을 이 파일이 쓰는 모양으로 맞추는 일은 planNormalize.ts 가 합니다.
 */

import type { PlanStop } from "../../components/PlanCard/PlanCard";
import type { PlanGap } from "../../components/PlanSide/PlanSide";
import type { ApiPlanDay, ApiSchedule } from "../../api/planTypes";
import { COURSE_TYPE } from "../../api/planTypes";
import { formatTimeRange, minutesOf } from "../../api/planFormat";

export type PlanItem =
  | { type: "stop"; stop: PlanStop; schedule: ApiSchedule }
  | { type: "gap"; gap: PlanGap };

/** 응답 순서가 아니라 시각 순으로 놓습니다 */
export function toPlanItems(day: ApiPlanDay): PlanItem[] {
  const sorted = [...day.schedules].sort(
    (a, b) => minutesOf(a.startTime) - minutesOf(b.startTime),
  );

  const items: PlanItem[] = [];

  sorted.forEach((schedule, index) => {
    // 복약·이동에는 candidateId 가 없어서 순번으로 키를 만듭니다
    const id = `d${day.dayNumber}-${index}`;

    if (schedule.courseType.code === COURSE_TYPE.medication) {
      items.push({
        type: "gap",
        gap: {
          id,
          label: "복약체크",
          parts: [`${schedule.stayMinutes ?? 0}분`],
        },
      });
      return;
    }

    items.push({
      type: "stop",
      schedule,
      stop: {
        id,
        kind:
          schedule.courseType.code === COURSE_TYPE.restaurant ? "food" : "sight",
        name: schedule.locationName ?? "",
        time: formatTimeRange(schedule.startTime, schedule.endTime),
        category: schedule.courseType.codeName,
        tags: schedule.tags.map((t) => t.codeName),
        thumbnail: schedule.thumbNailImageUrl ?? undefined,
        recommendedMenu: schedule.restaurantDetail?.menuName ?? undefined,
      },
    });

    if (schedule.travelMinutes !== null) {
      items.push({
        type: "gap",
        gap: {
          id: `${id}-move`,
          label: "이동시간",
          parts: [`${schedule.travelMinutes}분`, "·", "걷기 부담 낮음"],
        },
      });
    }
  });

  return items;
}

export function dayTabLabels(dayCount: number) {
  const names = ["첫째 날", "둘째 날", "셋째 날", "넷째 날"];
  return Array.from({ length: dayCount }, (_, i) => names[i] ?? `${i + 1}일차`);
}
