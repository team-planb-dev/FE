/**
 * 서버 enum 과 화면 문구를 잇습니다.
 *
 * ⚠ 아래 `PLAN_TAG_LABEL` 중 탄수화물·나트륨·포화지방 세 개만 디자인에서 확인된 문구이고
 *   나머지 14개는 임시 문구여서 추후 확인이 필요합니다.
 */

import type {
  CourseType,
  DateType,
  DiseaseType,
  FoodType,
  MealTiming,
  MedicationBasis,
  PlanTag,
  RecoveryQuestionCode,
  RelatedMeal,
  ScheduleType,
  Transportation,
  TravelStatus,
  TravelStyle,
  TravelTheme,
  WalkType,
} from "./schema";

/* ─────────────────── enum → 화면 문구 ─────────────────── */

export const DISEASE_LABEL: Record<DiseaseType, string> = {
  DIABETES: "당뇨",
  HIGH_BLOOD_PRESSURE: "고혈압",
  DYSLIPIDEMIA: "이상지질혈증",
};

export const WALK_LABEL: Record<WalkType, string> = {
  ACTIVE: "많이 걸어도 좋아요",
  MODERATE: "보통 정도가 좋아요",
  MINIMAL: "걷는 시간을 가능한 줄이고 싶어요",
};

export const MEDICATION_BASIS_LABEL: Record<MedicationBasis, string> = {
  INDEPENDENT: "특정 시간대에 먹어요",
  WITH_MEAL: "식사를 기준으로 기억해요",
  UNKNOWN: "잘 모르겠어요",
};

export const RELATED_MEAL_LABEL: Record<RelatedMeal, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
};

export const MEAL_TIMING_LABEL: Record<MealTiming, string> = {
  BEFORE_MEAL: "식전",
  DURING_MEAL: "식사 중",
  AFTER_MEAL: "식후",
  REGARDLESS_OF_MEAL: "무관",
};

export const FOOD_TYPE_LABEL: Record<FoodType, string> = {
  ALLERGY: "알레르기",
  AVOID: "기피",
};

export const DATE_TYPE_LABEL: Record<DateType, string> = {
  DAY_TRIP: "당일치기",
  ONE_NIGHT_TWO_DAYS: "1박 2일",
  TWO_NIGHTS_THREE_DAYS: "2박 3일",
};

export const TRANSPORTATION_LABEL: Record<Transportation, string> = {
  CAR: "자가용",
  TRANSIT: "대중교통",
};

export const TRAVEL_STYLE_LABEL: Record<TravelStyle, string> = {
  LESS_WALK: "덜 걷기",
  MATCH_MEAL_TIME: "식사시간 맞추기",
  LESS_TOURISM: "관광지 줄이기",
};

export const TRAVEL_THEME_LABEL: Record<TravelTheme, string> = {
  HISTORY: "역사 중심",
  NATURE: "자연 중심",
  TASTE: "미식 중심",
  ACTIVITY: "액티비티 중심",
};

export const TRAVEL_STATUS_LABEL: Record<TravelStatus, string> = {
  UPCOMING: "다가오는 일정",
  ONGOING: "진행 중",
  COMPLETED: "지난 일정",
};

export const SCHEDULE_TYPE_LABEL: Record<ScheduleType, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
  ACTIVITY: "일정",
  CHECK_IN: "체크인",
  CHECK_OUT: "체크아웃",
};

export const COURSE_TYPE_LABEL: Record<CourseType, string> = {
  RESTAURANT: "식당",
  ATTRACTION: "관광지",
  PARK_WALK: "공원 산책",
  CAFE_REST: "카페 휴식",
  MEDICATION: "복약",
  TRANSPORTATION: "이동",
  MUST_HAVE: "꼭 가고 싶은 곳",
  LOCAL_FOOD: "지역 음식",
};

/** ⚠ 세 개(탄수화물·나트륨·포화지방)만 디자인 확인 문구. 나머지는 임시 */
export const PLAN_TAG_LABEL: Record<PlanTag, string> = {
  MEAL_TIME_APPLIED: "식사시간 반영",
  LOCAL_FOOD: "지역 음식",
  FOOD_PREFERENCE: "음식 취향",
  MEDICATION_SCHEDULE: "복약 시간",
  CARBOHYDRATE_REFERENCE: "탄수화물 참고",
  SODIUM_REFERENCE: "나트륨 참고",
  SATURATED_FAT_REFERENCE: "포화지방 참고",
  ALLERGY_CHECK: "알레르기 확인",
  HISTORY_CULTURE: "역사·문화",
  NATURAL_SCENERY: "자연 경관",
  EXPERIENCE_ACTIVITY: "체험·액티비티",
  LIGHT_WALK: "가벼운 산책",
  REST_POINT: "휴식",
  WALKING: "도보",
  CAR: "자가용",
  TRANSIT: "대중교통",
  MUST_VISIT: "꼭 가고 싶은 곳",
};

/**
 * 복구 질문 문구.
 * `GET /api/v1/user/recovery/questions` 가 내려주는 값을 쓰는 것이 원칙이고,
 * 이 표는 요청이 실패했을 때의 폴백입니다.
 */
export const RECOVERY_QUESTION_LABEL: Record<RecoveryQuestionCode, string> = {
  FAVORITE_TEACHER: "내가 어릴 때 가장 좋아했던 선생님의 성함은?",
  FIRST_PET: "처음 키웠던 반려동물의 이름은?",
  FAVORITE_CHILDHOOD_BOOK: "어린 시절 가장 좋아했던 책의 제목은?",
  FIRST_SOLO_TRIP_PLACE: "처음 혼자 여행한 장소는?",
  CHILDHOOD_NICKNAME: "내가 가장 좋아했던 학창시절 별명은?",
  FAVORITE_CHILDHOOD_SNACK: "어릴 때 가장 자주 먹었던 간식은?",
  MEMORABLE_CHILDHOOD_PLACE: "가장 기억에 남는 어린 시절 장소는?",
  FIRST_INSTRUMENT_OR_SPORT: "처음 배운 악기나 운동은?",
};

/* ─────────────────── 화면 문구 → enum ───────────────────
 * 폼 컨텍스트가 한글 문자열을 그대로 담고 있어서 역방향 표가 필요합니다.
 */

export const DISEASE_BY_LABEL = invert(DISEASE_LABEL);
export const WALK_BY_LABEL = invert(WALK_LABEL);
export const MEDICATION_BASIS_BY_LABEL = invert(MEDICATION_BASIS_LABEL);
export const RELATED_MEAL_BY_LABEL = invert(RELATED_MEAL_LABEL);
export const MEAL_TIMING_BY_LABEL = invert(MEAL_TIMING_LABEL);
export const TRANSPORTATION_BY_LABEL = invert(TRANSPORTATION_LABEL);
export const TRAVEL_STYLE_BY_LABEL = invert(TRAVEL_STYLE_LABEL);
export const TRAVEL_THEME_BY_LABEL = invert(TRAVEL_THEME_LABEL);
export const RECOVERY_QUESTION_BY_LABEL = invert(RECOVERY_QUESTION_LABEL);

/** [7-3] 의 박 수(0·1·2) → dateType */
export function dateTypeOfNights(nights: number): DateType {
  if (nights >= 2) return "TWO_NIGHTS_THREE_DAYS";
  if (nights === 1) return "ONE_NIGHT_TWO_DAYS";
  return "DAY_TRIP";
}

/** dateType → 박 수 */
export function nightsOfDateType(dateType: DateType): number {
  if (dateType === "TWO_NIGHTS_THREE_DAYS") return 2;
  if (dateType === "ONE_NIGHT_TWO_DAYS") return 1;
  return 0;
}

/* ─────────────────── 카드 분기 ───────────────────
 * courseType 이 3종에서 8종으로 늘어 [8-1] 카드 분기를 다시 나눴습니다.
 * ⚠ 새로 생긴 4종(PARK_WALK · CAFE_REST · MUST_HAVE · LOCAL_FOOD)의 배치는
 *   임시로 정한 것입니다.
 */

export type CourseKind = "restaurant" | "place" | "medication" | "transport";

const COURSE_KIND: Record<CourseType, CourseKind> = {
  RESTAURANT: "restaurant",
  LOCAL_FOOD: "restaurant",
  CAFE_REST: "restaurant",
  ATTRACTION: "place",
  PARK_WALK: "place",
  MUST_HAVE: "place",
  MEDICATION: "medication",
  TRANSPORTATION: "transport",
};

export function courseKind(courseType: CourseType | null): CourseKind {
  if (!courseType) return "place";
  return COURSE_KIND[courseType] ?? "place";
}

/** PlanCard 의 tone. 식당 계열은 orange, 장소 계열은 purple */
export function courseTone(courseType: CourseType | null): "orange" | "purple" {
  return courseKind(courseType) === "restaurant" ? "orange" : "purple";
}

/* ─────────────────── 내부 ─────────────────── */

function invert<K extends string>(table: Record<K, string>): Record<string, K> {
  const result: Record<string, K> = {};
  for (const key of Object.keys(table) as K[]) {
    result[table[key]] = key;
  }
  return result;
}
