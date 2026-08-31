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
} as const;

export const termsDetailPath = (termKey: string) => `/signup/terms/${termKey}`;
