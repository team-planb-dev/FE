import { Navigate, useLocation, useNavigate } from "react-router-dom";

import "./FindPasswordResult.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { PATHS } from "../../routes/paths";

/**
 * Figma: [4-6] 비밀번호 재설정 완료 (237:7525)
 * 재설정이 끝난 화면이라 헤더 화살표도 [4-5]가 아니라 로그인으로 보냅니다.
 */
export default function FindPasswordResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const done = (state as { done?: boolean } | null)?.done;

  // 재설정 화면을 거치지 않고 바로 들어오면 되돌립니다.
  if (!done) return <Navigate to={PATHS.findPassword} replace />;

  return (
    <div className="find-password-result">
      <Header
        className="find-password-result__header"
        onBack={() => navigate(PATHS.login, { replace: true })}
      />

      {/* title_L (237:7527) — y54, 두 줄 */}
      <TitleL className="find-password-result__title">
        비밀번호 재설정이 완료됐어요!
        <br />
        로그인 화면으로 돌아갈게요.
      </TitleL>

      {/* bottom (237:7528) */}
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
