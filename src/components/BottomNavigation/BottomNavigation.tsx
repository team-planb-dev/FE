import type { CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./BottomNavigation.css";

import homeIcon from "../../assets/icn_Home.svg";
import profileIcon from "../../assets/icn_Profile.svg";

import { PATHS } from "../../routes/paths";

type Tab = {
  key: string;
  label: string;
  icon?: string;
  to?: string;
};

const TABS: Tab[] = [
  { key: "home", label: "홈", icon: homeIcon, to: PATHS.home },
  { key: "plan", label: "계획 생성", to: PATHS.planStart },
  { key: "profile", label: "프로필", icon: profileIcon, to: PATHS.myPage },
];

type BottomNavigationProps = {
  onFabClick?: () => void;
};

/** 하단 탭 바. 홈 · 계획 생성 · 프로필 */
export default function BottomNavigation({
  onFabClick,
}: BottomNavigationProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
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

                <span
                  className={`bottom-nav__icon${tab.icon ? "" : " bottom-nav__icon--empty"}`}
                  style={
                    tab.icon
                      ? ({
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

      <button
        type="button"
        className="bottom-nav__fab"
        aria-label="일정 생성"
        onClick={onFabClick}
      >
        <span className="bottom-nav__fab-icon" aria-hidden="true" />
      </button>
    </nav>
  );
}
