import { useNavigate } from "react-router-dom";

import "./Terms.css";

import Header from "../../components/Header/Header";
import Checkbox from "../../components/Checkbox/Checkbox";
import Btn from "../../components/Btn/Btn";

import { useSignup } from "../Signup/signupContext";
import { MARKETING_NOTICE, TERMS } from "./termsData";
import { PATHS, termsDetailPath } from "../../routes/paths";

const ALL_AGREE = "전체 동의하기";

/** 약관 동의 */
export default function Terms() {
  const navigate = useNavigate();
  const { agreed, setAgreed } = useSignup();

  // 하단 버튼은 [필수] 항목이 모두 체크되어야 활성화됩니다
  const canSubmit = TERMS.every((term) => !term.required || agreed[term.key]);
  const allAgreed = TERMS.every((term) => agreed[term.key]);

  const toggleAll = (checked: boolean) =>
    TERMS.forEach((term) => setAgreed(term.key, checked));

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

        <p className="terms-page__notice">{MARKETING_NOTICE}</p>
      </div>

      <div className="terms-page__all">
        <Checkbox id="terms-all" checked={allAgreed} onChange={toggleAll} />
        <label className="terms-page__label" htmlFor="terms-all">
          {ALL_AGREE}
        </label>
      </div>

      <Btn
        variant={canSubmit ? "primary" : "muted"}
        className="terms-page__confirm"
        onClick={() => canSubmit && navigate(PATHS.signupComplete)}
      >
        확인
      </Btn>
    </div>
  );
}
