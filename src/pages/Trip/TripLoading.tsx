import { useNavigate } from "react-router-dom";

import "./TripLoading.css";

import Header from "../../components/Header/Header";
import Avatar from "../../components/Avatar/Avatar";

import { PATHS } from "../../routes/paths";

/**
 * Figma: [7-10] 로딩 (237:6548)
 *
 * ⚠ 하단 바가 없고 진행 표시(스피너·프로그레스)도 없습니다.
 *   AI 생성이 끝났을 때 어디로 가는지도 디자인에 없습니다 — [S7]의 마지막 화면입니다.
 * ⚠ Avatar(87:3241) 에셋이 없어 자리만 잡아뒀습니다.
 * ⚠ 헤더 ← 의 목적지도 없습니다. 생성 중에 되돌아갈 수 있는지 확인이 필요합니다.
 */
export default function TripLoading() {
  const navigate = useNavigate();

  return (
    <div className="trip-loading">
      {/* Header / Variant2 (237:6549) */}
      <Header
        className="trip-loading__header"
        onBack={() => navigate(PATHS.tripConfirm)}
      />

      {/* Avatar (237:6551) — x24 y94 */}
      <Avatar className="trip-loading__avatar" />

      {/* 237:6550 — x24 y171 */}
      <p className="trip-loading__title">
        AI가 맞춤 여행 일정을
        <br />
        생성하고 있어요..
      </p>

      {/* 237:6552 — x23 y253 */}
      <p className="trip-loading__subtitle">잠시만 기다려 주세요..</p>

      {/* ⚠ 로딩이 끝나면 갈 화면이 디자인에 적혀 있지 않습니다.
          [S8] 여행 일정 상세가 AI 생성 결과라 [8-1]로 연결했습니다.
          자동으로 넘기는 시간도 정해진 게 없어 사용자가 누르게 두었습니다. */}
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
