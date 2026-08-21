import { useState } from "react";

import "./Login.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Field from "../../components/Field/Field";
import TextInput from "../../components/Input/TextInput";
import PasswordInput from "../../components/Input/PasswordInput";
import Btn from "../../components/Btn/Btn";
import Snackbar from "../../components/Snackbar/Snackbar";

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
 * 로그인 버튼 활성 조건.
 * 피그마 프레임에서 읽어낸 값입니다 — 237:5660(비밀번호 3자)은 비활성,
 * 237:5677(비밀번호 8자)은 활성. 실제 검증 규칙은 확인 후 교체하세요.
 */
const PASSWORD_MIN_LENGTH = 8;

const LOGIN_ERROR_MESSAGE = "잘못된 이메일 혹은 비밀번호입니다.";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasError, setHasError] = useState(false);

  const canSubmit =
    email.trim().length > 0 && password.length >= PASSWORD_MIN_LENGTH;

  // 입력을 고치면 오류 표시를 걷어냅니다.
  const handleEmailChange = (v: string) => {
    setEmail(v);
    setHasError(false);
  };
  const handlePasswordChange = (v: string) => {
    setPassword(v);
    setHasError(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO(api): 실제 로그인 요청으로 교체. 실패 응답일 때 setHasError(true).
    setHasError(true);
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
              error={hasError}
            />
          </Field>

          <Field label="비밀번호" htmlFor="login-password">
            <PasswordInput
              id="login-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="password"
              error={hasError}
            />
          </Field>
        </div>

        {/* Frame 136 (237:5637) — gap 12 */}
        <div className="login-page__actions">
          {/* 237:5630/5645/5660 → Variant2(muted) · 237:5677 → Variant1(primary) */}
          <Btn variant={canSubmit ? "primary" : "muted"} onClick={handleSubmit}>
            로그인
          </Btn>
          <Btn variant="outline">이메일로 회원가입</Btn>
        </div>

        {/* Frame 1707482516 (237:5640) — 176×48, gap 8 */}
        <div className="login-page__links">
          <button type="button" className="login-page__link">
            이메일 찾기
          </button>
          <button type="button" className="login-page__link">
            비밀번호 찾기
          </button>
        </div>
      </div>

      {/* Snackbar (237:5770) — x24 y670, 342×54 */}
      {hasError && (
        <Snackbar className="login-page__snackbar">
          {LOGIN_ERROR_MESSAGE}
        </Snackbar>
      )}
    </div>
  );
}
