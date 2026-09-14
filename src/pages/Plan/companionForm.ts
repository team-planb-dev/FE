/**
 * 구성원 등록 폼(MemberForm)과 동행인 API 사이의 변환.
 *
 * 폼은 화면에 보이는 한글 문구를 그대로 담고 있고, 서버는 enum 을 받습니다.
 * 양쪽을 잇는 규칙은 전부 이 파일에만 둡니다.
 */

import { fromRequestTime, toRequestTime } from "../../api/datetime";
import {
  DISEASE_BY_LABEL,
  DISEASE_LABEL,
  MEAL_TIMING_BY_LABEL,
  MEAL_TIMING_LABEL,
  MEDICATION_BASIS_BY_LABEL,
  MEDICATION_BASIS_LABEL,
  RELATED_MEAL_LABEL,
  WALK_BY_LABEL,
  WALK_LABEL,
} from "../../api/labels";
import type {
  AddCompanionRequest,
  CompanionDetailResponse,
  CompanionSummaryDetail,
  FoodInfoDetail,
  MealInfo,
  MealMedicationRuleDetail,
  MedicationInfoDetail,
  RelatedMeal,
} from "../../api/schema";

import { EMPTY_MEMBER_FORM, MEALS } from "./memberFormContext";
import type {
  Condition,
  Meal,
  MealRelation,
  MedsTiming,
  MemberForm,
  WalkLevel,
} from "./memberFormContext";
import type { Member } from "./memberData";

/** 알레르기·기피 음식 입력칸은 한 줄이라 쉼표로 여러 개를 적을 수 있게 합니다 */
const FOOD_SEPARATOR = /[,·\n]/;

const MEAL_TO_RELATED: Record<Meal, RelatedMeal> = {
  아침: "BREAKFAST",
  점심: "LUNCH",
  저녁: "DINNER",
};

/* ─────────────────── 폼 → 서버 ─────────────────── */

/**
 * 등록·수정 요청 본문을 만듭니다.
 */
export function toCompanionRequest(form: MemberForm): AddCompanionRequest {
  const considers = form.considerHealth === "yes";
  const takesMeds = considers && form.takesMeds === "yes";

  return {
    travelerName: form.name.trim(),
    sensitiveAgree: considers && form.sensitiveAgreed,
    hasMedication: takesMeds,
    healthInfo: {
      diseaseType: considers ? diseaseOf(form.conditions) : null,
      walkType: considers ? walkOf(form.walkLevel) : null,
    },
    mealInfo: mealInfoOf(form, considers),
    foodInfoList: considers ? foodInfoListOf(form) : [],
    medicationInfoList: takesMeds ? medicationInfoListOf(form) : [],
  };
}

function diseaseOf(conditions: Condition[]) {
  const first = conditions[0];
  return first ? (DISEASE_BY_LABEL[first] ?? null) : null;
}

function walkOf(level: WalkLevel | null) {
  return level ? (WALK_BY_LABEL[level] ?? null) : null;
}

function mealInfoOf(form: MemberForm, considers: boolean): MealInfo {
  const applied = considers && form.reflectMealtime === "yes";

  const at = (meal: Meal) => {
    const entry = form.mealTimes[meal];
    if (!applied || !entry.checked) return { applied: false, time: null };

    return {
      applied: true,
      time: toRequestTime(entry.time.meridiem, entry.time.hour, entry.time.minute),
    };
  };

  const breakfast = at("아침");
  const lunch = at("점심");
  const dinner = at("저녁");

  return {
    applied,
    breakfastApplied: breakfast.applied,
    breakfastTime: breakfast.time,
    lunchApplied: lunch.applied,
    lunchTime: lunch.time,
    dinnerApplied: dinner.applied,
    dinnerTime: dinner.time,
  };
}

function foodInfoListOf(form: MemberForm): FoodInfoDetail[] {
  const list: FoodInfoDetail[] = [];

  if (form.hasAllergy === "yes") {
    for (const foodName of splitFoods(form.allergyText)) {
      list.push({ foodName, foodType: "ALLERGY" });
    }
  }

  if (form.hasDislikedFood === "yes") {
    for (const foodName of splitFoods(form.dislikedFoodText)) {
      list.push({ foodName, foodType: "AVOID" });
    }
  }

  return list;
}

function splitFoods(text: string): string[] {
  return text
    .split(FOOD_SEPARATOR)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0);
}

/** 화면은 약을 하나만 받으므로 목록에는 0개 또는 1개가 들어갑니다 */
function medicationInfoListOf(form: MemberForm): MedicationInfoDetail[] {
  const basis = form.medsTiming
    ? (MEDICATION_BASIS_BY_LABEL[form.medsTiming] ?? null)
    : null;
  if (!basis) return [];

  const byMeal = basis === "WITH_MEAL";

  return [
    {
      drugName: form.medsLabel.trim(),
      medicationBasis: basis,
      medicationTime:
        basis === "INDEPENDENT"
          ? toRequestTime(
              form.medsTime.meridiem,
              form.medsTime.hour,
              form.medsTime.minute,
            )
          : null,
      mealMedicationRuleDetails: byMeal ? mealRulesOf(form) : [],
    },
  ];
}

function mealRulesOf(form: MemberForm): MealMedicationRuleDetail[] {
  // 간격은 화면에서 하나만 받아 체크한 끼니에 모두 같은 값으로 붙습니다
  const interval = Number(form.medsIntervalMinutes);
  const intervalMinutes =
    form.medsIntervalMinutes && Number.isFinite(interval) ? interval : null;

  return MEALS.filter((meal) => form.mealMeds[meal].checked).map((meal) => {
    const relation = form.mealMeds[meal].relation;

    return {
      relatedMeal: MEAL_TO_RELATED[meal],
      mealTiming: relation
        ? (MEAL_TIMING_BY_LABEL[relation] ?? "REGARDLESS_OF_MEAL")
        : "REGARDLESS_OF_MEAL",
      intervalMinutes,
    };
  });
}

/* ─────────────────── 서버 → 폼 ─────────────────── */

/** [6-4] 수정 화면에 들어갈 때 서버 값을 폼에 되돌립니다 */
export function toMemberForm(detail: CompanionDetailResponse): MemberForm {
  const considers = detail.sensitiveAgree === true;
  const health = detail.healthInfo;
  const meal = detail.mealInfo;
  const meds = detail.medicationInfoList?.[0] ?? null;

  const allergies = foodNamesOf(detail, "ALLERGY");
  const avoided = foodNamesOf(detail, "AVOID");

  const basisLabel = meds?.medicationBasis
    ? (MEDICATION_BASIS_LABEL[meds.medicationBasis] as MedsTiming)
    : null;

  return {
    ...EMPTY_MEMBER_FORM,
    name: detail.travelerName ?? "",
    considerHealth: considers ? "yes" : "no",
    sensitiveAgreed: considers,

    conditions: health?.diseaseType
      ? [DISEASE_LABEL[health.diseaseType] as Condition]
      : [],
    walkLevel: health?.walkType
      ? (WALK_LABEL[health.walkType] as WalkLevel)
      : null,

    takesMeds: detail.hasMedication === true ? "yes" : "no",
    medsLabel: meds?.drugName ?? "",
    medsTiming: basisLabel,
    medsTime: fromRequestTime(meds?.medicationTime),
    mealMeds: mealMedsOf(meds),
    medsIntervalMinutes: intervalTextOf(meds),

    reflectMealtime: meal?.applied === true ? "yes" : "no",
    mealTimes: {
      아침: {
        checked: meal?.breakfastApplied === true,
        time: fromRequestTime(meal?.breakfastTime),
      },
      점심: {
        checked: meal?.lunchApplied === true,
        time: fromRequestTime(meal?.lunchTime),
      },
      저녁: {
        checked: meal?.dinnerApplied === true,
        time: fromRequestTime(meal?.dinnerTime),
      },
    },

    hasAllergy: allergies.length > 0 ? "yes" : "no",
    allergyText: allergies.join(", "),
    hasDislikedFood: avoided.length > 0 ? "yes" : "no",
    dislikedFoodText: avoided.join(", "),
  };
}

function foodNamesOf(
  detail: CompanionDetailResponse,
  foodType: FoodInfoDetail["foodType"],
): string[] {
  return (detail.foodInfoList ?? [])
    .filter((food) => food.foodType === foodType)
    .map((food) => food.foodName ?? "")
    .filter((name) => name.length > 0);
}

function mealMedsOf(meds: MedicationInfoDetail | null) {
  const rules = meds?.mealMedicationRuleDetails ?? [];
  const next = { ...EMPTY_MEMBER_FORM.mealMeds };

  for (const rule of rules) {
    if (!rule.relatedMeal) continue;

    const meal = RELATED_MEAL_LABEL[rule.relatedMeal] as Meal;
    next[meal] = {
      checked: true,
      relation: rule.mealTiming
        ? (MEAL_TIMING_LABEL[rule.mealTiming] as MealRelation)
        : null,
    };
  }

  return next;
}

function intervalTextOf(meds: MedicationInfoDetail | null): string {
  const minutes = meds?.mealMedicationRuleDetails?.find(
    (rule) => typeof rule.intervalMinutes === "number",
  )?.intervalMinutes;

  return typeof minutes === "number" ? String(minutes) : "";
}

/* ─────────────────── 목록 카드 ─────────────────── */

/** [6-3] 카드에 붙는 태그. 요약 응답에 있는 것만 보여줍니다 */
export function toMember(summary: CompanionSummaryDetail): Member {
  const tags: string[] = [];
  if (summary.hasAllergy) tags.push("알레르기 주의");
  if (summary.hasMedication) tags.push("복약");
  if (summary.diseaseType) tags.push(DISEASE_LABEL[summary.diseaseType]);

  return {
    id: String(summary.healthId ?? ""),
    name: summary.travelerName ?? "이름 없음",
    tags,
  };
}
