import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { EMPTY_MEMBER_FORM, MemberFormContext } from "./memberFormContext";
import type {
  Condition,
  MemberForm,
  MemberFormContextValue,
} from "./memberFormContext";

/** [6-6] 신규 구성원 등록 전체를 감싸 단계 간 입력값을 공유합니다. */
export default function MemberFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [form, setForm] = useState<MemberForm>(EMPTY_MEMBER_FORM);

  const value = useMemo<MemberFormContextValue>(
    () => ({
      form,
      setField: (key, v) => setForm((prev) => ({ ...prev, [key]: v })),
      toggleCondition: (condition: Condition) =>
        setForm((prev) => ({
          ...prev,
          conditions: prev.conditions.includes(condition)
            ? prev.conditions.filter((c) => c !== condition)
            : [...prev.conditions, condition],
        })),
      reset: () => setForm(EMPTY_MEMBER_FORM),
    }),
    [form],
  );

  return (
    <MemberFormContext.Provider value={value}>
      {children}
    </MemberFormContext.Provider>
  );
}
