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

import {
  checkNicknameDuplication,
  checkUsernameDuplication,
} from "../../api/user";
import { useRecoveryQuestions } from "../../api/useRecoveryQuestions";
import { isValidEmail, isValidPassword } from "../../utils/validation";
import { useSignup } from "./signupContext";
import { PATHS } from "../../routes/paths";

import searchIcon from "../../assets/icn_search.svg";

const PASSWORD_HINT = "영문, 숫자, 특문 중 2개 조합 8자 이상";
const PASSWORD_MISMATCH = "비밀번호가 일치하지 않습니다.";

/**
 * idle 아직 안 눌렀음 · taken 사용 불가 · available 사용 가능
 * unknown 서버에 물어보지 못함 — 중복 확인 API 가 GET 인데 본문을 요구해서
 *         브라우저에서 호출할 수 없습니다. 규격이 바뀌면 이 상태는 사라집니다.
 */
type CheckResult = "idle" | "taken" | "available" | "unknown";

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

type Decided = "taken" | "available";

const isDecided = (result: CheckResult): result is Decided =>
  result === "taken" || result === "available";

/** 중복 확인을 통과했거나, 물어보지 못한 경우 */
const passesCheck = (result: CheckResult) =>
  result === "available" || result === "unknown";

/** 회원가입 정보 입력 */
export default function Signup() {
  const navigate = useNavigate();
  const { form, setField } = useSignup();
  const { nickname, email, password, passwordConfirm, question, answer } = form;
  const { options, codeOf } = useRecoveryQuestions();

  const setNickname = (v: string) => setField("nickname", v);
  const setEmail = (v: string) => setField("email", v);
  const setPassword = (v: string) => setField("password", v);
  const setPasswordConfirm = (v: string) => setField("passwordConfirm", v);
  const setAnswer = (v: string) => setField("answer", v);

  // 화면에는 문구를, 서버에는 코드를 보냅니다
  const setQuestion = (v: string) => {
    setField("question", v);
    setField("questionCode", codeOf(v) ?? "");
  };

  // 확인란을 입력하기 시작한 뒤부터 다를 때만 알립니다
  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const [nicknameCheck, setNicknameCheck] = useState<CheckResult>("idle");
  const [emailCheck, setEmailCheck] = useState<CheckResult>("idle");
  const [checking, setChecking] = useState(false);

  const checkNickname = async () => {
    if (checking || nickname.trim().length === 0) return;

    setChecking(true);
    try {
      const data = await checkNicknameDuplication(nickname.trim());
      setNicknameCheck(data?.duplicate ? "taken" : "available");
    } catch {
      // 규격 문제로 호출이 안 되는 상태라 막지 않고 넘어갑니다.
      // 실제 검증은 가입 요청에서 서버가 합니다.
      setNicknameCheck("unknown");
    } finally {
      setChecking(false);
    }
  };

  const checkEmail = async () => {
    if (checking || !isValidEmail(email.trim())) return;

    setChecking(true);
    try {
      const data = await checkUsernameDuplication(email.trim());
      setEmailCheck(data?.duplicate ? "taken" : "available");
    } catch {
      setEmailCheck("unknown");
    } finally {
      setChecking(false);
    }
  };

  const canSubmit =
    nickname.trim().length > 0 &&
    isValidEmail(email.trim()) &&
    isValidPassword(password) &&
    password === passwordConfirm &&
    question.length > 0 &&
    answer.trim().length > 0 &&
    passesCheck(nicknameCheck) &&
    passesCheck(emailCheck);

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
                isDecided(nicknameCheck)
                  ? CHECK_MESSAGE.nickname[nicknameCheck]
                  : undefined
              }
              subtextTone={
                isDecided(nicknameCheck) ? CHECK_TONE[nicknameCheck] : "default"
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
                    isDecided(nicknameCheck)
                      ? CHECK_TONE[nicknameCheck]
                      : undefined
                  }
                />
                <Btn
                  variant="outline"
                  className="signup-page__check-btn"
                  disabled={checking}
                  onClick={() => void checkNickname()}
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
                isDecided(emailCheck)
                  ? CHECK_MESSAGE.email[emailCheck]
                  : undefined
              }
              subtextTone={
                isDecided(emailCheck) ? CHECK_TONE[emailCheck] : "default"
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
                  status={
                    isDecided(emailCheck) ? CHECK_TONE[emailCheck] : undefined
                  }
                />
                <Btn
                  variant="outline"
                  className="signup-page__check-btn"
                  disabled={checking}
                  onClick={() => void checkEmail()}
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
              subtext={passwordMismatch ? PASSWORD_MISMATCH : undefined}
              subtextTone="negative"
            >
              <PasswordInput
                id="signup-password-confirm"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                placeholder="password"
                autoComplete="new-password"
                status={passwordMismatch ? "negative" : undefined}
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
                options={options}
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
          disabled={!canSubmit}
          onClick={() => navigate(PATHS.signupTerms)}
        >
          가입하기
        </Btn>
      </BottomBar>
    </div>
  );
}
