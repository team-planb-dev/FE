import { useState } from "react";

import "./Terms.css";

import Header from "../../components/Header/Header";
import Checkbox from "../../components/Checkbox/Checkbox";
import Btn from "../../components/Btn/Btn";
import TermsDetail from "./TermsDetail";

/**
 * Figma: [S3-6] 이용약관 동의 (237:5772 미체크 / 237:5794 전체 체크)
 * 세 항목 모두 [필수]이며, 전부 체크해야 확인 버튼이 활성화됩니다.
 */

type TermKey = "age" | "service" | "privacy";

type Term = {
  key: TermKey;
  label: string;
  /** 전문 보기가 있는 항목만 true */
  hasDetail: boolean;
};

const TERMS: readonly Term[] = [
  { key: "age", label: "[필수] 만 14세 이상입니다.", hasDetail: false },
  { key: "service", label: "[필수] 서비스 이용약관", hasDetail: true },
  { key: "privacy", label: "[필수] 개인정보 수집·이용 동의", hasDetail: true },
];

type TermsProps = {
  onBack?: () => void;
  onConfirm?: () => void;
};

export default function Terms({ onBack, onConfirm }: TermsProps) {
  const [agreed, setAgreed] = useState<Record<TermKey, boolean>>({
    age: false,
    service: false,
    privacy: false,
  });

  /**
   * 전체보기로 열린 항목 — Figma [3-6-1] 237:6043 / [3-6-2] 237:6047
   * 라우터가 없어 같은 화면 위에 덮어 띄웁니다. 라우팅이 들어오면 별도 경로로 분리하세요.
   */
  const [openedTerm, setOpenedTerm] = useState<Term | null>(null);

  const allAgreed = TERMS.every((term) => agreed[term.key]);

  const setAgreedFor = (key: TermKey, value: boolean) =>
    setAgreed((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="terms-page">
      <Header className="terms-page__header" onBack={onBack} />

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
                  onChange={(checked) => setAgreedFor(term.key, checked)}
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
                  onClick={() => setOpenedTerm(term)}
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
        onClick={onConfirm}
      >
        확인
      </Btn>

      {/* 전체보기 — 동의하기를 누르면 해당 항목이 체크되고 닫힙니다 */}
      {openedTerm && (
        <TermsDetail
          title={openedTerm.label}
          onClose={() => setOpenedTerm(null)}
          onAgree={() => {
            setAgreedFor(openedTerm.key, true);
            setOpenedTerm(null);
          }}
        />
      )}
    </div>
  );
}
