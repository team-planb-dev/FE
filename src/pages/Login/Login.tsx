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

/**
 * Figma: [S2] 로그인 — 한 화면의 상태들
 *  237:5630  기본
 *  237:5645  이메일 입력(focus/typing)
 *  237:5660  비밀번호 입력(focus/typing)
 *  237:5677  입력 완료 → 로그인 버튼 활성
 *  237:5707  로그인 오류 → 두 필드 Error
 *  237:5755  로그인 오류 + Snackbar
 */

/**
 * 로그인 버튼 활성 조건 — 비밀번호가 정책 최소 길이(8자)를 넘겨야 활성화됩니다.
 *
 * 정책 문서(65:523)에는 "이메일과 비밀번호를 입력했을 경우 활성화"로 되어 있지만,
 * [S2] 프레임은 비밀번호 3자에서 비활성(237:5660), 8자에서 활성(237:5677)입니다.
 * 정책 문서 쪽 로그인 화면이 375px 구버전(2024.10.12)이라 [S2] 디자인을 따랐습니다.
 * 8자 미만은 회원가입 정책상 애초에 유효한 비밀번호가 아니므로 규칙끼리 충돌하지 않습니다.
 */

/**
 * 로그인 실패 케이스별 문구
 * 출처: Figma "정책 디스크립션 예시" > 이메일 로그인 (65:550) Case 1~5
 */
export type LoginErrorCode =
  | "invalid_credentials"
  | "email_required"
  | "password_required"
  | "email_not_found"
  | "wrong_password";

const LOGIN_ERROR_MESSAGE: Record<LoginErrorCode, string> = {
  invalid_credentials: "잘못된 이메일 또는 비밀번호입니다.", // Case 1
  email_required: "이메일을 입력해주세요.", // Case 2
  password_required: "비밀번호를 입력해주세요.", // Case 3
  email_not_found: "등록된 이메일이 아닙니다.", // Case 4
  wrong_password: "비밀번호가 올바르지 않습니다.", // Case 5
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCode, setErrorCode] = useState<LoginErrorCode | null>(null);

  const canSubmit =
    email.trim().length > 0 && password.length >= PASSWORD_MIN_LENGTH;

  // 입력을 고치면 오류 표시를 걷어냅니다.
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
    // TODO(api): 실제 로그인 요청으로 교체.
    // 실패 응답의 사유에 따라 위 LoginErrorCode 중 하나를 setErrorCode 하세요.
    setErrorCode("invalid_credentials");
  };

  return (
    <div className="login-page">
      <Header className="login-page__header" />

      <TitleL className="login-page__title">
        건강한 여행 관리,
        <br />
        {"{서비스 이름}"}과 시작하세요.
      </TitleL>

      {/* Frame 135 (237:5631) — x24 y160, 342×488, gap 40 */}
      <div className="login-page__body">
        {/* Frame 134 (237:5632) — gap 12 */}
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

        {/* Frame 136 (237:5637) — gap 12 */}
        <div className="login-page__actions">
          {/* 237:5630/5645/5660 → Variant2(muted) · 237:5677 → Variant1(primary) */}
          <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
            로그인
          </Btn>
          <Btn variant="outline" onClick={() => navigate(PATHS.signup)}>
            이메일로 회원가입
          </Btn>
        </div>

        {/* Frame 1707482516 (237:5640) — 176×48, gap 8 */}
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

      {/* Snackbar (237:5770) — x24 y670, 342×54 */}
      {errorCode && (
        <Snackbar className="login-page__snackbar">
          {LOGIN_ERROR_MESSAGE[errorCode]}
        </Snackbar>
      )}
    </div>
  );
}
