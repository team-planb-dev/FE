/**
 * 서버 응답을 화면이 쓰는 모양(`ApiPlanDay`)으로 맞춥니다.
 *
 * ⚠ 같은 필드가 두 가지 모양으로 올 수 있어서 양쪽 다 받습니다.
 *   노션 "AI 응답 결과" 샘플 : `{ code, codeName }` 객체 · 시각 `[10, 0]` 배열
 *   Swagger 선언            : `"ATTRACTION"` 문자열     · 시각 `"10:00"` 문자열
 *   (Spring 에서 LocalTime 을 그냥 두면 배열로 직렬화되는 건 흔한 일이라,
 *    실제 응답을 한참 본 뒤에도 한쪽으로 단정하지 않는 편이 안전합니다)
 */

import { parseTime } from "../../api/datetime";
import {
  COURSE_TYPE_LABEL,
  PLAN_TAG_LABEL,
  SCHEDULE_TYPE_LABEL,
} from "../../api/labels";
import type {
  ApiPlanDay,
  ApiSchedule,
  ApiTime,
  CodeValue,
} from "../../api/planTypes";
import type { PlanDayDetail, PlanScheduleDetail } from "../../api/schema";

/**
 * 코드 하나만 필요할 때. 문자열로 오든 `{ code }` 객체로 오든 코드만 꺼냅니다.
 * 여행 테마처럼 라벨을 따로 찾아 쓰는 값에 씁니다
 */
export function codeOf(value: unknown): string | null {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "code" in value) {
    const raw = (value as { code?: unknown }).code;
    return typeof raw === "string" && raw ? raw : null;
  }

  return null;
}

/** 코드 문자열로 오든 객체로 오든 `{ code, codeName }` 으로 맞춥니다 */
function toCodeValue(
  value: unknown,
  labels: Record<string, string>,
  fallbackCode: string,
): CodeValue {
  if (value && typeof value === "object" && "code" in value) {
    const raw = value as { code?: unknown; codeName?: unknown };
    const code = typeof raw.code === "string" ? raw.code : fallbackCode;

    return {
      code,
      codeName:
        typeof raw.codeName === "string" && raw.codeName
          ? raw.codeName
          : (labels[code] ?? code),
    };
  }

  if (typeof value === "string" && value) {
    return { code: value, codeName: labels[value] ?? value };
  }

  return { code: fallbackCode, codeName: labels[fallbackCode] ?? fallbackCode };
}

/** "10:00" · [10, 0] → [10, 0] */
function toApiTime(value: unknown): ApiTime | null {
  const parsed = parseTime(value as never);
  return parsed ? [parsed.hour, parsed.minute] : null;
}

function toSchedule(raw: PlanScheduleDetail): ApiSchedule {
  return {
    scheduleType: toCodeValue(
      raw.scheduleType,
      SCHEDULE_TYPE_LABEL,
      "ACTIVITY",
    ),
    courseType: toCodeValue(raw.courseType, COURSE_TYPE_LABEL, "ATTRACTION"),
    startTime: toApiTime(raw.startTime),
    endTime: toApiTime(raw.endTime),
    locationName: raw.locationName ?? null,
    location: raw.location ?? null,
    longitude: raw.longitude ?? null,
    latitude: raw.latitude ?? null,
    imageUrl: raw.imageUrl ?? null,
    thumbNailImageUrl: raw.thumbNailImageUrl ?? null,
    stayMinutes: raw.stayMinutes ?? null,
    travelMinutes: raw.travelMinutes ?? null,
    tags: (raw.tags ?? []).map((tag) =>
      toCodeValue(tag, PLAN_TAG_LABEL, "MUST_VISIT"),
    ),
    medication: raw.medication ?? null,
    restaurantDetail: raw.restaurantDetail ?? null,
  };
}

/** 일정이 없는 날은 버립니다. 탭이 비면 화면이 깨집니다 */
export function toPlanDays(
  days: PlanDayDetail[] | null | undefined,
): ApiPlanDay[] {
  if (!days) return [];

  return days
    .map((day, index) => ({
      dayNumber: day.dayNumber ?? index + 1,
      date: toApiDate(day.date),
      schedules: (day.schedules ?? []).map(toSchedule),
    }))
    .filter((day) => day.schedules.length > 0);
}

function toApiDate(value: unknown): ApiPlanDay["date"] {
  if (Array.isArray(value) && value.length >= 3) {
    return [Number(value[0]), Number(value[1]), Number(value[2])];
  }

  if (typeof value === "string") {
    const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
    if (matched) {
      return [Number(matched[1]), Number(matched[2]), Number(matched[3])];
    }
  }

  return [0, 0, 0];
}
