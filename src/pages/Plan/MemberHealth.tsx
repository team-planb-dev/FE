import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MemberHealth.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import Chips from "../../components/Chips/Chips";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { CONDITIONS, WALK_LEVELS, useMemberForm } from "./memberFormContext";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { useEditMode } from "./editMode";
import { PATHS } from "../../routes/paths";

/** 관리 질환과 걷기 정도 선택 */
export default function MemberHealth() {
  const navigate = useNavigate();

  const [exitOpen, setExitOpen] = useState(false);
  const { editing, backToMember } = useEditMode();
  const { form, setField, toggleCondition } = useMemberForm();

  const canSubmit = form.conditions.length > 0 && form.walkLevel !== null;

  return (
    <div className="member-health">
      <Header
        className="member-health__header"
        variant="close"
        backLabel={editing ? "수정 그만두기" : "구성원 등록 그만두기"}
        onBack={() => (editing ? backToMember() : setExitOpen(true))}
      />

      <TitleL className="member-health__title">
        {form.name || "{구성원 이름}"} 님의
        <br />
        건강정보를 알려주세요.
      </TitleL>

      <div className="member-health__form">
        <Field
          label="관리하는 질환이 있나요? (복수선택 가능)"
          htmlFor="conditions"
          required
          spacing="gap"
        >
          <div className="member-health__chips-row" id="conditions">
            {CONDITIONS.map((condition) => (
              <Chips
                key={condition}
                selected={form.conditions.includes(condition)}
                onClick={() => toggleCondition(condition)}
              >
                {condition}
              </Chips>
            ))}
          </div>
        </Field>

        <Field
          label="여행에서 걷는 정도는 어떻게 하고 싶나요?"
          htmlFor="walk-level"
          required
          spacing="gap"
        >
          <div className="member-health__chips-col" id="walk-level">
            {WALK_LEVELS.map((level) => (
              <Chips
                key={level}
                selected={form.walkLevel === level}
                onClick={() => setField("walkLevel", level)}
              >
                {level}
              </Chips>
            ))}
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
            <Btn variant="outline" onClick={() => navigate(PATHS.memberNew)}>
              이전으로
            </Btn>
            <Btn
              variant={canSubmit ? "primary" : "muted"}
              disabled={!canSubmit}
              onClick={() => canSubmit && navigate(PATHS.memberNewMeds)}
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
