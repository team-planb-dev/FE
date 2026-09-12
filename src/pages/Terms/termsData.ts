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

export const MARKETING_NOTICE =
  "여로의 새로운 기능, 혜택 및 이벤트 등 다양한 소식을 이메일로 받아볼 수 있습니다.";

export const findTerm = (key: string | undefined) =>
  TERMS.find((term) => term.key === key);
