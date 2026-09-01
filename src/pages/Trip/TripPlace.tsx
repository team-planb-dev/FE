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

const EMPTY_TEXT = "검색 결과가 없습니다";

/** 미리 정한 장소 검색·선택 */
export default function TripPlace() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [query, setQuery] = useState("");
  const results = searchPlaces(query);

  const add = (place: Place) => {
    if (!form.places.some((p) => p.id === place.id)) {
      setField("places", [...form.places, place]);
    }

    setQuery("");
  };

  const remove = (id: string) =>
    setField(
      "places",
      form.places.filter((p) => p.id !== id),
    );

  return (
    <div className="trip-place">
      <Header
        className="trip-place__header"
        onBack={() => navigate(PATHS.tripTransport)}
      />

      <div className="trip-place__heading">
        <TitleL>미리 정해진 장소가 있나요?</TitleL>
        <Subtitle>예약한 숙소 혹은 관광지를 알려주세요.</Subtitle>
      </div>

      <div className="trip-place__form">
        <TextInput
          id="trip-place-search"
          value={query}
          onChange={setQuery}
          placeholder="장소를 검색해보세요"
          leadingIcon={searchIcon}
        />

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

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripTransport)}>
          이전으로
        </Btn>

        <Btn variant="primary" onClick={() => navigate(PATHS.tripStyle)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
