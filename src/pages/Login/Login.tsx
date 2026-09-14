import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import PasswordInput from "../../components/Input/PasswordInput";
import Btn from "../../components/Btn/Btn";
import Snackbar from "../../components/Snackbar/Snackbar";

import { login, LoginFailedError, TokenNotExposedError } from "../../api/auth";
import { ERROR_CODE } from "../../api/schema";
import { PASSWORD_MIN_LENGTH } from "../../utils/validation";
import { PATHS } from "../../routes/paths";

/** 로그인 */
export type LoginErrorCode =
  | "invalid_credentials"
  | "email_required"
  | "password_required"
  | "email_not_found"
  | "wrong_password";

const LOGIN_ERROR_MESSAGE: Record<LoginErrorCode, string> = {
  invalid_credentials: "잘못된 이메일 또는 비밀번호입니다.",
  email_required: "이메일을 입력해주세요.",
  password_required: "비밀번호를 입력해주세요.",
  email_not_found: "등록된 이메일이 아닙니다.",
  wrong_password: "비밀번호가 올바르지 않습니다.",
};

/**
 * 서버 errorCode 와 확정된 문구를 잇습니다.
 * 서버는 지금 `AUTH_FAILED` 하나만 내려줍니다. 이메일·비밀번호를 구분해서
 * 알려주지 않으므로 나머지 문구는 아직 쓸 곳이 없습니다.
 */
const MESSAGE_BY_SERVER_CODE: Record<string, LoginErrorCode> = {
  [ERROR_CODE.authFailed]: "invalid_credentials",
};

const NETWORK_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";
const TOKEN_ERROR_MESSAGE = "로그인 응답을 읽지 못했어요.";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    email.trim().length > 0 && password.length >= PASSWORD_MIN_LENGTH;

  const handleEmailChange = (v: string) => {
    setEmail(v);
    setError(null);
  };
  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setError(null);
  };

  const submit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate(PATHS.home, { replace: true });
    } catch (caught) {
      setError(messageOf(caught));
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <Header
        className="login-page__header"
        onBack={() => navigate(PATHS.landing)}
      />
      <TitleL className="login-page__title">
        건강한 여행 관리,
        <br />
        {"{서비스 이름}"}과 시작하세요.
      </TitleL>

      <div className="login-page__body">
        <div className="login-page__fields">
          <Field label="이메일" htmlFor="login-email">
            <TextInput
              id="login-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@email.com"
              autoComplete="email"
              status={error ? "negative" : undefined}
            />
          </Field>

          <Field label="비밀번호" htmlFor="login-password">
            <PasswordInput
              id="login-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="password"
              status={error ? "negative" : undefined}
            />
          </Field>
        </div>

        <div className="login-page__actions">
          <Btn
            variant={canSubmit && !submitting ? "primary" : "muted"}
            disabled={!canSubmit || submitting}
            onClick={() => void submit()}
          >
            {submitting ? "로그인 중" : "로그인"}
          </Btn>
          <Btn variant="outline" onClick={() => navigate(PATHS.signup)}>
            이메일로 회원가입
          </Btn>
        </div>

        <div className="login-page__links">
          <button
            type="button"
            className="login-page__link"
            onClick={() => navigate(PATHS.findEmail)}
          >
            이메일 찾기
          </button>
          <button
            type="button"
            className="login-page__link"
            onClick={() => navigate(PATHS.findPassword)}
          >
            비밀번호 찾기
          </button>
        </div>
      </div>

      {error && <Snackbar className="login-page__snackbar">{error}</Snackbar>}
    </div>
  );
}

function messageOf(caught: unknown): string {
  // CORS 에 exposedHeaders 가 빠져 Authorization 헤더를 못 읽은 경우입니다
  if (caught instanceof TokenNotExposedError) return TOKEN_ERROR_MESSAGE;

  if (caught instanceof LoginFailedError) {
    const code = caught.errorCode
      ? MESSAGE_BY_SERVER_CODE[caught.errorCode]
      : undefined;
    return LOGIN_ERROR_MESSAGE[code ?? "invalid_credentials"];
  }

  return NETWORK_ERROR_MESSAGE;
}
