import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Signup.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import PasswordInput from "../../components/Input/PasswordInput";
import Select from "../../components/Select/Select";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { isValidEmail, isValidPassword } from "../../utils/validation";
import { useSignup } from "./signupContext";
import { RECOVERY_QUESTIONS } from "../../constants/recoveryQuestions";
import { PATHS } from "../../routes/paths";

import searchIcon from "../../assets/icn_search.svg";

const PASSWORD_HINT = "영문, 숫자, 특문 중 2개 조합 8자 이상";

type CheckResult = "idle" | "taken" | "available";

const CHECK_MESSAGE = {
  nickname: {
    taken: "사용할 수 없는 닉네임입니다.",
    available: "사용할 수 있는 닉네임입니다.",
  },
  email: {
    taken: "사용할 수 없는 이메일입니다.",
    available: "사용할 수 있는 이메일입니다.",
  },
} as const;

const CHECK_TONE = { taken: "negative", available: "positive" } as const;

/** 회원가입 정보 입력 */
export default function Signup() {
  const navigate = useNavigate();
  const { form, setField } = useSignup();
  const { nickname, email, password, passwordConfirm, question, answer } = form;

  const setNickname = (v: string) => setField("nickname", v);
  const setEmail = (v: string) => setField("email", v);
  const setPassword = (v: string) => setField("password", v);
  const setPasswordConfirm = (v: string) => setField("passwordConfirm", v);
  const setQuestion = (v: string) => setField("question", v);
  const setAnswer = (v: string) => setField("answer", v);

  const [nicknameCheck, setNicknameCheck] = useState<CheckResult>("idle");
  const [emailCheck, setEmailCheck] = useState<CheckResult>("idle");

  const toggleCheck = (
    current: CheckResult,
    set: (next: CheckResult) => void,
  ) => set(current === "available" ? "taken" : "available");

  const canSubmit =
    nickname.trim().length > 0 &&
    isValidEmail(email.trim()) &&
    isValidPassword(password) &&
    password === passwordConfirm &&
    question.length > 0 &&
    answer.trim().length > 0 &&
    nicknameCheck === "available" &&
    emailCheck === "available";

  return (
    <div className="signup-page">
      <Header
        className="signup-page__header"
        onBack={() => navigate(PATHS.login)}
      />

      <div className="signup-page__scroll">
        <div className="signup-page__content">
          <TitleL className="signup-page__title">
            만나서 반가워요!
            <br />
            가입에 필요한 정보를 입력해주세요
          </TitleL>

          <div className="signup-page__fields">
            <Field
              label="닉네임"
              htmlFor="signup-nickname"
              required
              spacing="none"
              reserveSubtext
              subtext={
                nicknameCheck === "idle"
                  ? undefined
                  : CHECK_MESSAGE.nickname[nicknameCheck]
              }
              subtextTone={
                nicknameCheck === "idle" ? "default" : CHECK_TONE[nicknameCheck]
              }
            >
              <div className="signup-page__check-row">
                <TextInput
                  id="signup-nickname"
                  className="signup-page__check-input"
                  value={nickname}
                  onChange={(v) => {
                    setNickname(v);
                    setNicknameCheck("idle");
                  }}
                  placeholder="국·영문 8자 이하"
                  leadingIcon={nickname ? undefined : searchIcon}
                  status={
                    nicknameCheck === "idle" ? undefined : CHECK_TONE[nicknameCheck]
                  }
                />
                <Btn
                  variant="outline"
                  className="signup-page__check-btn"
                  onClick={() => toggleCheck(nicknameCheck, setNicknameCheck)}
                >
                  중복 확인
                </Btn>
              </div>
            </Field>

            <Field
              label="이메일"
              htmlFor="signup-email"
              required
              spacing="none"
              reserveSubtext
              subtext={
                emailCheck === "idle"
                  ? undefined
                  : CHECK_MESSAGE.email[emailCheck]
              }
              subtextTone={
                emailCheck === "idle" ? "default" : CHECK_TONE[emailCheck]
              }
            >
              <div className="signup-page__check-row">
                <TextInput
                  id="signup-email"
                  className="signup-page__check-input"
                  type="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v);
                    setEmailCheck("idle");
                  }}
                  placeholder="example@email.com"
                  leadingIcon={email ? undefined : searchIcon}
                  autoComplete="email"
                  status={emailCheck === "idle" ? undefined : CHECK_TONE[emailCheck]}
                />
                <Btn
                  variant="outline"
                  className="signup-page__check-btn"
                  onClick={() => toggleCheck(emailCheck, setEmailCheck)}
                >
                  중복 확인
                </Btn>
              </div>
            </Field>

            <Field
              label="비밀번호"
              htmlFor="signup-password"
              required
              spacing="no-gap"
              subtext={PASSWORD_HINT}
            >
              <PasswordInput
                id="signup-password"
                value={password}
                onChange={setPassword}
                placeholder="password"
                autoComplete="new-password"
              />
            </Field>

            <Field
              label="비밀번호 확인"
              htmlFor="signup-password-confirm"
              required
              spacing="no-gap"
            >
              <PasswordInput
                id="signup-password-confirm"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                placeholder="password"
                autoComplete="new-password"
              />
            </Field>

            <Field
              label="계정 분실 시 복구 질문을 선택해주세요"
              htmlFor="signup-question"
              required
            >
              <Select
                id="signup-question"
                value={question}
                onChange={setQuestion}
                options={RECOVERY_QUESTIONS}
              />
            </Field>

            <Field
              label="질문의 답변을 작성해주세요."
              htmlFor="signup-answer"
              required
            >
              <TextInput
                id="signup-answer"
                value={answer}
                onChange={setAnswer}
                placeholder="placeholder"
              />
            </Field>
          </div>
        </div>
      </div>

      <BottomBar>
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          onClick={() => canSubmit && navigate(PATHS.signupTerms)}
        >
          가입하기
        </Btn>
      </BottomBar>
    </div>
  );
}
