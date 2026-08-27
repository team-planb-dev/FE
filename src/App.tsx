import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import SignupComplete from "./pages/Signup/SignupComplete";
import Terms from "./pages/Terms/Terms";
import FindEmail from "./pages/FindEmail/FindEmail";
import FindEmailResult from "./pages/FindEmail/FindEmailResult";
import TermsDetail from "./pages/Terms/TermsDetail";

import SignupProvider from "./pages/Signup/SignupProvider";
import { PATHS } from "./routes/paths";

/** 회원가입 플로우 전체를 감싸 단계 간 입력값을 공유합니다. */
function SignupLayout() {
  return (
    <SignupProvider>
      <Outlet />
    </SignupProvider>
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

        <Route path="*" element={<Navigate to={PATHS.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
