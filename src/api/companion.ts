/** 동행인 API — [S6] 여행 구성원 */

import { request } from "./client";
import { ENDPOINT } from "./endpoints";
import type {
  AddCompanionRequest,
  CompanionDetailResponse,
  CompanionMessageResponse,
  CompanionSummaryDetail,
  CompanionSummaryResponse,
  UpdateCompanionRequest,
} from "./schema";

/** [6-3] 구성원 목록 */
export async function fetchCompanions(): Promise<CompanionSummaryDetail[]> {
  const data = await request<CompanionSummaryResponse>(
    ENDPOINT.companionSummary,
  );
  return data?.companionList ?? [];
}

/** [6-4] 구성원 상세 */
export function fetchCompanionDetail(
  healthId: number,
): Promise<CompanionDetailResponse> {
  return request<CompanionDetailResponse>(ENDPOINT.companionDetail, {
    query: { healthId },
  });
}

/** [6-6] 등록 */
export function addCompanion(
  body: AddCompanionRequest,
): Promise<CompanionMessageResponse> {
  return request<CompanionMessageResponse>(ENDPOINT.companionAdd, {
    method: "POST",
    body,
  });
}

/** [6-4] 수정 */
export function updateCompanion(
  body: UpdateCompanionRequest,
): Promise<CompanionMessageResponse> {
  return request<CompanionMessageResponse>(ENDPOINT.companionUpdate, {
    method: "PUT",
    body,
  });
}

/** [11-4] 삭제 */
export function deleteCompanion(
  healthId: number,
): Promise<CompanionMessageResponse> {
  return request<CompanionMessageResponse>(ENDPOINT.companionDelete, {
    method: "DELETE",
    body: { healthId },
  });
}
