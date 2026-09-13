import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyPage.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";
import Modal from "../../components/Modal/Modal";

import arrowIcon from "../../assets/icn_chevron_right.svg";

import { PATHS, myTermsDetailPath } from "../../routes/paths";

const WITHDRAW = "회원탈퇴";

const WITHDRAW_MODAL = {
  title: "정말 탈퇴하시겠어요?",
  description: "탈퇴하면 지금까지의 여행 기록이 사라져요.",
  cancelLabel: "그만두기",
  confirmLabel: "탈퇴하기",
};

// 로그아웃 모달은 디자인에 없어 회원탈퇴 모달과 같은 형식으로 맞췄습니다
const LOGOUT_MODAL = {
  title: "로그아웃 하시겠어요?",
  description: "다시 이용하려면 로그인이 필요해요.",
  cancelLabel: "그만두기",
  confirmLabel: "로그아웃",
};

/** 마이페이지 */
export default function MyPage() {
  const navigate = useNavigate();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const menus = [
    {
      label: "여행 구성원 관리",
      onClick: () => navigate(PATHS.myMembers),
    },
    {
      label: "서비스 이용약관",
      onClick: () => navigate(myTermsDetailPath("service")),
    },
    {
      label: "개인정보 수집·이용 동의",
      onClick: () => navigate(myTermsDetailPath("privacy")),
    },
    { label: "로그아웃", onClick: () => setLogoutOpen(true), arrow: false },
  ];

  // TODO(api): 탈퇴 요청을 보내고 성공하면 이동합니다
  const withdraw = () => {
    setWithdrawOpen(false);
    navigate(PATHS.landing, { replace: true });
  };

  // TODO(api): 토큰을 지우고 이동합니다
  const logout = () => {
    setLogoutOpen(false);
    navigate(PATHS.landing, { replace: true });
  };

  return (
    <div className="my-page">
      <Header className="my-page__header" variant="empty" />
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
        onClick={() => setWithdrawOpen(true)}
      >
        {WITHDRAW}
      </button>

      <BottomNavigation />

      {withdrawOpen && (
        <Modal
          title={WITHDRAW_MODAL.title}
          description={WITHDRAW_MODAL.description}
          cancelLabel={WITHDRAW_MODAL.cancelLabel}
          confirmLabel={WITHDRAW_MODAL.confirmLabel}
          confirmVariant="danger"
          onCancel={() => setWithdrawOpen(false)}
          onConfirm={withdraw}
        />
      )}

      {logoutOpen && (
        <Modal
          title={LOGOUT_MODAL.title}
          description={LOGOUT_MODAL.description}
          cancelLabel={LOGOUT_MODAL.cancelLabel}
          confirmLabel={LOGOUT_MODAL.confirmLabel}
          onCancel={() => setLogoutOpen(false)}
          onConfirm={logout}
        />
      )}
    </div>
  );
}
