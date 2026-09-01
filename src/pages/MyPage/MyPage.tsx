import { useNavigate } from "react-router-dom";

import "./MyPage.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";

import arrowIcon from "../../assets/icn_chevron_right.svg";

import { PATHS } from "../../routes/paths";

/** 237:7293 */
const WITHDRAW = "회원탈퇴";

/**
 * Figma: [11-1] 마이페이지 (237:7291)
 *
 * 개발 노트
 *  1 (237:7284) [이용약관 및 개인정보처리방침]
 *  2 (237:7289) [회원탈퇴] — 클릭 시 모달 표시
 *
 * ⚠ 노트 1 에 무엇을 하라는 내용이 없습니다. 두 항목이 [S1] 회원가입의
 *   약관 전체보기(`/signup/terms/:termKey`)와 같은 화면인지 확인이 필요합니다.
 *   지금은 그 화면으로 보냅니다(확인 필요 문서 참고).
 *
 * ⚠ [회원탈퇴] 모달의 문구·버튼이 디자인에 없습니다. 화면도 없어서
 *   지금은 아무 동작도 하지 않습니다.
 */
export default function MyPage() {
  const navigate = useNavigate();

  /** 237:7294 — 메뉴 4줄. 로그아웃만 화살표가 없습니다 */
  const menus = [
    {
      label: "여행 구성원 관리",
      onClick: () => navigate(PATHS.myMembers),
    },
    // TODO(route): 노트 1 — 회원가입 약관 화면과 같은 것인지 확인이 필요합니다.
    { label: "이용약관", onClick: () => undefined },
    { label: "개인정보처리방침", onClick: () => undefined },
    // TODO(api): 로그아웃 처리 후 로그인 화면으로 보내주세요.
    { label: "로그아웃", onClick: () => undefined, arrow: false },
  ];

  return (
    <div className="my-page">
      {/* Header / Variant4 (148:1834) — 가운데 LOGO */}
      <Header className="my-page__header" variant="logo" />

      {/* title_L (237:7330) — y54. TODO(api): 로그인한 사용자 이름 */}
      <TitleL className="my-page__title">{"{사용자 이름}"}</TitleL>

      {/* 237:7294 — x23 y133, w342, 세로 gap 12.
          ⚠ 이 목록만 x23 이고 아래 [회원탈퇴]는 x24 입니다. 24 로 맞췄습니다. */}
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
                /* Icn_Arrow_24 (237:7297) — 24×24, 180° 회전해 오른쪽을 봅니다.
                   TODO(asset): 이 아이콘 에셋이 없어 셰브론으로 대신합니다. */
                <span className="my-page__row-arrow">
                  <img src={arrowIcon} alt="" />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* 237:7292 — x24 y668, 342×46, Status/Negative_solid */}
      <button
        type="button"
        className="my-page__withdraw"
        // TODO(route): 개발 노트 2 — 누르면 모달이 뜬다는데 그 모달이 디자인에 없습니다.
        onClick={() => undefined}
      >
        {WITHDRAW}
      </button>

      {/* Bottom Navigation (237:7332) — y754 */}
      <BottomNavigation />
    </div>
  );
}
