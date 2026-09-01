import type { TermKey } from "../Signup/signupContext";

/** 약관 목록과 전문 */
export type Term = {
  key: TermKey;
  label: string;
  hasDetail: boolean;
};

export const TERMS: readonly Term[] = [
  { key: "age", label: "[필수] 만 14세 이상입니다.", hasDetail: false },
  { key: "service", label: "[필수] 서비스 이용약관", hasDetail: true },
  { key: "privacy", label: "[필수] 개인정보 수집·이용 동의", hasDetail: true },
];

export const findTerm = (key: string | undefined) =>
  TERMS.find((term) => term.key === key);
