import { useState } from "react";

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

import searchIcon from "../../assets/icn_search.svg";

/**
 * Figma: [S3] 회원가입 — 입력 폼 (237:5876 외)
 * 디자인 노트
 *  1. 헤더 왼쪽 화살표 → [S2] 로그인 복귀
 *  2. 닉네임 / 이메일은 중복 확인 후 status 메시지 표시
 *  3. 비밀번호 · 비밀번호 확인 일치 검증
 *  4. 필수 필드 미입력 시 버튼 disabled
 *  5. 계정 복구 질문 8종
 */

/** 디자인 노트 5 — 계정 복구 질문 목록 */
const RECOVERY_QUESTIONS = [
  "내가 어릴 때 가장 좋아했던 선생님의 성함은?",
  "처음 키웠던 반려동물의 이름은?",
  "어린 시절 가장 좋아했던 책의 제목은?",
  "처음 혼자 여행한 장소는?",
  "내가 가장 좋아했던 학창시절 별명은?",
  "어릴 때 가장 자주 먹었던 간식은?",
  "가장 기억에 남는 어린 시절 장소는?",
  "처음 배운 악기나 운동은?",
] as const;

const PASSWORD_HINT = "영문, 숫자, 특문 중 2개 조합 8자 이상";

/** 중복 확인 결과 — Figma 237:5909(불가) / 237:5923(가능) */
type CheckResult = "idle" | "taken" | "available";

/**
 * ⚠ 피그마 이메일 필드의 안내 문구가 "닉네임"으로 되어 있습니다(237:5953, 237:5967).
 *   닉네임 필드에서 복사하며 안 고친 것으로 보여 이메일로 바로잡았습니다.
 */
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

export default function Signup() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [nicknameCheck, setNicknameCheck] = useState<CheckResult>("idle");
  const [emailCheck, setEmailCheck] = useState<CheckResult>("idle");

  // TODO(api): 중복 확인 API로 교체하세요.
  // 지금은 서버가 없어 임시로 동작합니다 — 처음 누르면 "사용 가능",
  // 한 번 더 누르면 "사용 불가"가 되어 두 상태를 모두 확인할 수 있습니다.
  const toggleCheck = (
    current: CheckResult,
    set: (next: CheckResult) => void,
  ) => set(current === "available" ? "taken" : "available");

  // 디자인 노트 4 — 필수 필드가 모두 채워져야 활성화
  // 이메일·비밀번호 규칙은 Figma 정책 문서(65:340) 기준입니다.
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
      <Header className="signup-page__header" />

      <div className="signup-page__scroll">
        <div className="signup-page__content">
          <TitleL className="signup-page__title">
            만나서 반가워요!
            <br />
            가입에 필요한 정보를 입력해주세요
          </TitleL>

          {/* Frame 1707482514 (237:5880) — x24 y160, 342 폭, gap 12 */}
          <div className="signup-page__fields">
            {/* 닉네임 — Frame 155 (237:5881) 342×123 */}
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

            {/* 이메일 — Frame 154 (237:5883) 342×123 */}
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

            {/* 비밀번호 — Frame 152 (237:5884) 342×139 */}
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

            {/* 비밀번호 확인 — Frame 154 (237:5885) 342×106 */}
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

            {/* 계정 분실 질문 — Frame 132 (237:5887) 342×114 */}
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

            {/* 질문 답변 — Frame 132 (237:5888) 342×114 */}
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

      {/* bottom (237:5889) — 390×120 하단 고정 */}
      <BottomBar>
        <Btn variant={canSubmit ? "primary" : "muted"}>가입하기</Btn>
      </BottomBar>
    </div>
  );
}
