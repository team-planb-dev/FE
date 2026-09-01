import { useNavigate } from "react-router-dom";

import "./TripTransport.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import ChipsXL from "../../components/ChipsXL/ChipsXL";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { TRANSPORTS, useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** 이동수단 선택 */
export default function TripTransport() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-transport">
      <Header
        className="trip-transport__header"
        onBack={() => navigate(PATHS.tripDate)}
      />

      <TitleL className="trip-transport__title">어떻게 이동하시나요?</TitleL>
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

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.tripDate)}>
          이전으로
        </Btn>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripPlace)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
