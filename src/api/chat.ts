/*
 * 채팅방 API (REST 부분).
 */

import { request } from "./client";
import { ENDPOINT } from "./endpoints";
import type { CreateChatRoomResponse } from "./schema";

/** 여행에 연결된 채팅방을 조회하거나 없으면 만듭니다. [S9] 진입 시 먼저 부릅니다 */
export function fetchTravelChatRoom(
  travelId: number,
): Promise<CreateChatRoomResponse> {
  return request<CreateChatRoomResponse>(ENDPOINT.chatRoomOfTravel(travelId));
}

export function createChatRoom(
  chatRoomName: string,
): Promise<CreateChatRoomResponse> {
  return request<CreateChatRoomResponse>(ENDPOINT.chatRoomCreate, {
    method: "POST",
    body: { chatRoomName },
  });
}
