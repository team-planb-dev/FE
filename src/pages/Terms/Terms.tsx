import { useNavigate } from "react-router-dom";

import "./Terms.css";

import Header from "../../components/Header/Header";
import Checkbox from "../../components/Checkbox/Checkbox";
import Btn from "../../components/Btn/Btn";

import { useSignup } from "../Signup/signupContext";
import { TERMS } from "./termsData";
import { PATHS, termsDetailPath } from "../../routes/paths";

/**
 * Figma: [S3-6] 이용약관 동의 (237:5772 미체크 / 237:5794 전체 체크)
 * 세 항목 모두 [필수]이며, 전부 체크해야 확인 버튼이 활성화됩니다.
 */
export default function Terms() {
  const navigate = useNavigate();
  const { agreed, setAgreed } = useSignup();

  const allAgreed = TERMS.every((term) => agreed[term.key]);

  return (
    <div className="terms-page">
      <Header className="terms-page__header" onBack={() => navigate(-1)} />

      {/* 237:5792 — x24 y74, 22px SemiBold */}
      <p className="terms-page__title">서비스 약관에 동의해주세요.</p>

      {/* Frame 138 (237:5774) — x24 y156, 342 폭, gap 8 */}
      <div className="terms-page__body">
        <div className="terms-page__section-label">이용동의</div>

        {/* Frame 154 (237:5776) — gap 20 */}
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

              {term.hasDetail && (
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

      {/* Btn (237:5793) — x20 y756, 350×54 */}
      <Btn
        variant={allAgreed ? "primary" : "muted"}
        className="terms-page__confirm"
        onClick={() => allAgreed && navigate(PATHS.signupComplete)}
      >
        확인
      </Btn>
    </div>
  );
}
