import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyPage.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import BottomNavigation from "../../components/BottomNavigation/BottomNavigation";
import Modal from "../../components/Modal/Modal";
import Snackbar from "../../components/Snackbar/Snackbar";

import arrowIcon from "../../assets/icn_chevron_right.svg";

import { fetchMe, logout as requestLogout } from "../../api/auth";
import { deleteUser } from "../../api/user";
import { clearAccessToken } from "../../api/tokenStore";
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

const WITHDRAW_ERROR_MESSAGE = "탈퇴하지 못했어요.";

/** 이름을 못 불러왔을 때. username 은 이메일이라 화면에 쓰지 않습니다 */
const NAME_FALLBACK = "내 정보";

/** 마이페이지 */
export default function MyPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    fetchMe()
      .then((me) => {
        if (alive) setNickname(me.nickname);
      })
      .catch(() => {
        // 이름은 없어도 나머지 메뉴는 쓸 수 있어야 합니다
      });

    return () => {
      alive = false;
    };
  }, []);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const withdraw = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);

    try {
      await deleteUser();
      clearAccessToken();
      setWithdrawOpen(false);
      navigate(PATHS.landing, { replace: true });
    } catch {
      setWithdrawOpen(false);
      setError(WITHDRAW_ERROR_MESSAGE);
      setBusy(false);
    }
  };

  // 서버 호출이 실패해도 토큰은 비워지므로 그대로 진행합니다
  const logout = async () => {
    if (busy) return;
    setBusy(true);

    await requestLogout();
    setLogoutOpen(false);
    navigate(PATHS.landing, { replace: true });
  };

  return (
    <div className="my-page">
      <Header className="my-page__header" variant="empty" />
      <TitleL className="my-page__title">{nickname || NAME_FALLBACK}</TitleL>
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

      {error && <Snackbar className="my-page__snackbar">{error}</Snackbar>}

      {withdrawOpen && (
        <Modal
          title={WITHDRAW_MODAL.title}
          description={WITHDRAW_MODAL.description}
          cancelLabel={WITHDRAW_MODAL.cancelLabel}
          confirmLabel={WITHDRAW_MODAL.confirmLabel}
          confirmVariant="danger"
          onCancel={() => setWithdrawOpen(false)}
          onConfirm={() => void withdraw()}
        />
      )}

      {logoutOpen && (
        <Modal
          title={LOGOUT_MODAL.title}
          description={LOGOUT_MODAL.description}
          cancelLabel={LOGOUT_MODAL.cancelLabel}
          confirmLabel={LOGOUT_MODAL.confirmLabel}
          onCancel={() => setLogoutOpen(false)}
          onConfirm={() => void logout()}
        />
      )}
    </div>
  );
}
