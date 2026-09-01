export type Place = {
  id: string;
  name: string;
  address: string;
};

const MOCK_PLACES: Place[] = [
  { id: "1", name: "웨스틴 서울", address: "서울특별시 중구 소공로 106" },
  { id: "2", name: "웨스틴 조선 부산", address: "부산광역시 해운대구 동백로 67" },
  { id: "3", name: "경복궁", address: "서울특별시 종로구 사직로 161" },
  { id: "4", name: "강릉 경포해변", address: "강원특별자치도 강릉시 창해로 514" },
];

/** 장소 검색 목업 데이터 */
export const LOCAL_FOOD_SUGGESTIONS: Record<string, string[]> = {
  전북: ["전주비빔밥", "전주콩나물국밥"],
  서울: ["설렁탕", "장충동 족발"],
  경기: ["수원 왕갈비", "의정부 부대찌개"],
  강원: ["춘천 닭갈비", "강릉 초당순두부"],
  충북: ["청주 삼겹살", "충주 사과한과"],
  충남: ["병천 순대", "서산 어리굴젓"],
};

export function searchPlaces(query: string): Place[] {
  const q = query.trim();
  if (!q) return [];

  return MOCK_PLACES.filter(
    (place) => place.name.includes(q) || place.address.includes(q),
  );
}
