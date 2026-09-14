import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { EMPTY_MEMBER_FORM, MemberFormContext } from "./memberFormContext";
import type {
  Condition,
  Meal,
  MealMedsSetting,
  MemberForm,
  MemberFormContextValue,
} from "./memberFormContext";

/** 구성원 등록·수정 단계의 입력값을 공유합니다 */
export default function MemberFormProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [form, setForm] = useState<MemberForm>(EMPTY_MEMBER_FORM);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  // 아래 함수들은 모양이 바뀌지 않아야 합니다.
  // 수정 화면이 이 함수들을 useEffect 의존성으로 쓰기 때문입니다
  const setField = useCallback(
    <K extends keyof MemberForm>(key: K, value: MemberForm[K]) =>
      setForm((prev) => ({ ...prev, [key]: value })),
    [],
  );

  const toggleCondition = useCallback(
    (condition: Condition) =>
      setForm((prev) => ({
        ...prev,
        conditions: prev.conditions.includes(condition)
          ? prev.conditions.filter((c) => c !== condition)
          : [...prev.conditions, condition],
      })),
    [],
  );

  const setMealMeds = useCallback(
    (meal: Meal, patch: Partial<MealMedsSetting>) =>
      setForm((prev) => ({
        ...prev,
        mealMeds: {
          ...prev.mealMeds,
          [meal]: { ...prev.mealMeds[meal], ...patch },
        },
      })),
    [],
  );

  const hydrate = useCallback((next: MemberForm, memberId: string) => {
    setForm(next);
    setLoadedId(memberId);
  }, []);

  const reset = useCallback(() => {
    setForm(EMPTY_MEMBER_FORM);
    setLoadedId(null);
  }, []);

  const value = useMemo<MemberFormContextValue>(
    () => ({
      form,
      loadedId,
      setField,
      toggleCondition,
      setMealMeds,
      hydrate,
      reset,
    }),
    [form, loadedId, setField, toggleCondition, setMealMeds, hydrate, reset],
  );

  return (
    <MemberFormContext.Provider value={value}>
      {children}
    </MemberFormContext.Provider>
  );
}
