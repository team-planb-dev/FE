import { createContext, useContext } from "react";

/**
 * [S7] 여행 일정 생성 플로우 동안만 살아 있는 상태.
 * [6-6] 구성원 등록(MemberFormProvider)과 같은 방식입니다 — 단계가 10개라
 * 라우터 state 로 넘기면 중간 화면들이 자기가 쓰지도 않는 값을 계속 들고 다녀야 합니다.
 *
 * Provider 는 TripFormProvider.tsx 에 있습니다.
 * (컴포넌트와 훅이 한 파일에 있으면 Fast Refresh 가 깨져 파일을 나눴습니다.)
 */

export type TripForm = {
  /** [7-1] 일정 이름 (237:6557) */
  name: string;
  /** [7-2] 여행 지역 — 시/도 (237:6295) */
  province: string | null;
  /** [7-2] 여행 지역 — 시/군/구. "전체" 가 기본값입니다 (343:7871) */
  district: string;
  /** [7-2] 지역 검색어 (343:8021) */
  regionQuery: string;
};

export const ALL_DISTRICTS = "전체";

export const EMPTY_TRIP_FORM: TripForm = {
  name: "",
  province: null,
  district: ALL_DISTRICTS,
  regionQuery: "",
};

export type TripFormContextValue = {
  form: TripForm;
  setField: <K extends keyof TripForm>(key: K, value: TripForm[K]) => void;
  reset: () => void;
};

export const TripFormContext = createContext<TripFormContextValue | null>(null);

export function useTripForm() {
  const ctx = useContext(TripFormContext);
  if (!ctx) {
    throw new Error("useTripForm 은 TripFormProvider 안에서만 쓸 수 있습니다.");
  }
  return ctx;
}
