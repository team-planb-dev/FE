import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./Home.css";

import Header from "../../components/Header/Header";
import Btn from "../../components/Btn/Btn";
import Card from "../../components/Card/Card";

import { TRAVEL_THEME_LABEL } from "../../api/labels";
import type { TravelListItemResponse } from "../../api/schema";
import { fetchTravels } from "../../api/travel";

import characterImage from "../../assets/character.svg";
import { PATHS, tripSavedPath } from "../../routes/paths";

const TABS = [
  { key: "upcoming", label: "일정" },
  { key: "past", label: "지난 일정" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const LOADING_TEXT = "일정을 불러오는 중이에요...";
const FAILED_TEXT = "일정을 불러오지 못했어요. 잠시 후 다시 시도해주세요.";

/** 한쪽 탭에만 일정이 있을 때 반대쪽이 텅 비지 않게 합니다 */
const EMPTY_TAB_TEXT: Record<TabKey, string> = {
  upcoming: "다가오는 일정이 없어요.",
  past: "지난 일정이 없어요.",
};

type Trip = {
  travelId: number;
  title: string;
  /** 카드 아랫줄. 테마가 없는 예전 여행은 지역명으로 채웁니다 */
  tag: string;
  thumbnail?: string;
};

function toTrip(item: TravelListItemResponse): Trip {
  const region = [item.locationDo, item.locationSigungu]
    .filter(Boolean)
    .join(" ");

  const theme = item.travelTheme ? TRAVEL_THEME_LABEL[item.travelTheme] : null;

  return {
    travelId: item.travelId ?? 0,
    title: item.travelName ?? "이름 없는 여행",
    tag: theme ?? region,
    thumbnail: item.thumbnailUrl ?? undefined,
  };
}

/** 메인 홈. 저장한 여행 목록을 보여줍니다 */
export default function Home() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<TabKey>("upcoming");

  const [travels, setTravels] = useState<Record<
    TabKey,
    TravelListItemResponse[]
  > | null>(null);
  const [failed, setFailed] = useState(false);

  /*
   * ⚠ 탭마다 따로 불러야 합니다.
   *   status 를 안 보내면 서버가 UPCOMING 으로 봐서 지난 일정이 아예 안 옵니다.
   *   두 개를 같이 받아두면 탭을 눌렀을 때 기다리지 않습니다
   */
  useEffect(() => {
    let alive = true;

    Promise.all([fetchTravels("UPCOMING"), fetchTravels("PAST")])
      .then(([upcoming, past]) => {
        if (alive) setTravels({ upcoming, past });
      })
      .catch(() => {
        if (alive) setFailed(true);
      });

    return () => {
      alive = false;
    };
  }, []);

  const byTab = useMemo(() => {
    const clean = (list: TravelListItemResponse[]) =>
      list.filter((item) => item.travelId !== null).map(toTrip);

    return {
      upcoming: clean(travels?.upcoming ?? []),
      past: clean(travels?.past ?? []),
    };
  }, [travels]);

  const loading = travels === null && !failed;
  const hasAnyTrip = byTab.upcoming.length > 0 || byTab.past.length > 0;

  // ?empty=1 은 디자인 확인용으로 남겨둡니다
  const isEmpty = params.get("empty") === "1" || (!loading && !hasAnyTrip);

  const handleCreate = () => navigate(PATHS.planStart);

  if (failed) {
    return (
      <div className="home">
        <Header className="home__header" variant="empty" />
        <p className="home__status">{FAILED_TEXT}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="home">
        <Header className="home__header" variant="empty" />
        <p className="home__status">{LOADING_TEXT}</p>
      </div>
    );
  }

  return (
    <div className="home">
      <Header className="home__header" variant="empty" />
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

          {byTab[tab].length === 0 && (
            <p className="home__status">{EMPTY_TAB_TEXT[tab]}</p>
          )}

          <div className="home__cards">
            {byTab[tab].map((trip) => (
              <Card
                key={trip.travelId}
                title={trip.title}
                theme={trip.tag}
                thumbnail={trip.thumbnail}
                onClick={() => navigate(tripSavedPath(trip.travelId))}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
