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
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 기피 음식 및 알레르기 (237:6962)
 *
 * ⚠ '아니오' 를 골랐을 때의 화면이 없습니다. 원본은 두 질문 모두 '네' 가 선택된
 *   상태만 그려져 있습니다. 자유 입력칸은 '네' 일 때만 보이도록 두었습니다
 *   (확인 필요 문서 참고).
 */
export default function MemberFood() {
  const navigate = useNavigate();
  const { form, setField } = useMemberForm();

  /**
   * TODO(api): 구성원 등록 API로 교체하세요.
   * 지금은 방금 입력한 값으로 카드 하나를 만들어 목록 화면에 넘깁니다.
   */
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

  // 두 질문 모두 * 필수입니다. 자유 입력칸에는 * 가 없어 선택으로 두었습니다.
  const canSubmit = form.hasAllergy !== null && form.hasDislikedFood !== null;

  return (
    <div className="member-food">
      {/* Header / Variant3 (237:6963) */}
      <Header
        className="member-food__header"
        variant="close"
        onBack={() => navigate(PATHS.planMembers)}
      />

      {/* title_L (237:6964) — y54, 86 */}
      <TitleL className="member-food__title">
        {form.name || "{구성원 이름}"} 님의
        <br />
        피해야 하는 음식에 대해 알려주세요.
      </TitleL>

      {/* 237:6965 — x24 y160, w342, gap 40 */}
      <div className="member-food__form">
        {/* 237:6966 */}
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

        {/* Frame 133 (237:6972) — padding 8/0, 라벨에 * 가 없습니다 */}
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

        {/* 237:6973 */}
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

        {/* Frame 147 (237:6978) */}
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

      {/* bottom (237:6979) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn
          variant="outline"
          onClick={() => navigate(PATHS.memberNewMealtime)}
        >
          이전으로
        </Btn>
        {/* 등록을 마치면 구성원 선택 화면으로 돌아갑니다 (237:6569 / 237:6579).
            방금 등록한 구성원이 선택된 채로 목록에 들어갑니다. */}
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          disabled={!canSubmit}
          onClick={() => canSubmit && finish()}
        >
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
