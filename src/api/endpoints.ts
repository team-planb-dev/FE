/** 백엔드 경로 모음. 경로 문자열은 이 파일에만 둡니다 */

export const ENDPOINT = {
  login: "/login",
  logout: "/logout",
  reissue: "/api/v1/refresh/reissue",

  /* 사용자 */
  userCreate: "/api/v1/user/create",
  userMe: "/api/v1/user/me",
  userDelete: "/api/v1/user/delete",
  checkUsername: "/api/v1/user/check/duplication/username",
  checkNickname: "/api/v1/user/check/duplication/nickname",
  recoveryQuestions: "/api/v1/user/recovery/questions",
  recoveryUsername: "/api/v1/user/recovery/username",
  recoveryPassword: "/api/v1/user/recovery/password",

  /* 동행인 */
  companionAdd: "/api/v1/health/add-traveler",
  companionUpdate: "/api/v1/health/update-companion",
  companionDelete: "/api/v1/health/delete-companion",
  companionSummary: "/api/v1/health/get-companion-summary",
  companionDetail: "/api/v1/health/get-companion-detail",

  /* 여행 */
  travelCreate: "/api/v1/travel/add-with-recommend",
  travelPlan: "/api/v1/travel/get-ai-travel-plan",
  travelList: "/api/v1/travel/list",
  travelSave: "/api/v1/travel/save",
  travelShareIssue: "/api/v1/travel/share/issue",
  travelShared: (shareToken: string) =>
    `/api/v1/travel/shared/${encodeURIComponent(shareToken)}`,
  searchPlace: "/api/v1/travel/search-planned-place",
  recommendFood: "/api/v1/travel/recommend-local-food",

  /* 일정 수정 (REST 경로) */
  editPreview: "/api/v1/travel/edit-plan/preview",
  editConfirm: "/api/v1/travel/edit-plan/confirm",
  editCancel: "/api/v1/travel/edit-plan/cancel",

  /* 채팅방 */
  chatRoomCreate: "/api/v1/chat/room/create",
  chatRoomDelete: "/api/v1/chat/room/delete",
  chatRoomOfTravel: (travelId: number) => `/api/v1/chat/room/travel/${travelId}`,
  chatMemberAdd: "/api/v1/chat/member/add",
  chatMemberDelete: "/api/v1/chat/member/delete",
} as const;

export const STOMP = {
  endpoint: "/ws-stomp",
  subscribe: (roomId: number) => `/sub/api/v1/chat/${roomId}`,
  publish: (roomId: number) => `/pub/api/v1/chat/${roomId}/send`,
} as const;
