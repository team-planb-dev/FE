import { useNavigate } from "react-router-dom";

import "./TripChoice.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import ChipsXL from "../../components/ChipsXL/ChipsXL";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { TRIP_STYLES, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** 여행 스타일 선택 */
export default function TripStyle() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-choice">
      <Header
        className="trip-choice__header"
        onBack={() => navigate(PATHS.tripPlace)}
      />

      <div className="trip-choice__heading">
        <TitleL>어떤 여행을 원하시나요?</TitleL>
        <Subtitle>선호하는 여행 스타일을 알려주세요.</Subtitle>
      </div>

      <div className="trip-choice__options">
        {TRIP_STYLES.map((style) => (
          <ChipsXL
            key={style}
            label={style}
            selected={form.style === style}
            onClick={() => setField("style", style)}
          />
        ))}
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripPlace)}>
          이전으로
        </Btn>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripTheme)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
