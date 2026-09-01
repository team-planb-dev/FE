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

const EMAIL_CHECK_MESSAGE = {
  notFound: "가입되지 않은 이메일입니다.",
  found: "가입된 이메일입니다.",
} as const;

type EmailCheck = "idle" | "notFound" | "found";

const EMAIL_CHECK_TONE = { notFound: "negative", found: "positive" } as const;

/** 비밀번호 찾기 */
export default function FindPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState<EmailCheck>("idle");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleEmailCheck = () => {
    if (!isValidEmail(email.trim())) {
      setEmailCheck("notFound");
      return;
    }
    setEmailCheck((prev) => (prev === "found" ? "notFound" : "found"));
  };

  const canSubmit =
    emailCheck === "found" &&
    question.length > 0 &&
    answer.trim().length > 0 &&
    isValidPassword(password) &&
    password === passwordConfirm;

  const handleSubmit = () => {
    if (!canSubmit) return;

    navigate(PATHS.findPasswordResult, { replace: true, state: { done: true } });
  };

  return (
    <div className="find-password">
      <Header
        className="find-password__header"
        onBack={() => navigate(PATHS.login)}
      />

      <div className="find-password__scroll">
        <div className="find-password__content">
          <TitleL className="find-password__title">
            비밀번호를 잊어버리셨나요?
            <br />
            가입 시에 작성한 질문에 답해주세요.
          </TitleL>

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

      <BottomBar>
        <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
          확인
        </Btn>
      </BottomBar>
    </div>
  );
}
