import { createContext, useContext } from "react";

/**
 * 회원가입 플로우(폼 → 약관 동의 → 완료) 동안만 살아 있는 상태.
 *
 * 라우터 state 로 넘기면 약관 화면이 자기가 쓰지도 않는 닉네임을 완료 화면까지
 * 전달해야 해서, 회원가입 경로 그룹에만 Context 를 씌웠습니다.
 * 새로고침하면 초기화됩니다 — 가입 중간 데이터는 남기지 않는 게 맞다고 보고 그대로 뒀습니다.
 *
 * Provider 는 SignupProvider.tsx 에 있습니다.
 * (컴포넌트와 훅이 한 파일에 있으면 Fast Refresh 가 깨져 파일을 나눴습니다.)
 */

export type TermKey = "age" | "service" | "privacy";

export type SignupForm = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  question: string;
  answer: string;
};

export const EMPTY_FORM: SignupForm = {
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  question: "",
  answer: "",
};

export const EMPTY_AGREED: Record<TermKey, boolean> = {
  age: false,
  service: false,
  privacy: false,
};

export type SignupContextValue = {
  form: SignupForm;
  setField: <K extends keyof SignupForm>(key: K, value: SignupForm[K]) => void;
  agreed: Record<TermKey, boolean>;
  setAgreed: (key: TermKey, value: boolean) => void;
  reset: () => void;
};

export const SignupContext = createContext<SignupContextValue | null>(null);

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error("useSignup 은 SignupProvider 안에서만 쓸 수 있습니다.");
  }
  return ctx;
}
