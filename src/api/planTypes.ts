/** 백엔드 AI 일정 응답 타입. 노션 "AI 응답 결과" 문서의 실제 응답 기준 */

/** 백엔드가 코드와 표시 문구를 함께 내려줍니다 */
export type CodeValue = {
  code: string;
  codeName: string;
};

/** [연, 월, 일] */
export type ApiDate = [number, number, number];

/** [시, 분] — 24시간 */
export type ApiTime = [number, number];

/** courseType 코드. 화면 분기에 씁니다 */
export const COURSE_TYPE = {
  attraction: "ATTRACTION",
  restaurant: "RESTAURANT",
  medication: "MEDICATION",
} as const;

export type ApiRestaurantDetail = {
  menuName: string | null;
  carbohydrate: number | null;
  sodium: number | null;
  fat: number | null;
  openTime: string | null;
  address: string | null;
  longitude: string | null;
  latitude: string | null;
  imageUrl: string | null;
};

export type ApiSchedule = {
  /** ACTIVITY · LUNCH · DINNER · CHECK_IN */
  scheduleType: CodeValue;
  /** ATTRACTION · RESTAURANT · MEDICATION */
  courseType: CodeValue;
  startTime: ApiTime | null;
  endTime: ApiTime | null;
  locationName: string | null;
  location: string | null;
  longitude: string | null;
  latitude: string | null;
  imageUrl: string | null;
  thumbNailImageUrl: string | null;
  stayMinutes: number | null;
  travelMinutes: number | null;
  tags: CodeValue[];
  medication: unknown | null;
  restaurantDetail: ApiRestaurantDetail | null;
};

export type ApiPlanDay = {
  dayNumber: number;
  date: ApiDate;
  schedules: ApiSchedule[];
};
