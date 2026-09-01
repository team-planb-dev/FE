import { useNavigate } from "react-router-dom";

import "./TripChoice.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import ChipsXL from "../../components/ChipsXL/ChipsXL";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { TRIP_THEMES, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** 여행 테마 선택 */
export default function TripTheme() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-choice">
      <Header
        className="trip-choice__header"
        onBack={() => navigate(PATHS.tripStyle)}
      />

      <div className="trip-choice__heading">
        <TitleL>어떤 여행을 원하시나요?</TitleL>
        <Subtitle>선호하는 여행 스타일을 알려주세요.</Subtitle>
      </div>

      <div className="trip-choice__options">
        {TRIP_THEMES.map((theme) => (
          <ChipsXL
            key={theme}
            label={theme}
            selected={form.theme === theme}
            onClick={() => setField("theme", theme)}
          />
        ))}
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripStyle)}>
          이전으로
        </Btn>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripFood)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
