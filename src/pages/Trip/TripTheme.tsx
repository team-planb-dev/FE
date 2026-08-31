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

/**
 * Figma: [7-7] 여행 테마 설정 (344:9591)
 *
 * ⚠ 제목과 부제가 [7-6] 여행 스타일과 **똑같습니다** —
 *   "어떤 여행을 원하시나요? / 선호하는 여행 스타일을 알려주세요."
 *   테마 화면인데 스타일을 알려달라고 합니다. 원본 그대로 두었습니다
 *   (확인 필요 문서 참고).
 */
export default function TripTheme() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-choice">
      {/* Header / Variant2 (344:9592) */}
      <Header
        className="trip-choice__header"
        onBack={() => navigate(PATHS.tripStyle)}
      />

      {/* heading (344:9595) — y54.
          ⚠ [7-6]과 같은 문구입니다. */}
      <div className="trip-choice__heading">
        <TitleL>어떤 여행을 원하시나요?</TitleL>
        <Subtitle>선호하는 여행 스타일을 알려주세요.</Subtitle>
      </div>

      {/* Frame 1707482563 (344:9598) — x24 y195, 342×342 */}
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

      {/* bottom (344:9602) — 이전으로 / 다음으로 */}
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
