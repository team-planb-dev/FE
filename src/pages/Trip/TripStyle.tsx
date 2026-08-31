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

/**
 * Figma: [7-6] 여행 스타일 설정 (237:6471)
 *
 * ⚠ 카드 아이콘이 디자인에도 자리표시자(`icn_empty_lg`)입니다([7-4]와 같은 문제).
 * ⚠ 하나만 고르는지 여러 개 고를 수 있는지 적혀 있지 않습니다.
 *   그려진 화면에 한 개만 선택돼 있어 단일 선택으로 두었습니다.
 */
export default function TripStyle() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-choice">
      {/* Header / Variant2 (237:6472) */}
      <Header
        className="trip-choice__header"
        onBack={() => navigate(PATHS.tripPlace)}
      />

      {/* heading (344:9577) — y54 */}
      <div className="trip-choice__heading">
        <TitleL>어떤 여행을 원하시나요?</TitleL>
        <Subtitle>선호하는 여행 스타일을 알려주세요.</Subtitle>
      </div>

      {/* Frame 1707482563 (344:9565) — x24 y195, 342×342 */}
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

      {/* bottom (344:9556) — 이전으로 / 다음으로 */}
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
