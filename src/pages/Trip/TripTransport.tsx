import { useNavigate } from "react-router-dom";

import "./TripTransport.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import ChipsXL from "../../components/ChipsXL/ChipsXL";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { TRANSPORTS, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [7-4] 이동수단 선택
 *  343:8323 미선택 · 344:9531 자가용 선택
 *
 * ⚠ 두 카드의 아이콘이 디자인에도 자리표시자(`icn_empty_lg`)입니다.
 *   분홍 상자에 "아이콘" 이라고만 적혀 있어 그대로 재현했습니다.
 */
export default function TripTransport() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-transport">
      {/* Header / Variant2 (343:8324) */}
      <Header
        className="trip-transport__header"
        onBack={() => navigate(PATHS.tripDate)}
      />

      <TitleL className="trip-transport__title">어떻게 이동하시나요?</TitleL>

      {/* Frame 1707482563 (343:8449) — x24 y149, gap 8 */}
      <div className="trip-transport__options">
        {TRANSPORTS.map((transport) => (
          <ChipsXL
            key={transport}
            label={transport}
            selected={form.transport === transport}
            onClick={() => setField("transport", transport)}
          />
        ))}
      </div>

      {/* bottom (343:8419) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripDate)}>
          이전으로
        </Btn>
        {/* TODO(route): [7-5] 장소 선택 화면이 생기면 연결해주세요. */}
        <Btn variant="primary" onClick={() => undefined}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
