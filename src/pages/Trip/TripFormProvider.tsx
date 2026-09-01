import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { EMPTY_TRIP_FORM, TripFormContext } from "./tripFormContext";
import type { TripForm, TripFormContextValue } from "./tripFormContext";

/** 여행 생성 단계의 입력값을 공유합니다 */
export default function TripFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [form, setForm] = useState<TripForm>(EMPTY_TRIP_FORM);

  const value = useMemo<TripFormContextValue>(
    () => ({
      form,
      setField: (key, v) => setForm((prev) => ({ ...prev, [key]: v })),
      reset: () => setForm(EMPTY_TRIP_FORM),
    }),
    [form],
  );

  return (
    <TripFormContext.Provider value={value}>
      {children}
    </TripFormContext.Provider>
  );
}
