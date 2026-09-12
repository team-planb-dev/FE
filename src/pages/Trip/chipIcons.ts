import icnCar from "../../assets/icn_car.svg";
import icnTrain from "../../assets/icn_train.svg";
import icnWalk from "../../assets/icn_walk.svg";
import icnMeal from "../../assets/icn_meal.svg";
import icnSign from "../../assets/icn_sign.svg";
import icnNature from "../../assets/icn_nature.svg";
import icnHistory from "../../assets/icn_history.svg";
import icnFood from "../../assets/icn_food.svg";
import icnActivity from "../../assets/icn_activity.svg";

import type { Transport, TripStyle, TripTheme } from "./tripFormContext";

/** 선택 칩 라벨에 붙는 아이콘 */
export const CHIP_ICONS: Record<Transport | TripStyle | TripTheme, string> = {
  자가용: icnCar,
  대중교통: icnTrain,
  "덜 걷기": icnWalk,
  "식사시간 맞추기": icnMeal,
  "관광지 줄이기": icnSign,
  "자연 중심": icnNature,
  "역사 중심": icnHistory,
  "미식 중심": icnFood,
  "액티비티 중심": icnActivity,
};
