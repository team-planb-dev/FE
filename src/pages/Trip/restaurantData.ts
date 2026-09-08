import type { ApiRestaurantDetail } from "../../api/planTypes";

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
  lat: number;
  lng: number;
  /** 구성원의 관리 질환에서 나오는 참고 태그 */
  nutritionTag: string;
};

export const NUTRITION_NOTICE =
  "*위 정보는 일반적인 영양 정보로,음식점의 실제 조리값과 다를 수 있습니다.";

/**
 * 관리 질환별 참고 항목. 디자인 주석(393:7708) 기준입니다.
 * 고혈압은 당류·나트륨, 당뇨와 이상지질혈증은 탄수화물·지방·당류를 봅니다.
 */
const TAG_BY_CONDITION: Record<string, string[]> = {
  고혈압: ["당류", "나트륨"],
  당뇨: ["탄수화물", "지방", "당류"],
  이상지질혈증: ["탄수화물", "지방", "당류"],
};

export function nutritionTag(conditions: string[]): string {
  const items = conditions.flatMap((c) => TAG_BY_CONDITION[c] ?? []);
  const unique = [...new Set(items)];
  return unique.length > 0 ? `${unique.join(", ")} 참고` : "";
}

/** 일정 응답의 restaurantDetail 을 화면 형태로 바꿉니다 */
export function toRestaurant(
  id: string,
  name: string,
  detail: ApiRestaurantDetail,
): Restaurant {
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
    lat: Number(detail.latitude),
    lng: Number(detail.longitude),
    nutritionTag: MOCK_RESTAURANT.nutritionTag,
  };
}

/** 값이 없으면 디자인의 자리표시자 그대로 둡니다 */
function amount(value: number | null, unit: string): string {
  return value === null ? `--(${unit})` : `${value}(${unit})`;
}

// 목업. 태그는 디자인의 예시 문구이고, 실제로는 nutritionTag(구성원 질환)로 만듭니다
export const MOCK_RESTAURANT: Restaurant = {
  id: "d1-1",
  name: "{식당 이름}",
  representativeMenu: "메뉴 이름",
  nutrition: { carbohydrate: "--(g)", sodium: "--(mg)", fat: "--(g)" },
  openingHours: "11:00 - 21:00",
  address: "서울특별시 강동구 105길 12",
  lat: 37.5665,
  lng: 126.978,
  nutritionTag: "탄수화물 참고",
};
