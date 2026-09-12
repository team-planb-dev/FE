import type { ReactEventHandler } from "react";

import thumbFoodL from "../../assets/thumb_food_l.svg";
import thumbPlaceL from "../../assets/thumb_place_l.svg";
import thumbFoodM from "../../assets/thumb_food_m.svg";
import thumbPlaceM from "../../assets/thumb_place_m.svg";

/** 식당은 포크, 그 외 장소는 이정표 */
export type ThumbnailKind = "food" | "place";

/** 가로형은 상세 화면, 정사각형은 카드 썸네일 */
export type ThumbnailShape = "wide" | "square";

const DEFAULTS: Record<ThumbnailShape, Record<ThumbnailKind, string>> = {
  wide: { food: thumbFoodL, place: thumbPlaceL },
  square: { food: thumbFoodM, place: thumbPlaceM },
};

/** API 이미지가 없으면 기본 썸네일을 씁니다 */
export function thumbnailSrc(
  image: string | undefined,
  kind: ThumbnailKind,
  shape: ThumbnailShape,
): string {
  return image ?? DEFAULTS[shape][kind];
}

/** 주소는 있는데 불러오지 못하면 기본 썸네일로 바꿉니다 */
export function onThumbnailError(
  kind: ThumbnailKind,
  shape: ThumbnailShape,
): ReactEventHandler<HTMLImageElement> {
  return (event) => {
    const image = event.currentTarget;
    if (image.dataset.fallback) return;
    image.dataset.fallback = "true";
    image.src = DEFAULTS[shape][kind];
  };
}
