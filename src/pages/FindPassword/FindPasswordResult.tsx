import { Navigate, useLocation, useNavigate } from "react-router-dom";

import "./FindPasswordResult.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { PATHS } from "../../routes/paths";

/** 비밀번호 재설정 완료 */
export default function FindPasswordResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const done = (state as { done?: boolean } | null)?.done;

  if (!done) return <Navigate to={PATHS.findPassword} replace />;

  return (
    <div className="find-password-result">
      <Header
        className="find-password-result__header"
        onBack={() => navigate(PATHS.login, { replace: true })}
      />

      <TitleL className="find-password-result__title">
        비밀번호 재설정이 완료됐어요!
        <br />
        로그인 화면으로 돌아갈게요.
      </TitleL>

      <BottomBar>
        <Btn
          variant="primary"
          onClick={() => navigate(PATHS.login, { replace: true })}
        >
          로그인하기
        </Btn>
      </BottomBar>
    </div>
  );
}
