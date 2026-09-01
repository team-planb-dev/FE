import { Navigate, useLocation, useNavigate } from "react-router-dom";

import "./FindEmailResult.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { PATHS } from "../../routes/paths";

/** 이메일 찾기 결과 */
export default function FindEmailResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = (state as { email?: string } | null)?.email;

  if (!email) return <Navigate to={PATHS.findEmail} replace />;

  return (
    <div className="find-email-result">
      <Header
        className="find-email-result__header"
        onBack={() => navigate(PATHS.findEmail)}
      />

      <TitleL className="find-email-result__title">
        가입한 이메일을 확인했어요.
      </TitleL>

      <div className="find-email-result__email">{email}</div>
      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.login)}>
          확인
        </Btn>
      </BottomBar>
    </div>
  );
}
