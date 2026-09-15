/**
 * 여행 생성 폼(TripForm)과 여행 API 사이의 변환.
 *
 * 폼은 화면에 보이는 한글 문구를 그대로 담고 있고, 서버는 enum 을 받습니다.
 * 양쪽을 잇는 규칙은 전부 이 파일에만 둡니다. (구성원 쪽은 companionForm.ts)
 */

import {
  TRANSPORTATION_BY_LABEL,
  TRAVEL_STYLE_BY_LABEL,
  TRAVEL_THEME_BY_LABEL,
  dateTypeOfNights,
} from "../../api/labels";
import type { CreateTravelRequest, PlannedPlaceDetail } from "../../api/schema";

import { healthIdsOf } from "../Plan/memberData";
import type { Place } from "./placeData";
import { locationDoOf, locationSiOf } from "./regionData";
import { ALL_DISTRICTS } from "./tripFormContext";
import type { TripForm } from "./tripFormContext";

/* ─────────────────── 서버 → 폼 ─────────────────── */

/** [7-5] 검색 결과. 응답에 id 가 없어 이름과 주소를 이어 키로 씁니다 */
export function toPlace(detail: PlannedPlaceDetail): Place {
  const name = detail.locationName?.trim() ?? "";
  const address = detail.location?.trim() ?? "";

  return { id: `${name}|${address}`, name, address };
}

/* ─────────────────── 폼 → 서버 ─────────────────── */

function toPlannedPlace(place: Place): PlannedPlaceDetail {
  return {
    locationName: place.name,
    location: place.address || null,
  };
}

/**
 * [7-2] 사용자가 지역 검색창에 적은 말.
 *
 * ⚠ 백엔드 예시가 locationDo "경상북도" · locationSigungu "경주시" 일 때
 *   decidedLocation 이 "경주" 였습니다. 검색어를 그대로 보내고
 *   비어 있으면 시군구, 그것도 없으면 시/도로 채웁니다.
 *   정확한 의미는 백엔드 확인이 필요합니다
 */
function decidedLocationOf(form: TripForm): string {
  const typed = form.regionQuery.trim();
  if (typed) return typed;
  if (form.district !== ALL_DISTRICTS) return form.district;

  return form.province ?? "";
}

export type TripRequestResult =
  | { ok: true; body: CreateTravelRequest }
  | { ok: false; message: string };

/**
 * [7-10] 생성 요청 본문을 만듭니다.
 *
 * 8단계를 건너뛰고 들어올 수 있어서(주소 직접 입력·새로고침) 빠진 값을 먼저 봅니다.
 * 보낼 수 없으면 어느 단계가 비었는지 문구로 돌려줍니다
 */
export function toCreateTravelRequest(form: TripForm): TripRequestResult {
  const travelName = form.name.trim();
  if (!travelName) return { ok: false, message: "일정 이름을 입력해주세요." };

  const locationDo = locationDoOf(form.province);
  if (!locationDo) return { ok: false, message: "여행 지역을 선택해주세요." };

  if (!form.startDate) return { ok: false, message: "출발 날짜를 선택해주세요." };
  if (!form.transport) return { ok: false, message: "이동 수단을 선택해주세요." };
  if (!form.style) return { ok: false, message: "여행 스타일을 선택해주세요." };
  if (!form.theme) return { ok: false, message: "여행 테마를 선택해주세요." };

  // 서버가 한 명 이상을 요구합니다 (TRAVEL.EXCEPTION.COMPANION_REQUIRED)
  const healthIds = healthIdsOf(form.members);
  if (healthIds.length === 0) {
    return { ok: false, message: "여행 구성원을 먼저 확정해주세요." };
  }

  return {
    ok: true,
    body: {
      travelName,
      locationDo,
      locationSigungu: locationSiOf(form.district) ?? "",
      startDate: form.startDate,
      dateType: dateTypeOfNights(form.nights),
      transportation: TRANSPORTATION_BY_LABEL[form.transport],
      decidedLocation: decidedLocationOf(form),
      plannedPlaces: form.places.map(toPlannedPlace),
      travelStyle: TRAVEL_STYLE_BY_LABEL[form.style],
      travelTheme: TRAVEL_THEME_BY_LABEL[form.theme],
      localFoods: form.localFoods,
      recommendFoods: form.recommendFoods,
      healthIds,
    },
  };
}
