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
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 복약 정보 — 여행 중 챙겨야 하는 약이 있는지
 *  237:6654 초기 · 237:6666 '네' · 237:6678 '아니오'
 *
 * ⚠ 이 화면만 콘텐츠 컨테이너가 x20 입니다(다른 [6-6] 화면은 24 또는 25).
 *   원본 좌표를 그대로 재현했습니다.
 */

export default function MemberMeds() {
  const navigate = useNavigate();
  /** [6-7] 등록 중 이탈 확인 모달 (237:7248) */
  const [exitOpen, setExitOpen] = useState(false);
  const { form, setField } = useMemberForm();

  const canSubmit = form.takesMeds !== null;

  const handleNext = () => {
    if (!canSubmit) return;
    if (form.takesMeds === "yes") {
      navigate(PATHS.memberNewMedsDetail);
      return;
    }
    // '아니오'는 약 이름·복약 시점을 건너뛰고 바로 식사시간으로 갑니다.
    navigate(PATHS.memberNewMealtime);
  };

  return (
    <div className="member-meds">
      {/* Header / Variant3 (237:6655) */}
      <Header
        className="member-meds__header"
        variant="close"
        backLabel="구성원 등록 그만두기"
        onBack={() => setExitOpen(true)}
      />

      {/* heading (237:6662) — y54, title_L 86 + subtitle 68 = 154 */}
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

      {/* 237:6656 — x20 y228, w342, 라벨 36 + gap 8 + 칩 40 */}
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

      {/* bottom (237:6665 / 237:6677 / 237:6689) — 셋 다 이전으로 / 다음으로 */}
      <BottomBar>
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
      </BottomBar>

      {/* [6-7] 등록 중 이탈 (237:7248) — 딤이 하단 바까지 덮도록 맨 뒤에 둡니다 */}
      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}
