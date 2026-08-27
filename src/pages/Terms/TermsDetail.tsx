import type { ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import "./TermsDetail.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { useSignup } from "../Signup/signupContext";
import { findTerm } from "./terms";
import { PATHS } from "../../routes/paths";

/**
 * 약관 전문.
 * ⚠ 피그마([3-6-1] 237:6043 / [3-6-2] 237:6047)에는 본문이 비어 있습니다.
 *    출처가 정해지면 이 맵을 채우거나 API 응답으로 교체하세요.
 */
const TERMS_CONTENT: Partial<Record<string, ReactNode>> = {};

/** Figma: [3-6-1] / [3-6-2] 약관 전체보기 (237:6043, 237:6047) */
export default function TermsDetail() {
  const navigate = useNavigate();
  const { termKey } = useParams();
  const { setAgreed } = useSignup();

  const term = findTerm(termKey);

  // 없는 약관 키로 들어오면 동의 화면으로 되돌립니다.
  if (!term) return <Navigate to={PATHS.signupTerms} replace />;

  return (
    <div className="terms-detail">
      <Header
        className="terms-detail__header"
        variant="close"
        onBack={() => navigate(-1)}
      />

      {/* 237:6045 — x25 y74, w334, 16px Medium / 1.7 / -0.32px */}
      <h1 className="terms-detail__title">{term.label}</h1>

      {/* 본문 — 제목 아래부터 하단 바 위까지 스크롤 */}
      <div className="terms-detail__body">{TERMS_CONTENT[term.key]}</div>

      {/* bottom (237:6046) — 390×120, 버튼 2개 gap 8 */}
      <BottomBar>
        <Btn variant="outline" onClick={() => navigate(-1)}>
          닫기
        </Btn>
        <Btn
          variant="primary"
          onClick={() => {
            setAgreed(term.key, true);
            navigate(-1);
          }}
        >
          동의하기
        </Btn>
      </BottomBar>
    </div>
  );
}
