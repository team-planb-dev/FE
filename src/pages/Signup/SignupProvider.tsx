import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import {
  EMPTY_AGREED,
  EMPTY_FORM,
  SignupContext,
} from "./signupContext";
import type { SignupContextValue, SignupForm, TermKey } from "./signupContext";

/** 회원가입 단계의 입력값을 공유합니다 */
export default function SignupProvider({ children }: { children: ReactNode }) {
  const [form, setForm] = useState<SignupForm>(EMPTY_FORM);
  const [agreed, setAgreedState] =
    useState<Record<TermKey, boolean>>(EMPTY_AGREED);

  const value = useMemo<SignupContextValue>(
    () => ({
      form,
      setField: (key, v) => setForm((prev) => ({ ...prev, [key]: v })),
      agreed,
      setAgreed: (key, v) => setAgreedState((prev) => ({ ...prev, [key]: v })),
      reset: () => {
        setForm(EMPTY_FORM);
        setAgreedState(EMPTY_AGREED);
      },
    }),
    [form, agreed],
  );

  return (
    <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
  );
}
