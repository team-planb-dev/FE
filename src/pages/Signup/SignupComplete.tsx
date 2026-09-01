import { Navigate, useNavigate } from "react-router-dom";

import "./SignupComplete.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

import { useSignup } from "./signupContext";
import { PATHS } from "../../routes/paths";

/** 회원가입 완료 */
export default function SignupComplete() {
  const navigate = useNavigate();
  const { form } = useSignup();

  if (!form.nickname) return <Navigate to={PATHS.signup} replace />;

  const handleGoHome = () => {
    navigate(PATHS.login);
  };

  return (
    <div className="signup-complete">
      <Header className="signup-complete__header" onBack={() => navigate(-1)} />
      <div className="signup-complete__message">
        <p className="signup-complete__line">만나서 반가워요.</p>
        <p className="signup-complete__line">{form.nickname}님!</p>
      </div>

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
