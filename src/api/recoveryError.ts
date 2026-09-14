/**
 * 계정 복구(이메일 찾기 · 비밀번호 재설정) 실패 문구.
 *
 * 답변 불일치는 디자인에 확정된 문구가 있어 그걸 쓰고,
 * 그 밖의 오류는 서버가 준 message 를 그대로 보여줍니다.
 * 어떤 실패든 "답변이 일치하지 않아요." 로 뭉뚱그리면 원인을 못 찾게 됩니다.
 */

import { ApiRequestError } from "./client";
import { ERROR_CODE } from "./schema";

/** Figma 확정 문구 (이메일 찾기 실패 Snackbar) */
export const NOT_MATCHED_MESSAGE = "답변이 일치하지 않아요.";
const NETWORK_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";

export function recoveryErrorMessage(caught: unknown): string {
  if (!(caught instanceof ApiRequestError)) return NETWORK_ERROR_MESSAGE;

  if (caught.errorCode === ERROR_CODE.recoveryAnswerMismatch) {
    return NOT_MATCHED_MESSAGE;
  }

  // 서버 문구가 짧으면 그대로 보여줍니다. Snackbar 가 한 줄이라 길면 잘립니다
  const fromServer = caught.message.trim();
  return fromServer && fromServer.length <= 20
    ? fromServer
    : NOT_MATCHED_MESSAGE;
}
