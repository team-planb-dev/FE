import type { PlanStop } from "../../components/PlanCard/PlanCard";
import type { PlanGap } from "../../components/PlanSide/PlanSide";
import type { ApiPlanDay, ApiSchedule } from "../../api/planTypes";
import { COURSE_TYPE } from "../../api/planTypes";
import { formatTimeRange, minutesOf } from "../../api/planFormat";

export type PlanItem =
  | { type: "stop"; stop: PlanStop; schedule: ApiSchedule }
  | { type: "gap"; gap: PlanGap };

export function buildAiSummary(conditions: string[]) {
  return conditions.filter(Boolean).join(", ");
}

/** 하루치 응답을 타임라인 항목으로 바꿉니다. 응답 순서가 아니라 시각 순으로 놓습니다 */
export function toPlanItems(day: ApiPlanDay): PlanItem[] {
  const sorted = [...day.schedules].sort(
    (a, b) => minutesOf(a.startTime) - minutesOf(b.startTime),
  );

  const items: PlanItem[] = [];

  sorted.forEach((schedule, index) => {
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

const code = (c: string, name: string) => ({ code: c, codeName: name });

const BEACH: ApiSchedule = {
  scheduleType: code("ACTIVITY", "일정"),
  courseType: code("ATTRACTION", "관광지"),
  startTime: [10, 0],
  endTime: [11, 30],
  locationName: "해운대해수욕장",
  location: "부산 해운대구 우동",
  longitude: "129.159854668484",
  latitude: "35.1585232170784",
  imageUrl: null,
  thumbNailImageUrl: null,
  stayMinutes: 90,
  travelMinutes: null,
  tags: [
    code("NATURAL_SCENERY", "자연경관"),
    code("MUST_VISIT", "꼭가고싶은곳"),
  ],
  medication: null,
  restaurantDetail: null,
};

const LUNCH: ApiSchedule = {
  scheduleType: code("LUNCH", "점심식사"),
  courseType: code("RESTAURANT", "식당"),
  startTime: [12, 0],
  endTime: [13, 0],
  locationName: "영동밀면&돼지국밥",
  location: "부산광역시 동구 중앙대로209번길 12 (초량동)",
  longitude: null,
  latitude: null,
  imageUrl: "http://tong.visitkorea.or.kr/cms/resource/88/2869388_image2_1.jpg",
  thumbNailImageUrl:
    "http://tong.visitkorea.or.kr/cms/resource/88/2869388_image3_1.jpg",
  stayMinutes: 60,
  travelMinutes: null,
  tags: [
    code("MEAL_TIME_APPLIED", "식사시간반영"),
    code("FOOD_PREFERENCE", "미식취향"),
  ],
  medication: null,
  restaurantDetail: {
    menuName: "밀면",
    carbohydrate: 14.19,
    sodium: 303,
    fat: 0.5,
    openTime: null,
    address: "부산광역시 동구 중앙대로209번길 12 (초량동)",
    longitude: "129.0393473684",
    latitude: "35.1163102386",
    imageUrl:
      "http://tong.visitkorea.or.kr/cms/resource/88/2869388_image2_1.jpg",
  },
};

const AFTERNOON: ApiSchedule = {
  scheduleType: code("ACTIVITY", "일정"),
  courseType: code("ATTRACTION", "관광지"),
  startTime: [13, 0],
  endTime: [14, 30],
  locationName: "싱싱뽈락회 해운대본점",
  location: "부산광역시 해운대구 해운대해변로209번나길 64 (우동)",
  longitude: null,
  latitude: null,
  imageUrl: "http://tong.visitkorea.or.kr/cms/resource/50/2860850_image2_1.jpg",
  thumbNailImageUrl:
    "http://tong.visitkorea.or.kr/cms/resource/50/2860850_image3_1.jpg",
  stayMinutes: 90,
  travelMinutes: null,
  tags: [
    code("FOOD_PREFERENCE", "미식취향"),
    code("MUST_VISIT", "꼭가고싶은곳"),
  ],
  medication: null,
  restaurantDetail: null,
};

const DINNER: ApiSchedule = {
  ...AFTERNOON,
  scheduleType: code("DINNER", "저녁식사"),
  courseType: code("RESTAURANT", "식당"),
  startTime: [18, 0],
  endTime: [19, 0],
  stayMinutes: 60,
  tags: [
    code("MEAL_TIME_APPLIED", "식사시간반영"),
    code("FOOD_PREFERENCE", "미식취향"),
  ],
  restaurantDetail: {
    menuName: "뽈락세꼬시",
    carbohydrate: null,
    sodium: null,
    fat: null,
    openTime: null,
    address: "부산광역시 해운대구 해운대해변로209번나길 64 (우동)",
    longitude: "129.1571359371",
    latitude: "35.1597103343",
    imageUrl:
      "http://tong.visitkorea.or.kr/cms/resource/50/2860850_image2_1.jpg",
  },
};

const MEDICATION: ApiSchedule = {
  scheduleType: code("CHECK_IN", "체크인"),
  courseType: code("MEDICATION", "복약"),
  startTime: [12, 30],
  endTime: [12, 35],
  locationName: null,
  location: null,
  longitude: null,
  latitude: null,
  imageUrl: null,
  thumbNailImageUrl: null,
  stayMinutes: 5,
  travelMinutes: null,
  tags: [],
  medication: null,
  restaurantDetail: null,
};

/** 목업. 노션 "AI 응답 결과" 의 실제 응답을 그대로 옮겼습니다 */
export const MOCK_PLAN_DAYS: ApiPlanDay[] = [
  {
    dayNumber: 1,
    date: [2026, 9, 9],
    schedules: [BEACH, LUNCH, AFTERNOON, DINNER, MEDICATION, MEDICATION],
  },
  {
    dayNumber: 2,
    date: [2026, 9, 10],
    schedules: [BEACH, LUNCH, AFTERNOON, DINNER, MEDICATION],
  },
];
