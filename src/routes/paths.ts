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
} as const;

export const termsDetailPath = (termKey: string) => `/signup/terms/${termKey}`;
