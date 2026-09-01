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

/** 지역 음식 선택 */
export default function TripFood() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [query, setQuery] = useState("");

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
      <Header
        className="trip-food__header"
        onBack={() => navigate(PATHS.tripTheme)}
      />

      <div className="trip-food__heading">
        <TitleL>
          이번 여행에서 꼭 먹어야 하는
          <br />
          지역음식이 있다면 알려주세요.
        </TitleL>
      </div>

      <div className="trip-food__form">
        <TextInput
          id="trip-food-search"
          value={query}
          onChange={setQuery}
          placeholder="지역음식을 입력하세요"
          leadingIcon={searchIcon}
        />

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

        {form.foods.length > 0 && (
          <div className="trip-food__tags">
            {form.foods.map((food) => (
              <TypeTag key={food} label={food} onRemove={() => remove(food)} />
            ))}
          </div>
        )}
      </div>

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
