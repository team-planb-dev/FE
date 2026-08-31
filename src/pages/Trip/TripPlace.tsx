import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./TripPlace.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import TextInput from "../../components/Input/TextInput";
import CardPlace, { CardPlaceEmpty } from "../../components/CardPlace/CardPlace";
import TypeTag from "../../components/TypeTag/TypeTag";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import searchIcon from "../../assets/icn_search.svg";
import { searchPlaces } from "./placeData";
import type { Place } from "./placeData";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** Figma 344:11111 */
const EMPTY_TEXT = "검색 결과가 없습니다";

/**
 * Figma: [7-5] 미리 정해진 장소 선택
 *  343:8485 초기 · 343:8534 검색 결과 · 344:9712 1개 선택
 *  344:10973 복수 선택 · 344:11070 검색 결과 없음
 *
 * 검색해서 고르면 인풋 아래 태그로 올라가고 검색어는 비워집니다(344:9712).
 * 프레임 이름이 "복수선택하는 경우"(344:10973)라 여러 개 고를 수 있습니다.
 */
export default function TripPlace() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [query, setQuery] = useState("");
  const results = searchPlaces(query);

  const add = (place: Place) => {
    if (!form.places.some((p) => p.id === place.id)) {
      setField("places", [...form.places, place]);
    }
    // 344:9712 — 고르고 나면 인풋이 비어 있습니다.
    setQuery("");
  };

  const remove = (id: string) =>
    setField(
      "places",
      form.places.filter((p) => p.id !== id),
    );

  return (
    <div className="trip-place">
      {/* Header / Variant2 (343:8486) */}
      <Header
        className="trip-place__header"
        onBack={() => navigate(PATHS.tripTransport)}
      />

      {/* heading (343:8507) — y54 */}
      <div className="trip-place__heading">
        <TitleL>미리 정해진 장소가 있나요?</TitleL>
        <Subtitle>예약한 숙소 혹은 관광지를 알려주세요.</Subtitle>
      </div>

      {/* Frame 1707482565 (343:9015) — x24 y195, gap 20 */}
      <div className="trip-place__form">
        {/* Input (343:8529) — 돋보기 + 지우기 */}
        <TextInput
          id="trip-place-search"
          value={query}
          onChange={setQuery}
          placeholder="장소를 검색해보세요"
          leadingIcon={searchIcon}
        />

        {/* 검색 중이면 결과 목록(343:9007 / 344:11079) */}
        {query.trim() !== "" &&
          (results.length > 0 ? (
            <div className="trip-place__list">
              {results.map((place) => (
                <CardPlace
                  key={place.id}
                  name={place.name}
                  address={place.address}
                  onClick={() => add(place)}
                />
              ))}
            </div>
          ) : (
            <CardPlaceEmpty text={EMPTY_TEXT} />
          ))}

        {/* 고른 장소 태그 (344:9747 / 344:11003) */}
        {query.trim() === "" && form.places.length > 0 && (
          <div className="trip-place__tags">
            {form.places.map((place) => (
              <TypeTag
                key={place.id}
                label={place.name}
                onRemove={() => remove(place.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* bottom (343:8492) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripTransport)}>
          이전으로
        </Btn>
        {/* "미리 정해진 장소가 있나요?" 라 아무것도 안 골라도 넘어갑니다. */}
        <Btn variant="primary" onClick={() => navigate(PATHS.tripStyle)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
