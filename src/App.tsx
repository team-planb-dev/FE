import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

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
import PlanStart from "./pages/Plan/PlanStart";
import PlanMembers from "./pages/Plan/PlanMembers";
import MemberNew from "./pages/Plan/MemberNew";
import MemberConsent from "./pages/Plan/MemberConsent";
import MemberHealth from "./pages/Plan/MemberHealth";
import MemberMeds from "./pages/Plan/MemberMeds";
import MemberMedsDetail from "./pages/Plan/MemberMedsDetail";
import MemberFormProvider from "./pages/Plan/MemberFormProvider";

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

/** [6-6] 신규 구성원 등록 플로우 전체를 감싸 단계 간 입력값을 공유합니다. */
function MemberFormLayout() {
  return (
    <MemberFormProvider>
      <Outlet />
    </MemberFormProvider>
  );
}

/**
 * 로그인 이후 화면들의 공통 껍데기 — 바텀 네비게이션이 항상 붙습니다.
 * 인증 화면(로그인·회원가입·찾기)은 이 레이아웃 밖에 있어 네비가 나타나지 않습니다.
 */
function AppLayout() {
  const navigate = useNavigate();

  return (
    <>
      <Outlet />
      {/* ⚠ 가운데 초록 원의 역할이 디자인에 명시되어 있지 않습니다(확인 필요 문서 2-c).
          "계획 생성" 탭과 같은 자리라 우선 같은 곳으로 보냅니다. */}
      <BottomNavigation onFabClick={() => navigate(PATHS.planStart)} />
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

        {/* [S6] 화면에는 디자인에 바텀 네비게이션이 없어 AppLayout 밖에 둡니다. */}
        <Route path={PATHS.planStart} element={<PlanStart />} />
        <Route path={PATHS.planMembers} element={<PlanMembers />} />

        {/* [6-6] 신규 구성원 등록 — 단계 간 입력값을 Context 로 공유합니다 */}
        <Route element={<MemberFormLayout />}>
          <Route path={PATHS.memberNew} element={<MemberNew />} />
          <Route path={PATHS.memberNewConsent} element={<MemberConsent />} />
          <Route path={PATHS.memberNewHealth} element={<MemberHealth />} />
          <Route path={PATHS.memberNewMeds} element={<MemberMeds />} />
          <Route
            path={PATHS.memberNewMedsDetail}
            element={<MemberMedsDetail />}
          />
        </Route>

        <Route path="*" element={<Navigate to={PATHS.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
