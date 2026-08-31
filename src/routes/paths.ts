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
} as const;

export const termsDetailPath = (termKey: string) => `/signup/terms/${termKey}`;

export const memberEditPath = (memberId: string) =>
  `/plan/members/${memberId}/edit`;
