import { Navigate, useNavigate, useParams } from "react-router-dom";

import "./TermsDetail.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { findTerm } from "./termsData";
import { PATHS } from "../../routes/paths";

/** 마이페이지에서 보는 약관 전문. 읽기 전용이라 닫기만 있습니다 */
export default function TermsView() {
  const navigate = useNavigate();
  const { termKey } = useParams();

  const term = findTerm(termKey);

  if (!term?.content) return <Navigate to={PATHS.myPage} replace />;

  return (
    <div className="terms-detail">
      <Header
        className="terms-detail__header"
        variant="close"
        onBack={() => navigate(-1)}
      />

      <h1 className="terms-detail__title">{term.label}</h1>
      <div className="terms-detail__body">{term.content}</div>
      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(-1)}>
          닫기
        </Btn>
      </BottomBar>
    </div>
  );
}
