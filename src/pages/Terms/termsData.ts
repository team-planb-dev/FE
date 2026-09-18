import type { TermKey } from "../Signup/signupContext";
import { MARKETING_TERMS, PRIVACY_TERMS, SERVICE_TERMS } from "./termsContent";

/** 약관 목록과 전문 */
export type Term = {
  key: TermKey;
  label: string;
  /** 전문이 있으면 전체보기가 보입니다 */
  content?: string;
  required: boolean;
};

export const TERMS: readonly Term[] = [
  { key: "age", label: "[필수] 만 14세 이상입니다.", required: true },
  {
    key: "service",
    label: "[필수] 서비스 이용약관",
    content: SERVICE_TERMS,
    required: true,
  },
  {
    key: "privacy",
    label: "[필수] 개인정보 수집·이용 동의",
    content: PRIVACY_TERMS,
    required: true,
  },
  {
    key: "marketing",
    label: "[선택] 마케팅 정보 수신 동의",
    content: MARKETING_TERMS,
    required: false,
  },
];

export const findTerm = (key: string | undefined) =>
  TERMS.find((term) => term.key === key);
