import "./Home.css";

import Header from "../../components/Header/Header";

/**
 * Figma: [5-1] 메인 홈 (237:7435 empty / 237:7427 일정 있는 상태)
 *
 * 이번 작업은 레이아웃 골격까지입니다 — 헤더와 바텀 네비가 붙는 자리를 잡습니다.
 * 캐릭터·탭·카드 목록은 다음 이슈에서 채웁니다.
 */
export default function Home() {
  return (
    <div className="home">
      <Header className="home__header" variant="logo" />

      <div className="home__content">
        {/* TODO: [5-1] 두 상태(캐릭터+안내문 / 탭+카드 목록)를 다음 이슈에서 구현합니다. */}
      </div>
    </div>
  );
}
