import { createContext, useContext } from "react";

import type { Place } from "./placeData";

/** 여행 생성 폼 컨텍스트와 선택지 목록 */
export type TripForm = {
  name: string;
  province: string | null;
  district: string;
  regionQuery: string;
  startDate: string | null;
  nights: number;
  transport: Transport | null;
  places: Place[];
  style: TripStyle | null;
  theme: TripTheme | null;
  foods: string[];
};

export const TRIP_STYLES = ["덜 걷기", "식사시간 맞추기", "관광지 줄이기"] as const;
export type TripStyle = (typeof TRIP_STYLES)[number];

export const TRIP_THEMES = [
  "역사 중심",
  "자연 중심",
  "미식 중심",
  "액티비티 중심",
] as const;
export type TripTheme = (typeof TRIP_THEMES)[number];

export const NIGHT_OPTIONS = [
  { nights: 0, label: "당일치기" },
  { nights: 1, label: "1박 2일" },
  { nights: 2, label: "2박 3일" },
] as const;

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
  places: [],
  style: null,
  theme: null,
  foods: [],
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
