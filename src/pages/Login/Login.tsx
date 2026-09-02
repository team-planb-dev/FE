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

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState<LoginErrorCode | null>(null);

  const canSubmit =
    email.trim().length > 0 && password.length >= PASSWORD_MIN_LENGTH;

  const handleEmailChange = (v: string) => {
    setEmail(v);
    setErrorCode(null);
  };
  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setErrorCode(null);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    setErrorCode("invalid_credentials");
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
              status={errorCode ? "negative" : undefined}
            />
          </Field>

          <Field label="비밀번호" htmlFor="login-password">
            <PasswordInput
              id="login-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="password"
              status={errorCode ? "negative" : undefined}
            />
          </Field>
        </div>

        <div className="login-page__actions">
          <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
            로그인
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

      {errorCode && (
        <Snackbar className="login-page__snackbar">
          {LOGIN_ERROR_MESSAGE[errorCode]}
        </Snackbar>
      )}
    </div>
  );
}
