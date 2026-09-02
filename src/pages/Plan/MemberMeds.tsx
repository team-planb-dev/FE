import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MemberMeds.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import Field from "../../components/Field/Field";
import Chips from "../../components/Chips/Chips";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { useMemberForm } from "./memberFormContext";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { useEditMode } from "./editMode";
import { PATHS } from "../../routes/paths";

/** 복약 여부 선택 */
export default function MemberMeds() {
  const navigate = useNavigate();

  const [exitOpen, setExitOpen] = useState(false);
  const { editing, backToMember } = useEditMode();
  const { form, setField } = useMemberForm();

  const canSubmit = form.takesMeds !== null;

  const handleNext = () => {
    if (!canSubmit) return;
    if (form.takesMeds === "yes") {
      navigate(PATHS.memberNewMedsDetail);
      return;
    }

    navigate(PATHS.memberNewMealtime);
  };

  return (
    <div className="member-meds">
      <Header
        className="member-meds__header"
        variant="close"
        backLabel={editing ? "수정 그만두기" : "구성원 등록 그만두기"}
        onBack={() => (editing ? backToMember() : setExitOpen(true))}
      />

      <div className="member-meds__heading">
        <TitleL>
          {form.name || "{구성원 이름}"} 님의
          <br />
          복약정보를 알려주세요
        </TitleL>
        <Subtitle>
          처방전이나  안내받은 내용이 있을 때만 입력해주세요.
          <br />
          {"{서비스명}"}이 복약시간을 새로 결정하지 않습니다.
        </Subtitle>
      </div>

      <div className="member-meds__form">
        <Field
          label="여행 중 시간에 맞춰 챙겨야 하는 약이 있나요?"
          htmlFor="takes-meds"
          required
          spacing="gap"
        >
          <div className="member-meds__chips" id="takes-meds">
            <Chips
              selected={form.takesMeds === "yes"}
              onClick={() => setField("takesMeds", "yes")}
            >
              네
            </Chips>
            <Chips
              selected={form.takesMeds === "no"}
              onClick={() => setField("takesMeds", "no")}
            >
              아니오
            </Chips>
          </div>
        </Field>
      </div>

      <BottomBar>
        {editing ? (
          <>
            <Btn variant="outline" onClick={backToMember}>
              취소
            </Btn>
            <Btn
              variant={canSubmit ? "primary" : "muted"}
              disabled={!canSubmit}
              onClick={() => canSubmit && backToMember()}
            >
              저장
            </Btn>
          </>
        ) : (
          <>
            <Btn variant="outline" onClick={() => navigate(PATHS.memberNewHealth)}>
              이전으로
            </Btn>
            <Btn
              variant={canSubmit ? "primary" : "muted"}
              disabled={!canSubmit}
              onClick={handleNext}
            >
              다음으로
            </Btn>
          </>
        )}
      </BottomBar>

      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}
