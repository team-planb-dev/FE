import { useNavigate } from "react-router-dom";

import "./TripLoading.css";

import Header from "../../components/Header/Header";
import Avatar from "../../components/Avatar/Avatar";

import { PATHS } from "../../routes/paths";

/** AI 일정 생성 중 */
export default function TripLoading() {
  const navigate = useNavigate();

  return (
    <div className="trip-loading">
      <Header
        className="trip-loading__header"
        onBack={() => navigate(PATHS.tripConfirm)}
      />

      <Avatar className="trip-loading__avatar" />
      <p className="trip-loading__title">
        AI가 맞춤 여행 일정을
        <br />
        생성하고 있어요..
      </p>

      <p className="trip-loading__subtitle">잠시만 기다려 주세요..</p>
      <button
        type="button"
        className="trip-loading__next"
        onClick={() => navigate(PATHS.tripDetail)}
      >
        생성된 일정 보기
      </button>
    </div>
  );
}
