import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./FindPassword.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import Select from "../../components/Select/Select";
import TextInput from "../../components/Input/TextInput";
import PasswordInput from "../../components/Input/PasswordInput";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { isValidEmail, isValidPassword } from "../../utils/validation";
import { RECOVERY_QUESTIONS } from "../../constants/recoveryQuestions";
import { PATHS } from "../../routes/paths";

import searchIcon from "../../assets/icn_search.svg";

/**
 * Figma: [4-5] 비밀번호 찾기 (237:7467)
 * 프레임 390×963 — 콘텐츠가 844를 넘어가 스크롤합니다.
 * 디자인 노트 — 헤더 왼쪽 화살표를 누르면 [S2] 로그인으로 돌아갑니다.
 *
 * ⚠ 이메일 "확인" 버튼의 결과 문구가 디자인에 없습니다.
 *   subtext_field(h33) 자리만 비워둔 채 상태 프레임이 없어서
 *   회원가입 중복 확인 문구(237:5909 / 237:5923)와 같은 어투로 임시 작성했습니다.
 *   확인 필요 문서에 질문으로 남겨두었습니다.
 */

/** 임시 문구 — 디자이너 확인 필요 */
const EMAIL_CHECK_MESSAGE = {
  notFound: "가입되지 않은 이메일입니다.",
  found: "가입된 이메일입니다.",
} as const;

type EmailCheck = "idle" | "notFound" | "found";

const EMAIL_CHECK_TONE = { notFound: "negative", found: "positive" } as const;

export default function FindPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState<EmailCheck>("idle");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // TODO(api): 가입 이메일 조회 API로 교체하세요.
  // 지금은 서버가 없어 임시로 동작합니다 — 처음 누르면 "가입된 이메일",
  // 한 번 더 누르면 "가입되지 않은 이메일"이 되어 두 상태를 모두 확인할 수 있습니다.
  const handleEmailCheck = () => {
    if (!isValidEmail(email.trim())) {
      setEmailCheck("notFound");
      return;
    }
    setEmailCheck((prev) => (prev === "found" ? "notFound" : "found"));
  };

  // 디자인에 오류 상태 프레임이 없어, 회원가입 화면과 같은 방식으로
  // 조건이 모두 충족될 때까지 하단 버튼을 비활성으로 둡니다.
  const canSubmit =
    emailCheck === "found" &&
    question.length > 0 &&
    answer.trim().length > 0 &&
    isValidPassword(password) &&
    password === passwordConfirm;

  const handleSubmit = () => {
    if (!canSubmit) return;

    // TODO(api): 비밀번호 재설정 API로 교체하세요.
    navigate(PATHS.findPasswordResult, { replace: true, state: { done: true } });
  };

  return (
    <div className="find-password">
      <Header
        className="find-password__header"
        onBack={() => navigate(PATHS.login)}
      />

      <div className="find-password__scroll">
        {/* Frame (237:7469) — top 54, gap 40 */}
        <div className="find-password__content">
          <TitleL className="find-password__title">
            비밀번호를 잊어버리셨나요?
            <br />
            가입 시에 작성한 질문에 답해주세요.
          </TitleL>

          {/* 237:7471 — 342×123 (라벨 36 + 인풋 54 + subtext 33) */}
          <Field
            className="find-password__field"
            label="가입한 이메일을 입력해주세요."
            htmlFor="find-password-email"
            spacing="none"
            reserveSubtext
            subtext={
              emailCheck === "idle"
                ? undefined
                : EMAIL_CHECK_MESSAGE[emailCheck]
            }
            subtextTone={
              emailCheck === "idle" ? "default" : EMAIL_CHECK_TONE[emailCheck]
            }
          >
            <div className="find-password__check-row">
              <TextInput
                id="find-password-email"
                className="find-password__check-input"
                type="email"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setEmailCheck("idle");
                }}
                placeholder="example@email.com"
                autoComplete="email"
                leadingIcon={email ? undefined : searchIcon}
                status={
                  emailCheck === "idle" ? undefined : EMAIL_CHECK_TONE[emailCheck]
                }
              />
              <Btn
                variant="outline"
                className="find-password__check-btn"
                onClick={handleEmailCheck}
              >
                확인
              </Btn>
            </div>
          </Field>

          {/* 237:7473 — 342×90 */}
          <Field
            className="find-password__field"
            label="가입 시 설정한 계정 복구 질문을 선택해주세요."
            htmlFor="find-password-question"
            spacing="none"
          >
            <Select
              id="find-password-question"
              value={question}
              onChange={setQuestion}
              options={RECOVERY_QUESTIONS}
              placeholder="계정 복구 질문을 선택해주세요."
            />
          </Field>

          {/* 237:7476 — 342×90 */}
          <Field
            className="find-password__field"
            label="질문의 답변을 작성해주세요."
            htmlFor="find-password-answer"
            spacing="none"
          >
            <TextInput
              id="find-password-answer"
              value={answer}
              onChange={setAnswer}
              placeholder="placeholder"
              leadingIcon={searchIcon}
            />
          </Field>

          {/* 237:7479 — 342×90, Frame 130 Variant2(필수 표시) */}
          <Field
            className="find-password__field"
            label="새 비밀번호"
            htmlFor="find-password-new"
            required
            spacing="none"
          >
            <PasswordInput
              id="find-password-new"
              value={password}
              onChange={setPassword}
              placeholder="password"
              autoComplete="new-password"
            />
          </Field>

          {/* 237:7482 — 342×90 */}
          <Field
            className="find-password__field"
            label="새 비밀번호 확인"
            htmlFor="find-password-new-confirm"
            required
            spacing="none"
          >
            <PasswordInput
              id="find-password-new-confirm"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="password"
              autoComplete="new-password"
            />
          </Field>
        </div>
      </div>

      {/* bottom (237:7485) */}
      <BottomBar>
        <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
          확인
        </Btn>
      </BottomBar>
    </div>
  );
}
