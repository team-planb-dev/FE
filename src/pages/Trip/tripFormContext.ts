import { createContext, useContext } from "react";

import type { Member } from "../Plan/memberData";
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
  /** [7-8] 에서 직접 입력한 음식 */
  localFoods: string[];
  /** [7-8] 추천 목록에서 고른 음식. 서버가 둘을 따로 받습니다 */
  recommendFoods: string[];
  /**
   * [6-5] 에서 확정한 구성원.
   *
   * ⚠ 8단계를 오가는 동안 location.state 가 사라져서 폼에 담아둡니다.
   *   생성 요청에는 healthIdsOf() 로 id 만 뽑아 보냅니다
   */
  members: Member[];
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
  localFoods: [],
  recommendFoods: [],
  members: [],
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
