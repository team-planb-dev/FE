/** 앱 전체 경로 정의 — 문자열을 여기저기 흩뿌리지 않기 위한 단일 출처 */
export const PATHS = {
  login: "/login",
  signup: "/signup",
  signupTerms: "/signup/terms",
  /** :termKey 는 SignupContext 의 TermKey */
  signupTermsDetail: "/signup/terms/:termKey",
  signupComplete: "/signup/complete",
  findEmail: "/find-email",
  findEmailResult: "/find-email/result",
  findPassword: "/find-password",
  findPasswordResult: "/find-password/result",
  /** 로그인 이후 메인 — 바텀 네비가 붙는 화면들의 시작점 */
  home: "/home",

  /** [6-1] 여행 생성 — [S6] 진입 화면 */
  planStart: "/plan",
  /** [6-2] / [6-3] 여행 구성원 선택 */
  planMembers: "/plan/members",

  /** [6-6] 신규 구성원 등록 — 이름 + 건강조건 고려 여부 */
  memberNew: "/plan/members/new",
  /** [6-6] 민감정보 수집·이용 동의 전체보기 */
  memberNewConsent: "/plan/members/new/consent",
  /** [6-6] 관리 질환 + 걷기 정도 */
  memberNewHealth: "/plan/members/new/health",
  /** [6-6] 복약 여부 */
  memberNewMeds: "/plan/members/new/meds",
  /** [6-6] 약 이름 + 복약 시점 */
  memberNewMedsDetail: "/plan/members/new/meds/detail",
  /** [6-6] 식사시간 */
  memberNewMealtime: "/plan/members/new/mealtime",
  /** [6-6] 기피 음식 및 알레르기 */
  memberNewFood: "/plan/members/new/food",
  /** [6-6] 여행 구성원 확정 */
  memberConfirm: "/plan/members/confirm",
  /** [6-4] 구성원 수정 — 건강정보 확인. :memberId 는 구성원 id */
  memberEdit: "/plan/members/:memberId/edit",

  /** [7-1] 일정 이름 작성 */
  tripName: "/plan/trip/name",
  /** [7-2] 여행 지역 작성·검색 */
  tripRegion: "/plan/trip/region",
  /** [7-3] 여행 날짜 작성 */
  tripDate: "/plan/trip/date",
  /** [7-4] 이동수단 선택 */
  tripTransport: "/plan/trip/transport",
  /** [7-5] 미리 정해진 장소 선택 */
  tripPlace: "/plan/trip/place",
  /** [7-6] 여행 스타일 설정 */
  tripStyle: "/plan/trip/style",
  /** [7-7] 여행 테마 설정 */
  tripTheme: "/plan/trip/theme",
  /** [7-8] 지역 음식 설정 */
  tripFood: "/plan/trip/food",
  /** [7-9] 입력 정보 확인 */
  tripConfirm: "/plan/trip/confirm",
  /** [7-10] AI 일정 생성 중 */
  tripLoading: "/plan/trip/loading",

  /** [8-1] 생성된 여행 일정 — 저장 전 */
  tripDetail: "/trip/detail",
  /** [8-3] 저장 완료 — 같은 화면의 저장 후 상태 */
  tripSaved: "/trip/saved",
} as const;

export const termsDetailPath = (termKey: string) => `/signup/terms/${termKey}`;

export const memberEditPath = (memberId: string) =>
  `/plan/members/${memberId}/edit`;
