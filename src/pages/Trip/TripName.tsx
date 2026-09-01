import { useNavigate } from "react-router-dom";

import "./TripName.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

/** 일정 이름 입력 */
export default function TripName() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-name">
      <Header
        className="trip-name__header"
        onBack={() => navigate(PATHS.memberConfirm)}
      />

      <div className="trip-name__body">
        <TitleL className="trip-name__title">일정 이름을 작성해주세요.</TitleL>
        <Field
          className="trip-name__field"
          label="일정 이름"
          htmlFor="trip-name"
        >
          <TextInput
            id="trip-name"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="즐거운 가족여행"
          />
        </Field>
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.home)}>
          그만두기
        </Btn>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripRegion)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
