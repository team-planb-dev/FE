import { useNavigate } from "react-router-dom";

import "./MyPage.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";

import arrowIcon from "../../assets/icn_chevron_right.svg";

import { PATHS } from "../../routes/paths";

const WITHDRAW = "회원탈퇴";

/** 마이페이지 */
export default function MyPage() {
  const navigate = useNavigate();

  const menus = [
    {
      label: "여행 구성원 관리",
      onClick: () => navigate(PATHS.myMembers),
    },
    { label: "이용약관", onClick: () => undefined },
    { label: "개인정보처리방침", onClick: () => undefined },
    { label: "로그아웃", onClick: () => undefined, arrow: false },
  ];

  return (
    <div className="my-page">
      <Header className="my-page__header" variant="logo" />
      <TitleL className="my-page__title">{"{사용자 이름}"}</TitleL>
      <ul className="my-page__menu">
        {menus.map((menu) => (
          <li key={menu.label}>
            <button
              type="button"
              className="my-page__row"
              onClick={menu.onClick}
            >
              <span className="my-page__row-label">{menu.label}</span>
              {menu.arrow !== false && (
                <span className="my-page__row-arrow">
                  <img src={arrowIcon} alt="" />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="my-page__withdraw"
        onClick={() => undefined}
      >
        {WITHDRAW}
      </button>

      <BottomNavigation />
    </div>
  );
}
