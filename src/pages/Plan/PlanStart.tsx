import { useNavigate } from "react-router-dom";

import "./PlanStart.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

import { PATHS } from "../../routes/paths";

/** 여행 생성 시작 */
export default function PlanStart() {
  const navigate = useNavigate();

  return (
    <div className="plan-start">
      <Header
        className="plan-start__header"
        onBack={() => navigate(PATHS.home)}
      />

      <p className="plan-start__title">
        여행 AI와 함께
        <br />
        여행 계획을 시작해볼까요?
      </p>

      <p className="plan-start__subtext">
        AI는 응답에 따라 적합한 여행지를 추천해줘요.
      </p>

      <Btn
        variant="primary"
        className="plan-start__cta"
        onClick={() => navigate(PATHS.planMembers)}
      >
        시작하기
      </Btn>
    </div>
  );
}
