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

  tripDetail: "/trip/detail/:travelId",

  tripSaved: "/trip/saved/:travelId",

  tripShared: "/trip/shared/:shareToken",

  tripEdit: "/trip/:travelId/edit",

  restaurantDetail: "/trip/restaurant/:placeId",

  myPage: "/mypage",

  myMembers: "/mypage/members",

  myTermsDetail: "/mypage/terms/:termKey",
} as const;

/** 앱 전체 경로 정의 */
export const termsDetailPath = (termKey: string) => `/signup/terms/${termKey}`;

export const myTermsDetailPath = (termKey: string) => `/mypage/terms/${termKey}`;

export const restaurantDetailPath = (placeId: string) =>
  `/trip/restaurant/${placeId}`;

export const memberEditPath = (memberId: string) =>
  `/plan/members/${memberId}/edit`;

/* 여행 화면은 주소에 travelId 를 답니다.
 * 새로고침·뒤로가기·링크 공유 어느 쪽으로 들어와도 같은 일정을 불러오기 위해서입니다 */

export const tripDetailPath = (travelId: number) => `/trip/detail/${travelId}`;

export const tripSavedPath = (travelId: number) => `/trip/saved/${travelId}`;

export const tripEditPath = (travelId: number) => `/trip/${travelId}/edit`;

export const tripSharedPath = (shareToken: string) =>
  `/trip/shared/${encodeURIComponent(shareToken)}`;
