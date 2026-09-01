export type Region = {
  name: string;
  districts: string[];
};

/** 여행 지역 목록 */
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
