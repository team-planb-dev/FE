import { Navigate, useLocation, useNavigate } from "react-router-dom";

import "./FindEmailResult.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Btn from "../../components/Btn/Btn";
import BottomBar from "../../components/BottomBar/BottomBar";

import { PATHS } from "../../routes/paths";

/** Figma: [4-3] 이메일 찾기 성공 (237:7520) */
export default function FindEmailResult() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = (state as { email?: string } | null)?.email;

  // 찾기 화면을 거치지 않고 바로 들어오면 되돌립니다.
  if (!email) return <Navigate to={PATHS.findEmail} replace />;

  return (
    <div className="find-email-result">
      <Header
        className="find-email-result__header"
        onBack={() => navigate(PATHS.findEmail)}
      />

      {/* title_L (237:7522) — y54, 한 줄 */}
      <TitleL className="find-email-result__title">
        가입한 이메일을 확인했어요.
      </TitleL>

      {/* Frame 130 (237:7524) — x24 y149, 342×36 */}
      <div className="find-email-result__email">{email}</div>

      {/* bottom (237:7523) */}
      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.login)}>
          확인
        </Btn>
      </BottomBar>
    </div>
  );
}
