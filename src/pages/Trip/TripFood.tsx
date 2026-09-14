import { useEffect, useState } from "react";
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
import { recommendLocalFoods } from "../../api/travel";
import { locationDoOf, locationSiOf } from "./regionData";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

const SUGGEST_LABEL = "AI 추천 키워드";

/** 지역 음식 선택. 추천에서 고른 것과 직접 적은 것을 서버가 따로 받습니다 */
export default function TripFood() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const locationDo = locationDoOf(form.province);
  const locationSigungu = locationSiOf(form.district) ?? "";

  useEffect(() => {
    if (!locationDo) return;

    const controller = new AbortController();

    recommendLocalFoods(locationDo, locationSigungu, controller.signal)
      .then((foods) => {
        if (!controller.signal.aborted) setSuggestions(foods);
      })
      .catch(() => {
        // 추천이 실패해도 직접 입력으로 넘어갈 수 있게 비워만 둡니다
        if (!controller.signal.aborted) setSuggestions([]);
      });

    return () => controller.abort();
  }, [locationDo, locationSigungu]);

  const picked = [...form.recommendFoods, ...form.localFoods];
  const typed = query.trim();

  const shown = suggestions.filter(
    (food) => !picked.includes(food) && (!typed || food.includes(typed)),
  );

  // 추천에 없는 음식은 직접 추가할 수 있습니다
  const canAddTyped =
    typed !== "" && !picked.includes(typed) && !suggestions.includes(typed);

  const addRecommended = (food: string) => {
    setField("recommendFoods", [...form.recommendFoods, food]);
    setQuery("");
  };

  const addTyped = () => {
    if (!canAddTyped) return;

    setField("localFoods", [...form.localFoods, typed]);
    setQuery("");
  };

  const remove = (food: string) => {
    if (form.recommendFoods.includes(food)) {
      setField(
        "recommendFoods",
        form.recommendFoods.filter((f) => f !== food),
      );
      return;
    }

    setField(
      "localFoods",
      form.localFoods.filter((f) => f !== food),
    );
  };

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
          onEnter={addTyped}
          placeholder="지역음식을 입력하세요"
          leadingIcon={searchIcon}
        />

        {(shown.length > 0 || canAddTyped) && (
          <div className="trip-food__suggest">
            <p className="trip-food__suggest-label">{SUGGEST_LABEL}</p>
            <div className="trip-food__suggest-chips">
              {canAddTyped && (
                <ChipsM selected={false} onClick={addTyped}>
                  {`${typed} 추가`}
                </ChipsM>
              )}
              {shown.map((food) => (
                <ChipsM
                  key={food}
                  selected={false}
                  onClick={() => addRecommended(food)}
                >
                  {food}
                </ChipsM>
              ))}
            </div>
          </div>
        )}

        {picked.length > 0 && (
          <div className="trip-food__tags">
            {picked.map((food) => (
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
