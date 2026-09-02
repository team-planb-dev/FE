export const PATHS = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  signupTerms: "/signup/terms",

  signupTermsDetail: "/signup/terms/:termKey",
  signupComplete: "/signup/complete",
  findEmail: "/find-email",
  findEmailResult: "/find-email/result",
  findPassword: "/find-password",
  findPasswordResult: "/find-password/result",

  home: "/home",

  planStart: "/plan",

  planMembers: "/plan/members",

  memberNew: "/plan/members/new",

  memberNewConsent: "/plan/members/new/consent",

  memberNewHealth: "/plan/members/new/health",

  memberNewMeds: "/plan/members/new/meds",

  memberNewMedsDetail: "/plan/members/new/meds/detail",

  memberNewMealtime: "/plan/members/new/mealtime",

  memberNewFood: "/plan/members/new/food",

  memberConfirm: "/plan/members/confirm",

  memberEdit: "/plan/members/:memberId/edit",

  tripName: "/plan/trip/name",

  tripRegion: "/plan/trip/region",

  tripDate: "/plan/trip/date",

  tripTransport: "/plan/trip/transport",

  tripPlace: "/plan/trip/place",

  tripStyle: "/plan/trip/style",

  tripTheme: "/plan/trip/theme",

  tripFood: "/plan/trip/food",

  tripConfirm: "/plan/trip/confirm",

  tripLoading: "/plan/trip/loading",

  tripDetail: "/trip/detail",

  tripSaved: "/trip/saved",

  tripShared: "/trip/shared",

  tripEdit: "/trip/edit",

  restaurantDetail: "/trip/restaurant/:placeId",

  myPage: "/mypage",

  myMembers: "/mypage/members",
} as const;

/** 앱 전체 경로 정의 */
export const termsDetailPath = (termKey: string) => `/signup/terms/${termKey}`;

export const restaurantDetailPath = (placeId: string) =>
  `/trip/restaurant/${placeId}`;

export const memberEditPath = (memberId: string) =>
  `/plan/members/${memberId}/edit`;
