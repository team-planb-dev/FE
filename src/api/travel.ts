/** 여행 API — [S5] 홈 · [S7] 일정 생성 · [S8] 상세 · [S10] 공유 · [S9] 수정 */

import { request } from "./client";
import { ENDPOINT } from "./endpoints";
import type {
  CreatePlanResponse,
  CreateTravelRequest,
  EditPlanPreviewResponse,
  EditPlanRequest,
  GetAiPlanResponse,
  MakeRecommendFoodResponse,
  PlannedPlaceDetail,
  SaveTravelResponse,
  SearchPlannedPlaceResponse,
  ShareTravelResponse,
  TravelListItemResponse,
  TravelListResponse,
  TravelStatus,
} from "./schema";

/* ─────────────── [S7] 일정 생성 ─────────────── */

/** [7-5] 장소 검색. ⚠ 응답에 좌표가 없어 지도를 띄울 수 없습니다 */
export async function searchPlaces(
  searchText: string,
): Promise<PlannedPlaceDetail[]> {
  const data = await request<SearchPlannedPlaceResponse>(ENDPOINT.searchPlace, {
    query: { searchText },
  });
  return data?.plannedPlaces ?? [];
}

/** [7-8] 지역 음식 추천 */
export async function recommendLocalFoods(
  locationDo: string,
  locationSigungu: string,
): Promise<string[]> {
  const data = await request<MakeRecommendFoodResponse>(
    ENDPOINT.recommendFood,
    { query: { locationDo, locationSigungu } },
  );
  return data?.foods ?? [];
}

/**
 * [7-10] 여행 조건 등록 + AI 일정 생성.
 */
export function createTravelPlan(
  body: CreateTravelRequest,
  signal?: AbortSignal,
): Promise<CreatePlanResponse> {
  return request<CreatePlanResponse>(ENDPOINT.travelCreate, {
    method: "POST",
    body,
    signal,
  });
}

/* ─────────────── [S8] 조회 · 저장 · 공유 ─────────────── */

export function fetchTravelPlan(travelId: number): Promise<GetAiPlanResponse> {
  return request<GetAiPlanResponse>(ENDPOINT.travelPlan, {
    query: { travelId },
  });
}

/** [8-3] 저장 확정. 공유는 저장한 여행만 가능합니다 */
export function saveTravel(travelId: number): Promise<SaveTravelResponse> {
  return request<SaveTravelResponse>(ENDPOINT.travelSave, {
    method: "POST",
    body: { travelId },
  });
}

/** [S10] 공유 링크 발급. 이미 발급한 여행은 같은 토큰을 돌려줍니다 */
export function issueShareToken(
  travelId: number,
): Promise<ShareTravelResponse> {
  return request<ShareTravelResponse>(ENDPOINT.travelShareIssue, {
    method: "POST",
    body: { travelId },
  });
}

/** 공유받은 일정. 로그인 없이 열립니다 */
export function fetchSharedTravel(
  shareToken: string,
): Promise<GetAiPlanResponse> {
  return request<GetAiPlanResponse>(ENDPOINT.travelShared(shareToken), {
    auth: false,
  });
}

/* ─────────────── [S5] 홈 ─────────────── */

/** status 를 비우면 전체. "지난 일정" 탭은 COMPLETED 입니다 */
export async function fetchTravels(
  status?: TravelStatus,
): Promise<TravelListItemResponse[]> {
  const data = await request<TravelListResponse>(ENDPOINT.travelList, {
    query: { status },
  });
  return data?.travels ?? [];
}

/* ─────────────── [S9] AI 일정 수정 (REST) ─────────────── */

/**
 * 수정 미리보기. 아직 실제 일정에는 반영되지 않습니다.
 * AI 가 처리할 수 없다고 판단하면 `after.processable === false` 로 정상 응답합니다.
 */
export function previewEditPlan(
  body: EditPlanRequest,
  signal?: AbortSignal,
): Promise<EditPlanPreviewResponse> {
  return request<EditPlanPreviewResponse>(ENDPOINT.editPreview, {
    method: "POST",
    body,
    signal,
  });
}

/** 미리보기를 실제 일정에 반영합니다 */
export function confirmEditPlan(travelId: number): Promise<CreatePlanResponse> {
  return request<CreatePlanResponse>(ENDPOINT.editConfirm, {
    method: "POST",
    body: { travelId },
  });
}

export function cancelEditPlan(travelId: number): Promise<null> {
  return request<null>(ENDPOINT.editCancel, {
    method: "POST",
    body: { travelId },
  });
}
