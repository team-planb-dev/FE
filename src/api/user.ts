/** 사용자 API — 회원가입, 중복 확인, 계정 복구, 탈퇴 */

import { request } from "./client";
import { ENDPOINT } from "./endpoints";
import type {
  CheckDuplicationResponse,
  FindUsernameRequest,
  FindUsernameResponse,
  RecoveryQuestionResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserDeleteResponse,
} from "./schema";

export function createUser(
  body: UserCreateRequest,
): Promise<UserCreateResponse> {
  return request<UserCreateResponse>(ENDPOINT.userCreate, {
    method: "POST",
    body,
    auth: false,
  });
}

/**
 * 이메일 중복 확인.
 */
export function checkUsernameDuplication(
  username: string,
): Promise<CheckDuplicationResponse> {
  return request<CheckDuplicationResponse>(ENDPOINT.checkUsername, {
    query: { username },
    auth: false,
  });
}

/** ⚠ 쿼리 파라미터로 보냅니다 */
export function checkNicknameDuplication(
  nickname: string,
): Promise<CheckDuplicationResponse> {
  return request<CheckDuplicationResponse>(ENDPOINT.checkNickname, {
    query: { nickname },
    auth: false,
  });
}

/** 복구 질문 8종. 한글 문구를 서버가 내려줍니다 */
export function fetchRecoveryQuestions(): Promise<RecoveryQuestionResponse[]> {
  return request<RecoveryQuestionResponse[]>(ENDPOINT.recoveryQuestions, {
    auth: false,
  });
}

/** 이메일 찾기. 질문과 답변만 보냅니다 */
export function findUsername(
  body: FindUsernameRequest,
): Promise<FindUsernameResponse> {
  return request<FindUsernameResponse>(ENDPOINT.recoveryUsername, {
    method: "POST",
    body,
    auth: false,
  });
}

export function resetPassword(
  body: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  return request<ResetPasswordResponse>(ENDPOINT.recoveryPassword, {
    method: "PATCH",
    body,
    auth: false,
  });
}

export function deleteUser(): Promise<UserDeleteResponse> {
  return request<UserDeleteResponse>(ENDPOINT.userDelete, { method: "DELETE" });
}
