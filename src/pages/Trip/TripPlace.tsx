import { useEffect, useState } from "react";
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
import { ApiRequestError } from "../../api/client";
import { searchPlaces } from "../../api/travel";
import type { Place } from "./placeData";
import { toPlace } from "./tripForm";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

const EMPTY_TEXT = "검색 결과가 없습니다";
const SEARCHING_TEXT = "검색 중입니다...";
const FAILED_TEXT = "검색하지 못했어요. 잠시 후 다시 시도해주세요.";

/** 서버가 HTTP 200 에 success:false 로 사유를 담아 보내는 경우가 있어 그대로 보여줍니다 */
function messageOf(caught: unknown): string {
  if (caught instanceof ApiRequestError) {
    const fromServer = caught.message.trim();
    if (fromServer) return fromServer;
  }

  return FAILED_TEXT;
}

/** 글자를 칠 때마다 부르지 않도록 잠깐 기다립니다 */
const SEARCH_DELAY_MS = 300;

/** 미리 정한 장소 검색·선택 */
export default function TripPlace() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const [query, setQuery] = useState("");

  // 어떤 검색어의 결과인지 같이 들고 있어야 다음 글자를 칠 때 이전 결과가 남지 않습니다
  const [found, setFound] = useState<{ query: string; places: Place[] } | null>(
    null,
  );
  const [failure, setFailure] = useState<{
    query: string;
    message: string;
  } | null>(null);

  const typed = query.trim();

  useEffect(() => {
    if (!typed) return;

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      searchPlaces(typed, controller.signal)
        .then((places) => {
          if (controller.signal.aborted) return;
          setFound({ query: typed, places: places.map(toPlace) });
        })
        .catch((caught: unknown) => {
          if (controller.signal.aborted) return;
          setFailure({ query: typed, message: messageOf(caught) });
        });
    }, SEARCH_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [typed]);

  const results = found?.query === typed ? found.places : [];
  const failed = failure?.query === typed ? failure.message : null;
  const searching = typed !== "" && !failed && found?.query !== typed;

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

  const emptyText = failed ?? (searching ? SEARCHING_TEXT : EMPTY_TEXT);

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

        {typed !== "" &&
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
            <CardPlaceEmpty text={emptyText} />
          ))}

        {typed === "" && form.places.length > 0 && (
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
