/** 라우터. 단계 입력값을 공유하는 흐름은 Provider 로 감쌉니다 */
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Landing from "./pages/Landing/Landing";
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
import MemberMealtime from "./pages/Plan/MemberMealtime";
import MemberFood from "./pages/Plan/MemberFood";
import MemberConfirm from "./pages/Plan/MemberConfirm";
import MemberEdit from "./pages/Plan/MemberEdit";
import MemberFormProvider from "./pages/Plan/MemberFormProvider";
import TripName from "./pages/Trip/TripName";
import TripRegion from "./pages/Trip/TripRegion";
import TripDate from "./pages/Trip/TripDate";
import TripTransport from "./pages/Trip/TripTransport";
import TripPlace from "./pages/Trip/TripPlace";
import TripStyle from "./pages/Trip/TripStyle";
import TripTheme from "./pages/Trip/TripTheme";
import TripFood from "./pages/Trip/TripFood";
import TripConfirm from "./pages/Trip/TripConfirm";
import TripLoading from "./pages/Trip/TripLoading";
import TripDetail from "./pages/Trip/TripDetail";
import TripEdit from "./pages/Trip/TripEdit";
import RestaurantDetail from "./pages/Trip/RestaurantDetail";
import MyPage from "./pages/MyPage/MyPage";
import MyMembers from "./pages/MyPage/MyMembers";
import TripFormProvider from "./pages/Trip/TripFormProvider";

import SignupProvider from "./pages/Signup/SignupProvider";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import { PATHS } from "./routes/paths";

function SignupLayout() {
  return (
    <SignupProvider>
      <Outlet />
    </SignupProvider>
  );
}

function MemberFormLayout() {
  return (
    <MemberFormProvider>
      <Outlet />
    </MemberFormProvider>
  );
}

function TripFormLayout() {
  return (
    <TripFormProvider>
      <Outlet />
    </TripFormProvider>
  );
}

function AppLayout() {
  const navigate = useNavigate();

  return (
    <>
      <Outlet />
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

        <Route path={PATHS.planStart} element={<PlanStart />} />
        <Route path={PATHS.planMembers} element={<PlanMembers />} />
        <Route element={<MemberFormLayout />}>
          <Route path={PATHS.memberNew} element={<MemberNew />} />
          <Route path={PATHS.memberNewConsent} element={<MemberConsent />} />
          <Route path={PATHS.memberNewHealth} element={<MemberHealth />} />
          <Route path={PATHS.memberNewMeds} element={<MemberMeds />} />
          <Route
            path={PATHS.memberNewMedsDetail}
            element={<MemberMedsDetail />}
          />
          <Route path={PATHS.memberNewMealtime} element={<MemberMealtime />} />
          <Route path={PATHS.memberNewFood} element={<MemberFood />} />
        </Route>

        <Route path={PATHS.memberConfirm} element={<MemberConfirm />} />
        <Route path={PATHS.memberEdit} element={<MemberEdit />} />
        <Route path={PATHS.myPage} element={<MyPage />} />
        <Route path={PATHS.myMembers} element={<MyMembers />} />
        <Route element={<TripFormLayout />}>
          <Route path={PATHS.tripName} element={<TripName />} />
          <Route path={PATHS.tripRegion} element={<TripRegion />} />
          <Route path={PATHS.tripDate} element={<TripDate />} />
          <Route path={PATHS.tripTransport} element={<TripTransport />} />
          <Route path={PATHS.tripPlace} element={<TripPlace />} />
          <Route path={PATHS.tripStyle} element={<TripStyle />} />
          <Route path={PATHS.tripTheme} element={<TripTheme />} />
          <Route path={PATHS.tripFood} element={<TripFood />} />
          <Route path={PATHS.tripConfirm} element={<TripConfirm />} />
          <Route path={PATHS.tripLoading} element={<TripLoading />} />
          <Route path={PATHS.tripDetail} element={<TripDetail />} />
          <Route path={PATHS.tripSaved} element={<TripDetail mode="saved" />} />
          <Route path={PATHS.tripShared} element={<TripDetail mode="shared" />} />
          <Route path={PATHS.tripEdit} element={<TripEdit />} />
          <Route
            path={PATHS.restaurantDetail}
            element={<RestaurantDetail />}
          />
        </Route>

        <Route path={PATHS.landing} element={<Landing />} />

        <Route path="*" element={<Navigate to={PATHS.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
