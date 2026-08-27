import type { TermKey } from "../Signup/signupContext";

export type Term = {
  key: TermKey;
  label: string;
  /** 전문 보기 화면이 있는 항목만 true — Figma [3-6-1] / [3-6-2] */
  hasDetail: boolean;
};

/** Figma: [S3-6] 이용약관 동의 (237:5772) */
export const TERMS: readonly Term[] = [
  { key: "age", label: "[필수] 만 14세 이상입니다.", hasDetail: false },
  { key: "service", label: "[필수] 서비스 이용약관", hasDetail: true },
  { key: "privacy", label: "[필수] 개인정보 수집·이용 동의", hasDetail: true },
];

export const findTerm = (key: string | undefined) =>
  TERMS.find((term) => term.key === key);
