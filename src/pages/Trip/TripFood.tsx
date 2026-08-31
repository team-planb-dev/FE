import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TripFood.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import TextInput from "../../components/Input/TextInput";
import ChipsM from "../../components/ChipsM/ChipsM";
import TypeTag from "../../components/TypeTag/TypeTag";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import searchIcon from "../../assets/icn_search.svg";
import { LOCAL_FOOD_SUGGESTIONS } from "./placeData";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [7-8] 지역 음식 설정
 *  343:9093 초기(= 344:9625) · 344:9748 고른 뒤
 *
 * 개발 노트 1 (343:9168) — [AI 추천 키워드]
 *   여행 지역이 '전주'로 설정되었을 경우, '전주'의 지역음식을 추천합니다.
 *
 * ⚠ 추천 키워드를 어떻게 뽑는지(어떤 API, 몇 개)는 적혀 있지 않습니다.
 *   [7-2]에서 고른 시/도에 맞춰 목업을 보여주고, 없으면 추천 줄을 숨깁니다.
 */
export default function TripFood() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [query, setQuery] = useState("");

  // 개발 노트 1 — 여행 지역에 맞춘 추천. TODO(api) 는 placeData.ts 에 있습니다.
  const suggestions = LOCAL_FOOD_SUGGESTIONS[form.province ?? ""] ?? [];
  const typedQuery = query.trim();
  const shown = typedQuery
    ? suggestions.filter((food) => food.includes(typedQuery))
    : suggestions;

  const add = (food: string) => {
    if (!form.foods.includes(food)) setField("foods", [...form.foods, food]);
    setQuery("");
  };

  const remove = (food: string) =>
    setField(
      "foods",
      form.foods.filter((f) => f !== food),
    );

  return (
    <div className="trip-food">
      {/* Header / Variant2 (343:9094) */}
      <Header
        className="trip-food__header"
        onBack={() => navigate(PATHS.tripTheme)}
      />

      {/* heading (343:9096) — y54, 두 줄 */}
      <div className="trip-food__heading">
        <TitleL>
          이번 여행에서 꼭 먹어야 하는
          <br />
          지역음식이 있다면 알려주세요.
        </TitleL>
      </div>

      {/* Frame 1707482569 (343:9140) — x24 y180, gap 20 */}
      <div className="trip-food__form">
        {/* Input (343:9099) */}
        <TextInput
          id="trip-food-search"
          value={query}
          onChange={setQuery}
          placeholder="지역음식을 입력하세요"
          leadingIcon={searchIcon}
        />

        {/* Frame 1707482568 (343:9139) — AI 추천 키워드.
            하나라도 고르면 344:9748 처럼 이 줄이 사라지고 태그만 남습니다.
            ⚠ 인풋에 직접 친 음식을 추가하는 화면이 디자인에 없습니다.
              [7-5]의 검색 결과 목록 같은 것이 없어, 지금은 친 글자로
              추천 칩을 걸러주기만 합니다(확인 필요 문서 참고). */}
        {form.foods.length === 0 && shown.length > 0 && (
          <div className="trip-food__suggest">
            <p className="trip-food__suggest-label">AI 추천 키워드</p>
            <div className="trip-food__suggest-chips">
              {shown.map((food) => (
                <ChipsM key={food} selected={false} onClick={() => add(food)}>
                  {food}
                </ChipsM>
              ))}
            </div>
          </div>
        )}

        {/* Frame 1707482571 (344:9776) — 고른 음식 */}
        {form.foods.length > 0 && (
          <div className="trip-food__tags">
            {form.foods.map((food) => (
              <TypeTag key={food} label={food} onRemove={() => remove(food)} />
            ))}
          </div>
        )}
      </div>

      {/* bottom (343:9100) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripTheme)}>
          이전으로
        </Btn>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripConfirm)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
