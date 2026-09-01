import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import Card from "../../components/Card/Card";

import characterImage from "../../assets/character.svg";
import { PATHS } from "../../routes/paths";

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

const MOCK_TRIPS: Record<TabKey, Trip[]> = {
  upcoming: [
    { id: "1", title: "여행 제목", theme: "여행 테마" },
    { id: "2", title: "제주도 3박 4일", theme: "휴양" },
  ],

  past: [{ id: "3", title: "부산 2박 3일", theme: "맛집" }],
};

const PREVIEW_EMPTY = false;

/** 메인 홈 */
export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("upcoming");
  const trips = MOCK_TRIPS[tab];

  const hasAnyTrip = Object.values(MOCK_TRIPS).some((list) => list.length > 0);
  const isEmpty = PREVIEW_EMPTY || !hasAnyTrip;

  const handleCreate = () => navigate(PATHS.planStart);

  return (
    <div className="home">
      <Header className="home__header" variant="logo" />
      {isEmpty ? (
        <>
          <img className="home__character" src={characterImage} alt="" />
          <p className="home__empty-text">
            아직 아무 계획도 없어요
            <br />
            아래 버튼을 눌러 일정을 세워봐요!
          </p>

          <Btn
            variant="primary"
            className="home__empty-btn"
            onClick={handleCreate}
          >
            일정 생성하기
          </Btn>
        </>
      ) : (
        <>
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

          <div className="home__cards">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                title={trip.title}
                theme={trip.theme}
                thumbnail={trip.thumbnail}
                onClick={() => {}}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
