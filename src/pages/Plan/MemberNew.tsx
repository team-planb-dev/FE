import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MemberNew.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import Chips from "../../components/Chips/Chips";
import Checkbox from "../../components/Checkbox/Checkbox";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import searchIcon from "../../assets/icn_search.svg";
import { useMemberForm } from "./memberFormContext";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-6] 신규 구성원 등록 1단계 — 이름 + 건강조건 고려 여부
 *  237:6609 초기 · 237:6625 '네' 선택(동의 블록 등장)
 *  237:7029 / 237:6593 '아니오' 경로
 *
 * 개발 노트
 *  1 — 건강조건 고려에 '네'를 체크하면 하단에 정보 수집 동의가 나타납니다.
 *  2 — heading 옆 * 가 붙은 필수 항목을 모두 응답해야 [다음으로]가 활성화됩니다.
 *  3 — '아니오'로 [등록하기]를 누르면 건강정보 뱃지 없이 구성원 리스트에 등록됩니다.
 */

/**
 * ⚠ 피그마의 subtitle(237:6623 등)이 컴포넌트 기본값 "서브 텍스트입니다." 그대로입니다.
 *   한 줄(46px) 자리에 맞춰 임시로 작성했습니다. 확정되면 이 상수만 고치면 됩니다.
 */
const SUBTITLE = "입력한 정보는 일정 추천에만 사용돼요.";

export default function MemberNew() {
  const navigate = useNavigate();
  /** [6-7] 등록 중 이탈 확인 모달 (237:7248) */
  const [exitOpen, setExitOpen] = useState(false);
  const { form, setField } = useMemberForm();

  const considersHealth = form.considerHealth === "yes";

  // 개발 노트 2 — 필수 항목이 모두 채워져야 활성화됩니다.
  const canSubmit =
    form.name.trim().length > 0 &&
    form.considerHealth !== null &&
    (!considersHealth || form.sensitiveAgreed);

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (considersHealth) {
      navigate(PATHS.memberNewHealth);
      return;
    }
    // 개발 노트 3 — '아니오'는 여기서 바로 구성원 리스트로 등록됩니다.
    // TODO(api): 구성원 등록 API로 교체하세요.
    navigate(PATHS.planMembers);
  };

  return (
    <div className="member-new">
      {/* Header / Variant3 (237:6626) — 닫기(×)
          [6-7] 개발 노트 1 — × 는 등록 과정에서 아예 이탈합니다(237:7270). */}
      <Header
        className="member-new__header"
        variant="close"
        backLabel="구성원 등록 그만두기"
        onBack={() => setExitOpen(true)}
      />

      {/* heading (237:6645) — y54, title_L 86 + subtitle 46 */}
      <div className="member-new__heading">
        <TitleL>
          여행을 떠나는
          <br />
          인원에 대해 알려주세요.
        </TitleL>
        <Subtitle>{SUBTITLE}</Subtitle>
      </div>

      {/* 237:6635 — x24 y206, w342, gap 40
          ⚠ '아니오' 경로 프레임(237:7029 / 237:6593)만 y221 입니다.
            같은 내용이라 206 으로 맞췄습니다(확인 필요 문서 참고). */}
      <div className="member-new__form">
        {/* Frame 132 (237:6636) — 라벨 36 + 인풋 54 */}
        <Field
          label="구성원 이름"
          htmlFor="member-name"
          required
          spacing="none"
        >
          <TextInput
            id="member-name"
            value={form.name}
            onChange={(v) => setField("name", v)}
            placeholder="placeholder"
            leadingIcon={searchIcon}
          />
        </Field>

        {/* Frame 1707482488 (237:6639) — 라벨 36 + gap 8 + 칩 40 */}
        <Field
          label="이 여행자의 건강·생활조건을 고려할까요?"
          htmlFor="consider-health"
          required
          spacing="gap"
        >
          <div className="member-new__chips" id="consider-health">
            <Chips
              selected={form.considerHealth === "yes"}
              onClick={() => setField("considerHealth", "yes")}
            >
              네
            </Chips>
            <Chips
              selected={form.considerHealth === "no"}
              onClick={() => setField("considerHealth", "no")}
            >
              아니오
            </Chips>
          </div>
        </Field>
      </div>

      {/* Frame 138 (237:6627) — 개발 노트 1: '네'일 때만 나타납니다. x20 y646 */}
      {considersHealth && (
        <div className="member-new__consent">
          <p className="member-new__consent-label">
            건강조건을 고려하는 경우, 정보 수집 동의가 필요해요
          </p>

          <div className="member-new__consent-row">
            <span className="member-new__consent-check">
              <Checkbox
                id="sensitive-agree"
                checked={form.sensitiveAgreed}
                onChange={(checked) => setField("sensitiveAgreed", checked)}
              />
              <label
                className="member-new__consent-text"
                htmlFor="sensitive-agree"
              >
                [필수] 민감정보 수집·이용 동의
              </label>
            </span>

            <button
              type="button"
              className="member-new__consent-detail"
              onClick={() => navigate(PATHS.memberNewConsent)}
            >
              전체보기
            </button>
          </div>
        </div>
      )}

      {/* bottom (237:6648 / 237:6608) */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.planMembers)}>
          그만두기
        </Btn>
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {/* '아니오'만 [등록하기]입니다(개발 노트 3).
              아직 아무것도 고르지 않은 상태의 문구는 디자인에 없어 [다음으로]로 둡니다. */}
          {form.considerHealth === "no" ? "등록하기" : "다음으로"}
        </Btn>
      </BottomBar>

      {/* [6-7] 등록 중 이탈 (237:7248) — 딤이 하단 바까지 덮도록 맨 뒤에 둡니다 */}
      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}
