/* ──────────────────────────── 공통 ──────────────────────────── */

export type ApiError = {
  errorCode: string;
  message: string;
};

export type ApiResult<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
};

/** "2026-09-16" 또는 [2026, 9, 16] */
export type RawDate = string | [number, number, number];

/** "10:00" · "10:00:00" 또는 [10, 0] */
export type RawTime = string | [number, number] | [number, number, number];

/* ──────────────────────────── Enum ──────────────────────────── */

export const DISEASE_TYPES = [
  "DIABETES",
  "HIGH_BLOOD_PRESSURE",
  "DYSLIPIDEMIA",
] as const;
export type DiseaseType = (typeof DISEASE_TYPES)[number];

export const WALK_TYPES = ["ACTIVE", "MODERATE", "MINIMAL"] as const;
export type WalkType = (typeof WALK_TYPES)[number];

export const FOOD_TYPES = ["ALLERGY", "AVOID"] as const;
export type FoodType = (typeof FOOD_TYPES)[number];

export const MEDICATION_BASES = [
  "INDEPENDENT",
  "WITH_MEAL",
  "UNKNOWN",
] as const;
export type MedicationBasis = (typeof MEDICATION_BASES)[number];

export const RELATED_MEALS = ["BREAKFAST", "LUNCH", "DINNER"] as const;
export type RelatedMeal = (typeof RELATED_MEALS)[number];

export const MEAL_TIMINGS = [
  "BEFORE_MEAL",
  "DURING_MEAL",
  "AFTER_MEAL",
  "REGARDLESS_OF_MEAL",
] as const;
export type MealTiming = (typeof MEAL_TIMINGS)[number];

export const DATE_TYPES = [
  "DAY_TRIP",
  "ONE_NIGHT_TWO_DAYS",
  "TWO_NIGHTS_THREE_DAYS",
] as const;
export type DateType = (typeof DATE_TYPES)[number];

export const TRANSPORTATIONS = ["CAR", "TRANSIT"] as const;
export type Transportation = (typeof TRANSPORTATIONS)[number];

export const TRAVEL_STYLES = [
  "LESS_WALK",
  "MATCH_MEAL_TIME",
  "LESS_TOURISM",
] as const;
export type TravelStyle = (typeof TRAVEL_STYLES)[number];

export const TRAVEL_THEMES = ["HISTORY", "NATURE", "TASTE", "ACTIVITY"] as const;
export type TravelTheme = (typeof TRAVEL_THEMES)[number];

export const TRAVEL_STATUSES = ["UPCOMING", "ONGOING", "COMPLETED"] as const;
export type TravelStatus = (typeof TRAVEL_STATUSES)[number];

export const SCHEDULE_TYPES = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "ACTIVITY",
  "CHECK_IN",
  "CHECK_OUT",
] as const;
export type ScheduleType = (typeof SCHEDULE_TYPES)[number];

/** 0903 이전 3종에서 8종으로 늘었습니다 */
export const COURSE_TYPES = [
  "RESTAURANT",
  "ATTRACTION",
  "PARK_WALK",
  "CAFE_REST",
  "MEDICATION",
  "TRANSPORTATION",
  "MUST_HAVE",
  "LOCAL_FOOD",
] as const;
export type CourseType = (typeof COURSE_TYPES)[number];

/** 추천 근거 태그 17종 */
export const PLAN_TAGS = [
  "MEAL_TIME_APPLIED",
  "LOCAL_FOOD",
  "FOOD_PREFERENCE",
  "MEDICATION_SCHEDULE",
  "CARBOHYDRATE_REFERENCE",
  "SODIUM_REFERENCE",
  "SATURATED_FAT_REFERENCE",
  "ALLERGY_CHECK",
  "HISTORY_CULTURE",
  "NATURAL_SCENERY",
  "EXPERIENCE_ACTIVITY",
  "LIGHT_WALK",
  "REST_POINT",
  "WALKING",
  "CAR",
  "TRANSIT",
  "MUST_VISIT",
] as const;
export type PlanTag = (typeof PLAN_TAGS)[number];

export const RECOVERY_QUESTION_CODES = [
  "FAVORITE_TEACHER",
  "FIRST_PET",
  "FAVORITE_CHILDHOOD_BOOK",
  "FIRST_SOLO_TRIP_PLACE",
  "CHILDHOOD_NICKNAME",
  "FAVORITE_CHILDHOOD_SNACK",
  "MEMORABLE_CHILDHOOD_PLACE",
  "FIRST_INSTRUMENT_OR_SPORT",
] as const;
export type RecoveryQuestionCode = (typeof RECOVERY_QUESTION_CODES)[number];

export const CHAT_MESSAGE_TYPES = [
  "ENTER",
  "TALK",
  "CONFIRM",
  "CANCEL",
  "LEAVE",
] as const;
export type ChatMessageType = (typeof CHAT_MESSAGE_TYPES)[number];

/** 클라이언트가 보낼 수 있는 것은 이 3종뿐입니다 */
export const SENDABLE_CHAT_TYPES = ["TALK", "CONFIRM", "CANCEL"] as const;
export type SendableChatType = (typeof SENDABLE_CHAT_TYPES)[number];

export type ReissueStatus =
  | "REFRESH_REISSUED"
  | "REFRESH_NULL"
  | "REFRESH_EXPIRED";

/* ─────────────────────── 에러 코드 (일부) ───────────────────────
 */
export const ERROR_CODE = {
  authFailed: "AUTH_FAILED",
  validation: "BASE.EXCEPTION.EXCEPTION_VALIDATION",
  recoveryAnswerMismatch: "BASE.EXCEPTION.RECOVERY_ANSWER_MISMATCH",
  /* 2026-09-14 추가분. Swagger 에는 아직 안 올라와 있습니다 */
  duplicateUsername: "DUPLICATE_USERNAME",
  duplicateNickname: "DUPLICATE_NICKNAME",
  /** 다른 기기에서 로그인해 이 세션이 끊긴 경우 */
  sessionExpired: "SESSION_EXPIRED",
  logoutCredentialNotFound: "LOGOUT_CREDENTIAL_NOT_FOUND",
  issued: "BASE.EXCEPTION.EXCEPTION_ISSUED",
  refreshExpired: "BASE.EXCEPTION.REFRESH_TOKEN_EXPIRED",
  refreshNotFound: "BASE.EXCEPTION.REFRESH_TOKEN_NOT_FOUND",
  healthNotFound: "HEALTH.EXCEPTION.HEALTH_NOUT_FOUND",
  editNotApplied: "PLAN.EXCEPTION.EDIT_NOT_APPLIED",
  editResultNotFound: "PLAN.EXCEPTION.EDIT_RESULT_NOT_FOUND",
  invalidAiPlace: "PLAN.EXCEPTION.INVALID_AI_PLACE",
  /* [7-10] 생성. add-with-recommend 설명에만 있고 errorCode 목록에는 없습니다 */
  aiTemporarilyUnavailable: "AI.EXCEPTION.AI_TEMPORARILY_UNAVAILABLE",
  aiResponseRejected: "AI.EXCEPTION.AI_RESPONSE_REJECTED",
  aiInternalError: "AI.EXCEPTION.AI_INTERNAL_ERROR",
  companionNotOwned: "TRAVEL.EXCEPTION.COMPANION_NOT_OWNED",
  companionRequired: "TRAVEL.EXCEPTION.COMPANION_REQUIRED",
  travelNotSaved: "TRAVEL.EXCEPTION.TRAVEL_NOT_SAVED",
  chatRoomNotFound: "WEBSOCKET.EXCEPTION.CHATROOM_NOT_FOUND",
  subscriberNotMatched: "WEBSOCKET.EXCEPTION.SUBSCRIBER_NOT_MATCHED",
} as const;

/* ──────────────────────────── 인증 ──────────────────────────── */

export type LoginRequest = {
  /** 이메일 */
  username: string;
  password: string;
};

export type LoginResponse = {
  username: string | null;
  message: string | null;
  loginAt: string | null;
};

export type ReissueResponse = {
  status: ReissueStatus | null;
  time: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

/** Security Filter 가 내려주는 응답 (ApiResult 봉투가 아닙니다) */
export type FilterSuccessResponse = {
  success: boolean;
  method: string | null;
  message: string | null;
  time: string | null;
};

/* ──────────────────────────── 사용자 ──────────────────────────── */

export type UserCreateRequest = {
  username: string;
  nickname: string;
  password: string;
  recoveryQuestion: RecoveryQuestionCode;
  recoveryAnswer: string;
  ageRequirementAgreed?: boolean;
  serviceTermsAgreed?: boolean;
  privacyCollectionAgreed?: boolean;
};

export type UserCreateResponse = {
  username: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type UserAuthCache = {
  userId: number | null;
  username: string | null;
  role: string | null;
};

export type UserDeleteResponse = {
  username: string | null;
  deletedAt: string | null;
};

export type CheckDuplicationResponse = {
  duplicate: boolean | null;
  message: string | null;
};

export type RecoveryQuestionResponse = {
  code: RecoveryQuestionCode | null;
  question: string | null;
};

export type FindUsernameRequest = {
  /** 2026-09-14 추가. 같은 답변을 쓴 계정이 여럿이면 못 찾아서 함께 받습니다 */
  nickname: string;
  recoveryQuestion: RecoveryQuestionCode;
  recoveryAnswer: string;
};

export type FindUsernameResponse = {
  maskedUsername: string | null;
};

export type ResetPasswordRequest = {
  username: string;
  recoveryQuestion: RecoveryQuestionCode;
  recoveryAnswer: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  username: string | null;
  resetAt: string | null;
};

/* ──────────────────────────── 동행인 ──────────────────────────── */

export type HealthInfo = {
  diseaseType: DiseaseType | null;
  walkType: WalkType | null;
};

export type MealInfo = {
  applied: boolean | null;
  breakfastApplied: boolean | null;
  /** "08:00" */
  breakfastTime: string | null;
  lunchApplied: boolean | null;
  lunchTime: string | null;
  dinnerApplied: boolean | null;
  dinnerTime: string | null;
};

export type FoodInfoDetail = {
  foodName: string | null;
  foodType: FoodType | null;
};

export type MealMedicationRuleDetail = {
  relatedMeal: RelatedMeal | null;
  mealTiming: MealTiming | null;
  /** 식사 시각과 복약 시각 사이 간격(분) */
  intervalMinutes: number | null;
};

export type MedicationInfoDetail = {
  drugName: string | null;
  medicationBasis: MedicationBasis | null;
  /** "12:30" — 식사 기준 복약이면 null */
  medicationTime: string | null;
  mealMedicationRuleDetails: MealMedicationRuleDetail[] | null;
};

export type AddCompanionRequest = {
  travelerName: string;
  sensitiveAgree: boolean;
  hasMedication: boolean;
  healthInfo: HealthInfo;
  mealInfo: MealInfo;
  foodInfoList: FoodInfoDetail[];
  medicationInfoList: MedicationInfoDetail[];
};

export type UpdateCompanionRequest = AddCompanionRequest & {
  healthId: number;
};

export type CompanionSummaryDetail = {
  healthId: number | null;
  travelerName: string | null;
  hasAllergy: boolean | null;
  hasMedication: boolean | null;
  diseaseType: DiseaseType | null;
};

export type CompanionSummaryResponse = {
  companionList: CompanionSummaryDetail[] | null;
};

export type CompanionDetailResponse = {
  healthId: number | null;
  travelerName: string | null;
  sensitiveAgree: boolean | null;
  hasMedication: boolean | null;
  healthInfo: HealthInfo | null;
  mealInfo: MealInfo | null;
  foodInfoList: FoodInfoDetail[] | null;
  medicationInfoList: MedicationInfoDetail[] | null;
};

export type CompanionMessageResponse = {
  travelerName?: string | null;
  message: string | null;
};

/* ──────────────────────────── 여행 ──────────────────────────── */

export type PlannedPlaceDetail = {
  locationName: string | null;
  location: string | null;
};

export type CreateTravelRequest = {
  travelName: string;
  locationDo: string;
  locationSigungu: string;
  /** "2026-09-16" */
  startDate: string;
  dateType: DateType;
  transportation: Transportation;
  decidedLocation: string;
  plannedPlaces: PlannedPlaceDetail[];
  travelStyle: TravelStyle;
  travelTheme: TravelTheme;
  /** 사용자가 직접 고르거나 입력한 지역 음식 */
  localFoods: string[];
  /** 추천 API 에서 고른 음식 */
  recommendFoods: string[];
  /** 한 명 이상 필요합니다 */
  healthIds: number[];
};

export type MedicationSchedule = {
  intervalMinutes: number | null;
  description: string | null;
};

export type RestaurantDetail = {
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

export type PlanScheduleDetail = {
  scheduleType: ScheduleType | null;
  courseType: CourseType | null;
  startTime: RawTime | null;
  endTime: RawTime | null;
  locationName: string | null;
  location: string | null;
  longitude: string | null;
  latitude: string | null;
  imageUrl: string | null;
  thumbNailImageUrl: string | null;
  stayMinutes: number | null;
  travelMinutes: number | null;
  tags: PlanTag[] | null;
  medication: MedicationSchedule | null;
  restaurantDetail: RestaurantDetail | null;
  /** "tour:126508" — 복약·이동 일정에는 null */
  candidateId: string | null;
};

export type PlanDayDetail = {
  dayNumber: number | null;
  date: RawDate | null;
  schedules: PlanScheduleDetail[] | null;
};

export type GetAiPlanResponse = {
  planName: string | null;
  travelStyle: TravelStyle | null;
  travelTheme: TravelTheme | null;
  /** 공유 조회에서는 빈 배열 */
  diseaseTypes: DiseaseType[] | null;
  /** 공유 조회에서는 빈 배열 */
  medicationTimes: string[] | null;
  tags: PlanTag[] | null;
  planDays: PlanDayDetail[] | null;
};

export type CreatePlanResponse = {
  travelId: number | null;
  /** 생성 직후에는 false — save 로 확정합니다 */
  saved: boolean | null;
  tags: PlanTag[] | null;
  planDays: PlanDayDetail[] | null;
};

export type SaveTravelResponse = {
  travelId: number | null;
  saved: boolean | null;
};

export type ShareTravelResponse = {
  travelId: number | null;
  shareToken: string | null;
};

export type TravelListItemResponse = {
  travelId: number | null;
  travelName: string | null;
  locationDo: string | null;
  locationSigungu: string | null;
  startDate: RawDate | null;
  endDate: RawDate | null;
  status: TravelStatus | null;
  /** 2026-09-15 백엔드가 추가해줬습니다. 이전에 만든 여행은 비어 있을 수 있습니다 */
  travelTheme: TravelTheme | null;
  thumbnailUrl: string | null;
};

export type TravelListResponse = {
  travels: TravelListItemResponse[] | null;
};

export type SearchPlannedPlaceResponse = {
  plannedPlaces: PlannedPlaceDetail[] | null;
};

export type MakeRecommendFoodResponse = {
  foods: string[] | null;
};

/* ──────────────────────── 일정 수정 (AI) ──────────────────────── */

export type EditPlanRequest = {
  travelId: number;
  editRequest: string;
};

export type EditPlanAiResponse = {
  planName: string | null;
  planDays: PlanDayDetail[] | null;
  changes: string[] | null;
  /** false 면 AI 가 요청을 처리할 수 없다고 판단한 것입니다 */
  processable: boolean | null;
};

export type EditPlanPreviewResponse = {
  before: GetAiPlanResponse | null;
  after: EditPlanAiResponse | null;
};

/* ──────────────────────────── 채팅 ──────────────────────────── */

export type CreateChatRoomResponse = {
  chatRoomId: number | null;
  chatRoomName: string | null;
  createdAt: string | null;
  message: string | null;
};

export type SendChatMessageRequest = {
  type: SendableChatType;
  message?: string;
};

export type SendChatMessageResponse = {
  type: ChatMessageType | null;
  roomId: number | null;
  senderId: number | null;
  senderNickname: string | null;
  message: string | null;
  editPreview: EditPlanPreviewResponse | null;
  sendTime: string | null;
};
