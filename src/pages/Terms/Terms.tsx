import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Terms.css";

import Header from "../../components/Header/Header";
import Checkbox from "../../components/Checkbox/Checkbox";
import Btn from "../../components/Btn/Btn";
import Snackbar from "../../components/Snackbar/Snackbar";

import { ApiRequestError } from "../../api/client";
import { createUser } from "../../api/user";
import type { RecoveryQuestionCode } from "../../api/schema";
import { useSignup } from "../Signup/signupContext";
import { TERMS } from "./termsData";
import { PATHS, termsDetailPath } from "../../routes/paths";

const ALL_AGREE = "전체 동의하기";
const SIGNUP_FAILED_MESSAGE = "가입하지 못했어요.";
const NETWORK_ERROR_MESSAGE = "잠시 후 다시 시도해주세요.";

/** 약관 동의 */
export default function Terms() {
  const navigate = useNavigate();
  const { form, agreed, setAgreed } = useSignup();

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 하단 버튼은 [필수] 항목이 모두 체크되어야 활성화됩니다
  const canSubmit = TERMS.every((term) => !term.required || agreed[term.key]);
  const allAgreed = TERMS.every((term) => agreed[term.key]);

  const toggleAll = (checked: boolean) =>
    TERMS.forEach((term) => setAgreed(term.key, checked));

  const submit = async () => {
    if (!canSubmit || submitting) return;
    if (!form.questionCode) return;

    setSubmitting(true);
    setError(null);

    try {
      await createUser({
        username: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
        recoveryQuestion: form.questionCode as RecoveryQuestionCode,
        recoveryAnswer: form.answer.trim(),
        ageRequirementAgreed: agreed.age,
        serviceTermsAgreed: agreed.service,
        privacyCollectionAgreed: agreed.privacy,
        // ⚠ 마케팅 수신 동의(agreed.marketing)는 보낼 필드가 없습니다.
        //   회원가입 요청에 추가할지 백엔드에 확인 중입니다
      });

      navigate(PATHS.signupComplete, { replace: true });
    } catch (caught) {
      setError(signupErrorMessage(caught));
      setSubmitting(false);
    }
  };

  return (
    <div className="terms-page">
      <Header className="terms-page__header" onBack={() => navigate(-1)} />
      <p className="terms-page__title">서비스 약관에 동의해주세요.</p>
      <div className="terms-page__body">
        <div className="terms-page__section-label">이용동의</div>
        <ul className="terms-page__list">
          {TERMS.map((term) => (
            <li className="terms-page__item" key={term.key}>
              <span className="terms-page__check">
                <Checkbox
                  id={`terms-${term.key}`}
                  checked={agreed[term.key]}
                  onChange={(checked) => setAgreed(term.key, checked)}
                />
                <label
                  className="terms-page__label"
                  htmlFor={`terms-${term.key}`}
                >
                  {term.label}
                </label>
              </span>

              {term.content && (
                <button
                  type="button"
                  className="terms-page__detail"
                  onClick={() => navigate(termsDetailPath(term.key))}
                >
                  전체보기
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {error && <Snackbar className="terms-page__snackbar">{error}</Snackbar>}

      <div className="terms-page__all">
        <Checkbox id="terms-all" checked={allAgreed} onChange={toggleAll} />
        <label className="terms-page__label" htmlFor="terms-all">
          {ALL_AGREE}
        </label>
      </div>

      <Btn
        variant={canSubmit && !submitting ? "primary" : "muted"}
        className="terms-page__confirm"
        disabled={!canSubmit || submitting}
        onClick={() => void submit()}
      >
        {submitting ? "가입 중" : "확인"}
      </Btn>
    </div>
  );
}

function signupErrorMessage(caught: unknown): string {
  if (!(caught instanceof ApiRequestError)) return NETWORK_ERROR_MESSAGE;

  // Snackbar 가 한 줄이라 서버 문구가 길면 잘립니다
  const fromServer = caught.message.trim();
  return fromServer && fromServer.length <= 20
    ? fromServer
    : SIGNUP_FAILED_MESSAGE;
}
