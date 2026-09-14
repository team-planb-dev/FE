import { createContext, useContext } from "react";

/** 회원가입 폼 컨텍스트 */
export type TermKey = "age" | "service" | "privacy" | "marketing";

export type SignupForm = {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  /** 화면에 보이는 질문 문구 */
  question: string;
  /** 서버로 보낼 질문 코드 (FIRST_PET 등) */
  questionCode: string;
  answer: string;
};

export const EMPTY_FORM: SignupForm = {
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  question: "",
  questionCode: "",
  answer: "",
};

export const EMPTY_AGREED: Record<TermKey, boolean> = {
  age: false,
  service: false,
  privacy: false,
  marketing: false,
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
