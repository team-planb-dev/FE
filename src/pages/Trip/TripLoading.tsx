import { useNavigate } from "react-router-dom";
import { LottieLight } from "lottie-react";

import "./TripLoading.css";

import Header from "../../components/Header/Header";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import cloveAnimation from "../../assets/clove.json";
import { useTripSubmit } from "./useTripSubmit";
import { PATHS } from "../../routes/paths";

const TITLE = ["{AI}가 관광 명소를", "찾아보고 있어요.."];
const SUBTITLE = "잠시만 기다려 주세요..";

const FAILED_TITLE = ["일정을 만들지", "못했어요."];

/** AI 일정 생성 중. 응답이 오면 [8-1] 로 넘어갑니다 */
export default function TripLoading() {
  const navigate = useNavigate();
  const { error, retry } = useTripSubmit();

  const title = error ? FAILED_TITLE : TITLE;

  return (
    <div className="trip-loading">
      <Header className="trip-loading__header" variant="empty" />

      <div className="trip-loading__texts">
        <p className="trip-loading__title">
          {title[0]}
          <br />
          {title[1]}
        </p>
        <p className="trip-loading__subtitle">{error ?? SUBTITLE}</p>
      </div>

      {!error && (
        <LottieLight
          className="trip-loading__animation"
          src={cloveAnimation}
          loop
          autoplay
          aria-hidden="true"
        />
      )}

      {error && (
        <BottomBar>
          <Btn variant="outline" onClick={() => navigate(PATHS.tripConfirm)}>
            이전으로
          </Btn>
          <Btn variant="primary" onClick={retry}>
            다시 시도
          </Btn>
        </BottomBar>
      )}
    </div>
  );
}
