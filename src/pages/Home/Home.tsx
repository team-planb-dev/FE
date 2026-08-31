import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import Card from "../../components/Card/Card";

import characterImage from "../../assets/character.svg";
import { PATHS } from "../../routes/paths";

/**
 * Figma: [5-1] 메인 홈 — 한 화면의 두 상태
 *  237:7435  홈-empty
 *  237:7427  일정이 있는 상태
 *
 * 개발 노트 1 — [일정 생성하기], 바텀 네비의 [계획 생성] 모두 [S6]으로 연결됩니다.
 * ⚠ 개발 노트 2는 번호만 있고 내용이 비어 있습니다.
 */

/** Figma 237:7429 / 237:7431 */
const TABS = [
  { key: "upcoming", label: "일정" },
  { key: "past", label: "지난 일정" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

type Trip = {
  id: string;
  title: string;
  theme: string;
  thumbnail?: string;
};

/**
 * TODO(api): 일정 목록 조회 API로 교체하세요.
 * 서버가 없어 목업으로 둡니다.
 */
const MOCK_TRIPS: Record<TabKey, Trip[]> = {
  upcoming: [
    { id: "1", title: "여행 제목", theme: "여행 테마" },
    { id: "2", title: "제주도 3박 4일", theme: "휴양" },
  ],
  // ⚠ "지난 일정" 탭 화면이 디자인에 없습니다. 같은 카드 목록으로 두었습니다.
  past: [{ id: "3", title: "부산 2박 3일", theme: "맛집" }],
};

/**
 * 미리보기용 스위치 — true 로 바꾸면 [5-1] 홈-empty(237:7435)를 볼 수 있습니다.
 * API 를 붙이면 이 줄과 함께 지우고, 조회 결과가 비었는지로 판단하면 됩니다.
 */
const PREVIEW_EMPTY = false;

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const trips = MOCK_TRIPS[tab];

  // 일정이 아예 하나도 없을 때만 empty 화면입니다.
  // 탭 하나만 비는 경우는 디자인에 없어 탭은 그대로 두고 목록만 비웁니다.
  const hasAnyTrip = Object.values(MOCK_TRIPS).some((list) => list.length > 0);
  const isEmpty = PREVIEW_EMPTY || !hasAnyTrip;

  // 개발 노트 1 — [일정 생성하기]는 [S6]으로 연결됩니다.
  const handleCreate = () => navigate(PATHS.planStart);

  return (
    <div className="home">
      <Header className="home__header" variant="logo" />

      {isEmpty ? (
        /* ---------- [5-1] 홈-empty (237:7435) ---------- */
        <>
          {/* character (344:11132) — x95 y127, 200×200 */}
          {/* TODO(asset): 확정 캐릭터 일러스트가 나오면 character.svg 를 교체하세요. */}
          <img className="home__character" src={characterImage} alt="" />

          {/* 344:11130 — y339, 가운데 정렬, 16px Medium / 1.4 / -0.16px / neutral-400 */}
          <p className="home__empty-text">
            아직 아무 계획도 없어요
            <br />
            아래 버튼을 눌러 일정을 세워봐요!
          </p>

          {/* Btn (344:11131) — x112 y422, 160×54 */}
          <Btn
            variant="primary"
            className="home__empty-btn"
            onClick={handleCreate}
          >
            일정 생성하기
          </Btn>
        </>
      ) : (
        /* ---------- [5-1] 일정이 있는 상태 (237:7427) ---------- */
        <>
          {/* 237:7429 / 237:7431 — x24 y80 */}
          <div className="home__tabs" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`home__tab${tab === t.key ? " home__tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Card (237:7433) — x24 y149, 280×247
              ⚠ 디자인에는 카드가 1개뿐이라 여러 개일 때의 배치가 미정입니다.
                카드 폭 280 < 화면 390 이라 가로 스크롤로 두었습니다(간격 12는 임시). */}
          <div className="home__cards">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                title={trip.title}
                theme={trip.theme}
                thumbnail={trip.thumbnail}
                // TODO(route): 여행 상세 화면이 생기면 연결해주세요.
                onClick={() => {}}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
