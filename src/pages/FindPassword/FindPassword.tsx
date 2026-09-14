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
import Snackbar from "../../components/Snackbar/Snackbar";

import { recoveryErrorMessage } from "../../api/recoveryError";
import { checkUsernameDuplication, resetPassword } from "../../api/user";
import { useRecoveryQuestions } from "../../api/useRecoveryQuestions";
import { isValidEmail, isValidPassword } from "../../utils/validation";
import { PATHS } from "../../routes/paths";

import searchIcon from "../../assets/icn_search.svg";

const EMAIL_CHECK_MESSAGE = {
  notFound: "가입되지 않은 이메일입니다.",
  found: "가입된 이메일입니다.",
} as const;

/**
 * idle 아직 안 눌렀음 · found 가입됨 · notFound 가입 안 됨
 * unknown 서버에 물어보지 못함 — 중복 확인 API 가 GET 인데 본문을 요구해서
 *         브라우저에서 호출할 수 없습니다. 규격이 바뀌면 이 상태는 사라집니다.
 */
type EmailCheck = "idle" | "notFound" | "found" | "unknown";

const EMAIL_CHECK_TONE = { notFound: "negative", found: "positive" } as const;

/** 비밀번호 찾기 */
export default function FindPassword() {
  const navigate = useNavigate();
  const { options, codeOf } = useRecoveryQuestions();

  const [email, setEmail] = useState("");
  const [emailCheck, setEmailCheck] = useState<EmailCheck>("idle");
  const [checking, setChecking] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const checkEmail = async () => {
    if (checking) return;

    if (!isValidEmail(email.trim())) {
      setEmailCheck("notFound");
      return;
    }

    setChecking(true);
    try {
      const data = await checkUsernameDuplication(email.trim());
      // 가입된 이메일이면 duplicate 가 true 입니다
      setEmailCheck(data?.duplicate ? "found" : "notFound");
    } catch {
      // 규격 문제로 호출이 안 되는 상태라 막지 않고 넘어갑니다.
      // 실제 검증은 아래 재설정 요청에서 서버가 합니다.
      setEmailCheck("unknown");
    } finally {
      setChecking(false);
    }
  };

  const canSubmit =
    (emailCheck === "found" || emailCheck === "unknown") &&
    isValidEmail(email.trim()) &&
    question.length > 0 &&
    answer.trim().length > 0 &&
    isValidPassword(password) &&
    password === passwordConfirm;

  const submit = async () => {
    if (!canSubmit || submitting) return;

    const code = codeOf(question);
    if (!code) return;

    setSubmitting(true);
    setError(null);

    try {
      await resetPassword({
        username: email.trim(),
        recoveryQuestion: code,
        recoveryAnswer: answer.trim(),
        newPassword: password,
      });

      navigate(PATHS.findPasswordResult, {
        replace: true,
        state: { done: true },
      });
    } catch (caught) {
      setError(recoveryErrorMessage(caught));
      setSubmitting(false);
    }
  };

  const showEmailCheck = emailCheck === "found" || emailCheck === "notFound";

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
              showEmailCheck
                ? EMAIL_CHECK_MESSAGE[emailCheck as "found" | "notFound"]
                : undefined
            }
            subtextTone={
              showEmailCheck
                ? EMAIL_CHECK_TONE[emailCheck as "found" | "notFound"]
                : "default"
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
                  setError(null);
                }}
                placeholder="example@email.com"
                autoComplete="email"
                leadingIcon={email ? undefined : searchIcon}
                status={
                  showEmailCheck
                    ? EMAIL_CHECK_TONE[emailCheck as "found" | "notFound"]
                    : undefined
                }
              />
              <Btn
                variant="outline"
                className="find-password__check-btn"
                disabled={checking}
                onClick={() => void checkEmail()}
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
              onChange={(v) => {
                setQuestion(v);
                setError(null);
              }}
              options={options}
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
              onChange={(v) => {
                setAnswer(v);
                setError(null);
              }}
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
        <Btn
          variant={canSubmit && !submitting ? "primary" : "muted"}
          disabled={!canSubmit || submitting}
          onClick={() => void submit()}
        >
          {submitting ? "확인 중" : "확인"}
        </Btn>
      </BottomBar>

      {error && <Snackbar className="find-password__snackbar">{error}</Snackbar>}
    </div>
  );
}
