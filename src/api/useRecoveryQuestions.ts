/**
 * 계정 복구 질문 목록.
 *
 * 서버가 `{ code, question }` 으로 한글 문구까지 내려주므로 그 값을 씁니다.
 * 화면의 Select 는 문구(string)를 다루고 API 는 code 를 받으므로,
 * 고른 문구를 code 로 되돌리는 함수를 같이 돌려줍니다.
 *
 * 요청이 실패하면 labels.ts 의 표로 폴백합니다 — 이 화면은 로그인 전이라
 * 목록 하나 때문에 진입 자체가 막히면 안 됩니다.
 */

import { useEffect, useState } from "react";

import { RECOVERY_QUESTION_BY_LABEL, RECOVERY_QUESTION_LABEL } from "./labels";
import { RECOVERY_QUESTION_CODES } from "./schema";
import type { RecoveryQuestionCode } from "./schema";
import { fetchRecoveryQuestions } from "./user";

export type RecoveryQuestionItem = {
  code: RecoveryQuestionCode;
  question: string;
};

const FALLBACK: RecoveryQuestionItem[] = RECOVERY_QUESTION_CODES.map(
  (code) => ({ code, question: RECOVERY_QUESTION_LABEL[code] }),
);

export function useRecoveryQuestions() {
  const [items, setItems] = useState<RecoveryQuestionItem[]>(FALLBACK);

  useEffect(() => {
    let alive = true;

    fetchRecoveryQuestions()
      .then((list) => {
        const usable = (list ?? []).filter(
          (item): item is RecoveryQuestionItem =>
            Boolean(item.code) && Boolean(item.question),
        );
        if (alive && usable.length > 0) setItems(usable);
      })
      .catch(() => {
        // 폴백 목록을 그대로 씁니다
      });

    return () => {
      alive = false;
    };
  }, []);

  const options = items.map((item) => item.question);

  const codeOf = (question: string): RecoveryQuestionCode | null =>
    items.find((item) => item.question === question)?.code ??
    RECOVERY_QUESTION_BY_LABEL[question] ??
    null;

  return { options, codeOf };
}
