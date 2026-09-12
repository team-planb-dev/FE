import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LottieLight } from "lottie-react";

import "./TripLoading.css";

import Header from "../../components/Header/Header";

import cloveAnimation from "../../assets/clove.json";
import { PATHS } from "../../routes/paths";

const TITLE = ["{AI}가 관광 명소를", "찾아보고 있어요.."];
const SUBTITLE = "잠시만 기다려 주세요..";

/** 애니메이션 한 바퀴(120프레임 4초) 뒤 일정 화면으로 넘어갑니다 */
const LOOP_MS = 4000;

/** AI 일정 생성 중 */
export default function TripLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO(api): 생성이 끝나는 시점에 맞춰 이동해야 합니다
    const timer = window.setTimeout(() => {
      navigate(PATHS.tripDetail, { replace: true });
    }, LOOP_MS);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="trip-loading">
      <Header className="trip-loading__header" variant="empty" />

      <div className="trip-loading__texts">
        <p className="trip-loading__title">
          {TITLE[0]}
          <br />
          {TITLE[1]}
        </p>
        <p className="trip-loading__subtitle">{SUBTITLE}</p>
      </div>

      <LottieLight
        className="trip-loading__animation"
        src={cloveAnimation}
        loop
        autoplay
        aria-hidden="true"
      />
    </div>
  );
}
