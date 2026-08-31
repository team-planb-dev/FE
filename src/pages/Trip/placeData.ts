/**
 * [7-5] 장소 검색 결과. Figma 343:9007 · 344:11079
 *
 * TODO(api): 장소 검색 API로 교체하세요.
 *
 * ⚠ 디자인의 검색 결과는 **같은 장소가 두 번**(웨스틴 서울 / 서울특별시 중구 소공로 106)
 *   들어 있는 자리표시자입니다. 검색이 되는 걸 눈으로 확인할 수 있도록
 *   같은 형식으로 몇 개 더 채웠습니다. API 가 붙으면 이 파일은 지우면 됩니다.
 */

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

/** 이름이나 주소에 검색어가 들어가는 장소를 찾습니다. */
export function searchPlaces(query: string): Place[] {
  const q = query.trim();
  if (!q) return [];

  return MOCK_PLACES.filter(
    (place) => place.name.includes(q) || place.address.includes(q),
  );
}
