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
  /** [7-3] 출발일 — YYYY-MM-DD (237:6347) */
  startDate: string | null;
  /** [7-3] 박수 — 0 당일치기 / 1 · 2 (237:6356) */
  nights: number;
  /** [7-4] 이동수단 (343:8449) */
  transport: Transport | null;
};

/** Figma 237:6357~6359 — 세 가지뿐입니다 */
export const NIGHT_OPTIONS = [
  { nights: 0, label: "당일치기" },
  { nights: 1, label: "1박 2일" },
  { nights: 2, label: "2박 3일" },
] as const;

/** Figma 344:9536 / 344:9537 */
export const TRANSPORTS = ["자가용", "대중교통"] as const;
export type Transport = (typeof TRANSPORTS)[number];

export const ALL_DISTRICTS = "전체";

export const EMPTY_TRIP_FORM: TripForm = {
  name: "",
  province: null,
  district: ALL_DISTRICTS,
  regionQuery: "",
  startDate: null,
  nights: 0,
  transport: null,
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
