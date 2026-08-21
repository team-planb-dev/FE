import "./SignupComplete.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

type SignupCompleteProps = {
  /** 회원가입 폼에서 입력받은 닉네임 */
  nickname: string;
  onBack?: () => void;
  onGoHome?: () => void;
};

/** Figma: [3-7] 회원가입 완료 (237:5816) */
export default function SignupComplete({
  nickname,
  onBack,
  onGoHome,
}: SignupCompleteProps) {
  return (
    <div className="signup-complete">
      <Header className="signup-complete__header" onBack={onBack} />

      {/* 237:5818 — x24 y74, 22px SemiBold / 1.4 / -0.22px */}
      <div className="signup-complete__message">
        <p className="signup-complete__line">만나서 반가워요.</p>
        <p className="signup-complete__line">{nickname}님!</p>
      </div>

      {/* Btn / Variant1 (237:5819) — x20 y756, 350×54 */}
      <Btn
        variant="primary"
        className="signup-complete__cta"
        onClick={onGoHome}
      >
        홈으로
      </Btn>
    </div>
  );
}
