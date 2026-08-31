import { useNavigate } from "react-router-dom";

import "./MemberMedsDetail.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import Chips from "../../components/Chips/Chips";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { MEDS_TIMINGS, useMemberForm } from "./memberFormContext";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 약 이름 + 복약 시점 (237:6690 / 237:6704 / 237:6717)
 *
 * 개발 노트
 *  · '특정 시간대에 먹어요'를 고르면 복약 시간 옵션이 나타납니다 (237:6731).
 *  · '식사를 기준으로 기억해요'를 고르면 복약 시간 옵션과
 *    '정확한 간격(선택)' 옵션이 나타납니다 (237:6753).
 *  두 상세 옵션은 2b 에서 붙입니다.
 */
export default function MemberMedsDetail() {
  const navigate = useNavigate();
  const { form, setField } = useMemberForm();

  const canSubmit =
    form.medsLabel.trim().length > 0 && form.medsTiming !== null;

  return (
    <div className="member-meds-detail">
      {/* Header / Variant3 (237:6691) */}
      <Header
        className="member-meds-detail__header"
        variant="close"
        onBack={() => navigate(PATHS.planMembers)}
      />

      {/* heading (237:6700) — 복약 여부 화면과 같은 제목·부제 */}
      <div className="member-meds-detail__heading">
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

      {/* 237:6692 — x24 y228, w342, gap 40 */}
      <div className="member-meds-detail__form">
        {/* Frame 133 (237:6693) — padding 8/0, gap 8 → 라벨 36 + 인풋 54 + 패딩 16 = 114 */}
        <Field
          label="일정에서 약을 어떤 이름으로 보여드릴까요? "
          htmlFor="meds-label"
          required
          spacing="default"
        >
          <TextInput
            id="meds-label"
            value={form.medsLabel}
            onChange={(v) => setField("medsLabel", v)}
            placeholder="placeholder"
          />
        </Field>

        {/* 237:6694 — 라벨 36 + gap 8 + 칩 3줄(gap 12) */}
        <Field
          label="언제 챙기면 되나요?"
          htmlFor="meds-timing"
          required
          spacing="gap"
        >
          <div className="member-meds-detail__chips" id="meds-timing">
            {MEDS_TIMINGS.map((timing) => (
              <Chips
                key={timing}
                selected={form.medsTiming === timing}
                onClick={() => setField("medsTiming", timing)}
              >
                {timing}
              </Chips>
            ))}
          </div>
        </Field>
      </div>

      {/* bottom (237:6703) — 이전으로 / 다음으로 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.memberNewMeds)}>
          이전으로
        </Btn>
        {/* TODO(route): 선택한 시점에 따른 상세 옵션 화면(237:6731 / 237:6753)은 2b 에서 붙입니다. */}
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          disabled={!canSubmit}
          onClick={() => {}}
        >
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
