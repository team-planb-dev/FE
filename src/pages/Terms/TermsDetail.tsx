import type { ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import "./TermsDetail.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { useSignup } from "../Signup/signupContext";
import { findTerm } from "./termsData";
import { PATHS } from "../../routes/paths";

const TERMS_CONTENT: Partial<Record<string, ReactNode>> = {};

/** 약관 전문 */
export default function TermsDetail() {
  const navigate = useNavigate();
  const { termKey } = useParams();
  const { setAgreed } = useSignup();

  const term = findTerm(termKey);

  if (!term) return <Navigate to={PATHS.signupTerms} replace />;

  return (
    <div className="terms-detail">
      <Header
        className="terms-detail__header"
        variant="close"
        onBack={() => navigate(-1)}
      />

      <h1 className="terms-detail__title">{term.label}</h1>
      <div className="terms-detail__body">{TERMS_CONTENT[term.key]}</div>
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
