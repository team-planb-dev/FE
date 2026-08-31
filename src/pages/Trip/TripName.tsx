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

/**
 * Figma: [7-1] 일정 이름 작성 (237:6557)
 *
 * ⚠ 라벨에 `*` 가 없고 초기 상태에서도 `다음으로` 가 활성색입니다.
 *   [6-6]은 `*` 가 붙은 항목만 채워야 활성화되는 규칙이었는데(개발 노트 2),
 *   여기는 `*` 도 개발 노트도 없어 **디자인 그대로 항상 활성**으로 두었습니다.
 *   이름 없이 넘어갈 수 있다는 뜻입니다 — 확인 필요 문서 참고.
 *
 * ⚠ 헤더 ← 의 목적지가 디자인에 없습니다.
 */
export default function TripName() {
  const navigate = useNavigate();
  const { form, setField } = useTripForm();

  return (
    <div className="trip-name">
      {/* Header / Variant2 (237:6558) */}
      <Header
        className="trip-name__header"
        onBack={() => navigate(PATHS.memberConfirm)}
      />

      {/* Frame 1707482555 (343:6572) — y54, gap 20 */}
      <div className="trip-name__body">
        <TitleL className="trip-name__title">일정 이름을 작성해주세요.</TitleL>

        {/* Frame 132 (237:6563) — x20 w350 */}
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

      {/* bottom (343:6537) — 그만두기 / 다음으로 */}
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
