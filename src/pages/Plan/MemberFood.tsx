import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MemberFood.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import Chips from "../../components/Chips/Chips";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { useMemberForm } from "./memberFormContext";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { useEditMode } from "./editMode";
import { PATHS } from "../../routes/paths";

/** 기피 음식 및 알레르기 입력 */
export default function MemberFood() {
  const navigate = useNavigate();

  const [exitOpen, setExitOpen] = useState(false);
  const { editing, backToMember } = useEditMode();
  const { form, setField } = useMemberForm();

  const finish = () => {
    const tags: string[] = [];
    if (form.hasAllergy === "yes") tags.push("알레르기 주의");
    if (form.takesMeds === "yes") tags.push("복약");
    tags.push(...form.conditions);

    navigate(PATHS.planMembers, {
      state: {
        justRegistered: true,
        newMember: {
          id: `new-${Date.now()}`,
          name: form.name || "{구성원 이름}",
          tags,
        },
      },
    });
  };
  const canSubmit = form.hasAllergy !== null && form.hasDislikedFood !== null;

  return (
    <div className="member-food">
      <Header
        className="member-food__header"
        variant="close"
        backLabel={editing ? "수정 그만두기" : "구성원 등록 그만두기"}
        onBack={() => (editing ? backToMember() : setExitOpen(true))}
      />

      <TitleL className="member-food__title">
        {form.name || "{구성원 이름}"} 님의
        <br />
        피해야 하는 음식에 대해 알려주세요.
      </TitleL>

      <div className="member-food__form">
        <Field
          label="음식 알레르기가 있나요?"
          htmlFor="has-allergy"
          required
          spacing="gap"
        >
          <div className="member-food__chips" id="has-allergy">
            <Chips
              selected={form.hasAllergy === "yes"}
              onClick={() => setField("hasAllergy", "yes")}
            >
              네
            </Chips>
            <Chips
              selected={form.hasAllergy === "no"}
              onClick={() => setField("hasAllergy", "no")}
            >
              아니오
            </Chips>
          </div>
        </Field>

        {form.hasAllergy === "yes" && (
          <Field
            label="알레르기를 일으킬 수 있는 음식을 알려주세요."
            htmlFor="allergy-text"
            spacing="default"
          >
            <TextInput
              id="allergy-text"
              value={form.allergyText}
              onChange={(v) => setField("allergyText", v)}
              placeholder="placeholder"
            />
          </Field>
        )}

        <Field
          label="먹고 싶지 않거나 피하고 싶은 음식이 있나요?"
          htmlFor="has-disliked"
          required
          spacing="gap"
        >
          <div className="member-food__chips" id="has-disliked">
            <Chips
              selected={form.hasDislikedFood === "yes"}
              onClick={() => setField("hasDislikedFood", "yes")}
            >
              네
            </Chips>
            <Chips
              selected={form.hasDislikedFood === "no"}
              onClick={() => setField("hasDislikedFood", "no")}
            >
              아니오
            </Chips>
          </div>
        </Field>

        {form.hasDislikedFood === "yes" && (
          <Field
            label="피하고 싶은 음식을 알려주세요."
            htmlFor="disliked-text"
            spacing="default"
          >
            <TextInput
              id="disliked-text"
              value={form.dislikedFoodText}
              onChange={(v) => setField("dislikedFoodText", v)}
              placeholder="placeholder"
            />
          </Field>
        )}
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
            <Btn
              variant="outline"
              onClick={() => navigate(PATHS.memberNewMealtime)}
            >
              이전으로
            </Btn>

            <Btn
              variant={canSubmit ? "primary" : "muted"}
              disabled={!canSubmit}
              onClick={() => canSubmit && finish()}
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
