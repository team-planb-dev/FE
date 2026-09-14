import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./TripName.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import type { Member } from "../Plan/memberData";
import { useTripForm } from "./tripFormContext";
import { PATHS } from "../../routes/paths";

function sameMembers(a: Member[], b: Member[]) {
  return a.length === b.length && a.every((m, i) => m.id === b[i].id);
}

/** 일정 이름 입력. [6-5] 에서 확정한 구성원을 여기서 폼에 받아둡니다 */
export default function TripName() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  const passed = (useLocation().state as { members?: Member[] } | null)?.members;

  // 다음 단계로 넘어가면 location.state 가 사라져서 폼에 옮겨둡니다
  useEffect(() => {
    if (!passed || passed.length === 0) return;
    if (sameMembers(passed, form.members)) return;

    setField("members", passed);
  }, [passed, form.members, setField]);

  return (
    <div className="trip-name">
      <Header
        className="trip-name__header"
        onBack={() =>
          navigate(PATHS.memberConfirm, { state: { members: form.members } })
        }
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
