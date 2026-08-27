import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import SignupComplete from "./pages/Signup/SignupComplete";
import Terms from "./pages/Terms/Terms";
import FindEmail from "./pages/FindEmail/FindEmail";
import FindEmailResult from "./pages/FindEmail/FindEmailResult";
import FindPassword from "./pages/FindPassword/FindPassword";
import FindPasswordResult from "./pages/FindPassword/FindPasswordResult";
import TermsDetail from "./pages/Terms/TermsDetail";
import Home from "./pages/Home/Home";

import SignupProvider from "./pages/Signup/SignupProvider";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import { PATHS } from "./routes/paths";

/** 회원가입 플로우 전체를 감싸 단계 간 입력값을 공유합니다. */
function SignupLayout() {
  return (
    <SignupProvider>
      <Outlet />
    </SignupProvider>
  );
}

/**
 * 로그인 이후 화면들의 공통 껍데기 — 바텀 네비게이션이 항상 붙습니다.
 * 인증 화면(로그인·회원가입·찾기)은 이 레이아웃 밖에 있어 네비가 나타나지 않습니다.
 */
function AppLayout() {
  return (
    <>
      <Outlet />
      {/* TODO(route): [S6] 계획 생성 화면이 생기면 onFabClick 으로 이동시켜주세요. */}
      <BottomNavigation />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.login} element={<Login />} />

        <Route element={<SignupLayout />}>
          <Route path={PATHS.signup} element={<Signup />} />
          <Route path={PATHS.signupTerms} element={<Terms />} />
          <Route path={PATHS.signupTermsDetail} element={<TermsDetail />} />
          <Route path={PATHS.signupComplete} element={<SignupComplete />} />
        </Route>

        <Route path={PATHS.findEmail} element={<FindEmail />} />
        <Route path={PATHS.findEmailResult} element={<FindEmailResult />} />

        <Route path={PATHS.findPassword} element={<FindPassword />} />
        <Route
          path={PATHS.findPasswordResult}
          element={<FindPasswordResult />}
        />

        <Route element={<AppLayout />}>
          <Route path={PATHS.home} element={<Home />} />
        </Route>

        <Route path="*" element={<Navigate to={PATHS.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
