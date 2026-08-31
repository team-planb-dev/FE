import { useNavigate } from "react-router-dom";

import "./MemberHealth.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import Chips from "../../components/Chips/Chips";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { CONDITIONS, WALK_LEVELS, useMemberForm } from "./memberFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 신규 구성원 등록 — 관리 질환 + 걷기 정도
 *  237:6856 미선택 / 237:6875 선택
 *
 * ⚠ 두 프레임의 내용은 같은데 컨테이너 폭이 342 / 310 으로 다릅니다.
 *   나머지 화면과 같은 342 로 두었습니다(확인 필요 문서 참고).
 *
 * 이 화면에는 subtitle 이 없고 title_L 만 있습니다.
 */
export default function MemberHealth() {
  const navigate = useNavigate();
  const { form, setField, toggleCondition } = useMemberForm();

  // 두 질문 모두 * 필수입니다.
  const canSubmit = form.conditions.length > 0 && form.walkLevel !== null;

  return (
    <div className="member-health">
      {/* Header / Variant3 (237:6857) */}
      <Header
        className="member-health__header"
        variant="close"
        onBack={() => navigate(PATHS.planMembers)}
      />

      {/* title_L (237:6873) — y54, 86. 원본은 "{구성원 이름} 님의" 입니다. */}
      <TitleL className="member-health__title">
        {form.name || "{구성원 이름}"} 님의
        <br />
        건강정보를 알려주세요.
      </TitleL>

      {/* 237:6858 — x24 y176, w342, gap 40 */}
      <div className="member-health__form">
        {/* 237:6859 — 라벨 36 + gap 8 + 칩 40 */}
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

        {/* 237:6866 — 라벨 36 + gap 8 + 칩 3줄(gap 12) */}
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

      {/* bottom (237:6874) — 1단계와 달리 왼쪽이 [이전으로]입니다 */}
      <BottomBar>
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
      </BottomBar>
    </div>
  );
}
