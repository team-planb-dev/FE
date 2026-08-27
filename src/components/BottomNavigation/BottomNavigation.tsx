import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./BottomNavigation.css";

import homeIcon from "../../assets/icn_Home.svg";
import profileIcon from "../../assets/icn_Profile.svg";
import plusIcon from "../../assets/icn_plus.svg";

import { PATHS } from "../../routes/paths";

/**
 * Figma: Bottom Navigation (148:1750) — 390×90
 *  · Frame 17   y22, 390×68, 상단 테두리 1px gray-100, gap 40, 아이템 75×64
 *  · 가운데 원형 버튼 x171 y0, 53×53, Brand/Solid
 *
 * ⚠ 피그마 컴포넌트에 디자이너가 "디자인 수정 필요" 메모를 달아둔 상태입니다.
 *   확정되면 좌표·아이콘을 다시 맞춰야 합니다.
 *
 * 아이콘 색은 SVG에 박혀 있어(#1A2534 / #57697F) 활성·비활성을 파일로 나누면
 * 애셋이 두 배가 됩니다. CSS mask 로 칠해서 파일 하나로 두 상태를 처리합니다.
 */

type Tab = {
  key: string;
  label: string;
  /** 아이콘이 없는 탭은 라벨만 그립니다 — 가운데 "계획 생성" 참고 */
  icon?: string;
  /** 아직 화면이 없는 탭은 undefined */
  to?: string;
};

const TABS: Tab[] = [
  { key: "home", label: "홈", icon: homeIcon, to: PATHS.home },
  /**
   * 가운데 "계획 생성"에는 아이콘을 두지 않습니다.
   *
   * 피그마(148:1755)는 프로필 탭을 복사해 만든 흔적이 남아 있습니다 —
   * 아이콘 이름이 icn_Profile 이고 원본 라벨도 "프로필"입니다.
   * 그 아이콘(x181~209, y28.5~56.5)은 초록 원(x171~224, y0~53)에
   * 거의 다 가려 아래 3.5px 만 삐져나옵니다. 그대로 옮기면 조각만 보여
   * 지우고 초록 원이 이 자리의 아이콘 역할을 하게 했습니다.
   * 계획 생성 전용 아이콘이 나오면 icon 을 넣고 좌표를 다시 맞춰야 합니다.
   */
  // TODO(route): [S6] 계획 생성 화면이 생기면 to: PATHS.plan 을 넣어주세요.
  { key: "plan", label: "계획 생성" },
  // TODO(route): 프로필 화면이 생기면 to: PATHS.profile 을 넣어주세요.
  { key: "profile", label: "프로필", icon: profileIcon },
];

type BottomNavigationProps = {
  /** 가운데 원형 버튼 — 역할이 디자인에 명시되어 있지 않습니다(확인 필요 문서 참고) */
  onFabClick?: () => void;
};

export default function BottomNavigation({
  onFabClick,
}: BottomNavigationProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {/* Frame 17 (148:1750) */}
      <ul className="bottom-nav__tabs">
        {TABS.map((tab) => {
          const active = tab.to !== undefined && pathname.startsWith(tab.to);
          return (
            <li key={tab.key} className="bottom-nav__item">
              <button
                type="button"
                className={`bottom-nav__tab${active ? " bottom-nav__tab--active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => tab.to && navigate(tab.to)}
              >
                {/* 아이콘이 없어도 28px 자리는 비워둡니다 —
                    빼버리면 라벨이 14px 올라가 다른 탭과 안 맞습니다. */}
                <span
                  className={`bottom-nav__icon${tab.icon ? "" : " bottom-nav__icon--empty"}`}
                  style={
                    tab.icon
                      ? ({
                          // ⚠ 따옴표 필수. Vite 는 작은 SVG 를 작은따옴표가 들어간
                          //   data URI 로 인라인해서, url() 을 감싸지 않으면
                          //   선언 전체가 무효 처리되어 아이콘이 사각형으로 보입니다.
                          "--bottom-nav-icon": `url("${tab.icon}")`,
                        } as CSSProperties)
                      : undefined
                  }
                  aria-hidden="true"
                />
                <span className="bottom-nav__label">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Frame 1707482456 (148:1820) — x171 y0, 53×53 */}
      <button
        type="button"
        className="bottom-nav__fab"
        aria-label="일정 생성"
        onClick={onFabClick}
      >
        <img className="bottom-nav__fab-icon" src={plusIcon} alt="" />
      </button>
    </nav>
  );
}
