import { Navigate, useNavigate } from "react-router-dom";

import "./SignupComplete.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

import { useSignup } from "./signupContext";
import { PATHS } from "../../routes/paths";

/** Figma: [3-7] 회원가입 완료 (237:5816) */
export default function SignupComplete() {
  const navigate = useNavigate();
  const { form } = useSignup();

  // 폼을 거치지 않고 바로 들어오면 회원가입 첫 단계로 되돌립니다.
  if (!form.nickname) return <Navigate to={PATHS.signup} replace />;

  const handleGoHome = () => {
    // TODO(route): 홈 화면이 생기면 그쪽으로 보내세요.
    // 회원가입 경로를 벗어나면 SignupProvider 가 언마운트되며 입력값이 사라지므로
    // 여기서 따로 초기화하지 않습니다. (초기화하면 위 가드가 먼저 걸립니다)
    navigate(PATHS.login);
  };

  return (
    <div className="signup-complete">
      <Header className="signup-complete__header" onBack={() => navigate(-1)} />

      {/* 237:5818 — x24 y74, 22px SemiBold / 1.4 / -0.22px */}
      <div className="signup-complete__message">
        <p className="signup-complete__line">만나서 반가워요.</p>
        <p className="signup-complete__line">{form.nickname}님!</p>
      </div>

      {/* Btn / Variant1 (237:5819) — x20 y756, 350×54 */}
      <Btn
        variant="primary"
        className="signup-complete__cta"
        onClick={handleGoHome}
      >
        홈으로
      </Btn>
    </div>
  );
}
