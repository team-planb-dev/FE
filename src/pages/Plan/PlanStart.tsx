import { useNavigate } from "react-router-dom";

import "./PlanStart.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";

import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-1] 여행 생성 (237:7019)
 *
 * ⚠ 이 화면만 title_L / subtitle 컴포넌트를 쓰지 않고 텍스트를 직접 얹었습니다.
 *   같은 [S6] 안의 [6-2]·[6-3]은 컴포넌트를 씁니다(확인 필요 문서 참고).
 *   원본 좌표를 그대로 재현했습니다.
 */
export default function PlanStart() {
  const navigate = useNavigate();

  return (
    <div className="plan-start">
      {/* Header (237:7020) — x0 y0
          ⚠ ← 의 목적지가 디자인에 없습니다. [6-2]의 개발 노트 2번이
            "헤더 ← 를 누르면 메인으로" 이므로 같은 흐름으로 홈에 보냅니다. */}
      <Header
        className="plan-start__header"
        onBack={() => navigate(PATHS.home)}
      />

      {/* 237:7021 — x24 y74, 22px SemiBold / 1.4 / -0.22px / neutral-900 */}
      <p className="plan-start__title">
        여행 AI와 함께
        <br />
        여행 계획을 시작해볼까요?
      </p>

      {/* 237:7024 — y156, 14px Medium / 1.5 / -0.28px / neutral-800 */}
      <p className="plan-start__subtext">
        AI는 응답에 따라 적합한 여행지를 추천해줘요.
      </p>

      {/* Btn (237:7023) — x20 y756, 350×54 */}
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
