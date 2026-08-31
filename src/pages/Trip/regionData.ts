/**
 * [7-2] 여행 지역 목록. Figma 237:6309 (시/도) · 343:7908 · 343:8060 (시/군/구)
 *
 * TODO(api): 지역 목록 조회 API로 교체하세요.
 *
 * ⚠ 디자인에 그려진 값이 전부입니다 — 실제 행정구역과 다릅니다.
 *   · 시/도가 6개뿐입니다(서울·경기·강원·충북·충남·전북). 17개 시도 중 일부만 있습니다.
 *   · 시/군/구도 서울 6개, 강원 7개뿐이고 나머지 시/도는 목록 자체가 없습니다.
 *   · 서울 목록(343:7908)에는 **강서구가 3번** 들어 있습니다. 중복을 빼고 옮겼습니다.
 *   임의로 채우지 않고 디자인에 있는 것만 넣었습니다(확인 필요 문서 참고).
 */

export type Region = {
  /** 시/도 이름 — Chips_L 에 그대로 표시됩니다 */
  name: string;
  /** 시/군/구. "전체" 는 코드에서 항상 맨 앞에 붙이므로 여기에는 넣지 않습니다 */
  districts: string[];
};

export const REGIONS: Region[] = [
  {
    name: "서울",
    districts: ["강남구", "강동구", "강서구", "강북구", "관악구", "광진구"],
  },
  { name: "경기", districts: [] },
  {
    name: "강원",
    districts: [
      "강릉시",
      "춘천시",
      "원주시",
      "동해시",
      "태백시",
      "속초시",
      "삼척시",
    ],
  },
  { name: "충북", districts: [] },
  { name: "충남", districts: [] },
  { name: "전북", districts: [] },
];

/**
 * 검색어와 맞는 시/도를 찾습니다.
 *
 * ⚠ 검색의 동작이 디자인에 적혀 있지 않습니다. 그려진 화면(343:8021)은
 *   `강릉` 을 입력하자 **강원** 이 선택되고 강원의 시/군 목록이 펼쳐진 상태입니다.
 *   그 화면을 그대로 재현하는 규칙으로 구현했습니다 —
 *   시/도 이름이나 시/군/구 이름에 검색어가 들어가는 첫 시/도를 고릅니다.
 */
export function findRegionByQuery(query: string): Region | null {
  const q = query.trim();
  if (!q) return null;

  return (
    REGIONS.find(
      (region) =>
        region.name.includes(q) ||
        region.districts.some((district) => district.includes(q)),
    ) ?? null
  );
}
