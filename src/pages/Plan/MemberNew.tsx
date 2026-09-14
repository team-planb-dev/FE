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
import Snackbar from "../../components/Snackbar/Snackbar";

import searchIcon from "../../assets/icn_search.svg";
import { useMemberForm } from "./memberFormContext";
import { useMemberSubmit } from "./useMemberSubmit";
import ExitRegistrationModal from "./ExitRegistrationModal";
import { PATHS } from "../../routes/paths";

const SUBTITLE = "입력한 정보는 일정 추천에만 사용돼요.";

/** 신규 구성원 등록 시작 */
export default function MemberNew() {
  const navigate = useNavigate();

  const [exitOpen, setExitOpen] = useState(false);
  const { form, setField } = useMemberForm();
  const { register, submitting, error } = useMemberSubmit();

  const considersHealth = form.considerHealth === "yes";

  const canSubmit =
    form.name.trim().length > 0 &&
    form.considerHealth !== null &&
    (!considersHealth || form.sensitiveAgreed);

  const handleSubmit = () => {
    if (!canSubmit || submitting) return;

    if (considersHealth) {
      navigate(PATHS.memberNewHealth);
      return;
    }

    // 건강조건을 고려하지 않으면 더 물어볼 것이 없어 여기서 바로 등록합니다
    void register();
  };

  return (
    <div className="member-new">
      <Header
        className="member-new__header"
        variant="close"
        backLabel="구성원 등록 그만두기"
        onBack={() => setExitOpen(true)}
      />

      <div className="member-new__heading">
        <TitleL>
          여행을 떠나는
          <br />
          인원에 대해 알려주세요.
        </TitleL>
        <Subtitle>{SUBTITLE}</Subtitle>
      </div>

      <div className="member-new__form">
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

      {error && <Snackbar className="member-new__snackbar">{error}</Snackbar>}

      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(PATHS.planMembers)}>
          그만두기
        </Btn>
        <Btn
          variant={canSubmit && !submitting ? "primary" : "muted"}
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {nextLabel(form.considerHealth === "no", submitting)}
        </Btn>
      </BottomBar>

      <ExitRegistrationModal open={exitOpen} onCancel={() => setExitOpen(false)} />
    </div>
  );
}

function nextLabel(registersHere: boolean, submitting: boolean): string {
  if (!registersHere) return "다음으로";
  return submitting ? "등록 중" : "등록하기";
}
