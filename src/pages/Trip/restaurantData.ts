import type { ApiRestaurantDetail, CodeValue } from "../../api/planTypes";

/** 식당 상세 화면이 쓰는 형태 */
export type Nutrition = {
  carbohydrate: string;
  sodium: string;
  fat: string;
};

export type Restaurant = {
  id: string;
  name: string;
  image?: string;
  representativeMenu: string;
  nutrition: Nutrition;
  openingHours: string;
  address: string;
  /** 좌표가 없으면 지도를 띄우지 않습니다 */
  lat: number | null;
  lng: number | null;
  /** 구성원의 관리 질환을 보고 서버가 붙여준 참고 태그 */
  nutritionTag: string;
};

export const NUTRITION_NOTICE =
  "*위 정보는 일반적인 영양 정보로,음식점의 실제 조리값과 다를 수 있습니다.";

/**
 * 영양 참고 태그.
 *
 * 일정 응답의 tags 중 이 세 개만 [8-2] 표와 짝이 맞습니다.
 * 나머지 14종은 식당과 무관한 태그라 여기서 걸러냅니다
 */
const NUTRITION_TAG_CODES = [
  "CARBOHYDRATE_REFERENCE",
  "SODIUM_REFERENCE",
  "SATURATED_FAT_REFERENCE",
];

/** 일정 응답의 restaurantDetail 을 화면 형태로 바꿉니다 */
export function toRestaurant(
  id: string,
  name: string,
  detail: ApiRestaurantDetail,
  tags: CodeValue[] = [],
): Restaurant {
  const nutritionTags = tags
    .filter((tag) => NUTRITION_TAG_CODES.includes(tag.code))
    .map((tag) => tag.codeName);

  return {
    id,
    name,
    image: detail.imageUrl ?? undefined,
    representativeMenu: detail.menuName ?? "",
    nutrition: {
      carbohydrate: amount(detail.carbohydrate, "g"),
      sodium: amount(detail.sodium, "mg"),
      fat: amount(detail.fat, "g"),
    },
    openingHours: detail.openTime ?? "",
    address: detail.address ?? "",
    lat: coord(detail.latitude),
    lng: coord(detail.longitude),
    nutritionTag: nutritionTags.join(", "),
  };
}

/** 값이 없으면 디자인의 자리표시자 그대로 둡니다 */
function amount(value: number | null, unit: string): string {
  return value === null ? `--(${unit})` : `${value}(${unit})`;
}

/** 좌표는 문자열로 옵니다. 비어 있거나 숫자가 아니면 없는 것으로 봅니다 */
function coord(value: string | null): number | null {
  if (!value) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
