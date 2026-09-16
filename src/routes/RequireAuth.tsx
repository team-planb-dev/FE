import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSession } from "../api/session";
import { PATHS } from "./paths";
import { rememberRedirect } from "./redirectTarget";

import "./RequireAuth.css";

const CHECKING = "확인하는 중이에요...";

/**
 * 로그인이 필요한 화면을 감쌉니다.
 *
 * 새로고침하면 Access Token 이 메모리에서 사라지고 `refreshToken` 쿠키로
 * 되살리는 동안 잠깐 비로그인처럼 보입니다. 그 사이에 내보내면 멀쩡히
 * 로그인한 사람이 로그인 화면으로 튕기므로, 복구가 끝날 때까지 기다립니다.
 *
 * 로그인 화면으로 보낼 때 원래 가려던 주소를 들려보냅니다.
 */
export default function RequireAuth() {
  const status = useSession();
  const location = useLocation();

  if (status === "loading") {
    return <p className="require-auth">{CHECKING}</p>;
  }

  if (status === "guest") {
    const target = location.pathname + location.search;
    rememberRedirect(target);

    return <Navigate to={PATHS.login} replace state={{ from: target }} />;
  }

  return <Outlet />;
}
