import { useNavigate } from "react-router-dom";

import "./Landing.css";

import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import logoWhite from "../../assets/logo_white.svg";
import landingCards from "../../assets/landing_cards.svg";
import landingCharacter from "../../assets/landing_character.svg";

import { PATHS } from "../../routes/paths";

const TAGLINE = "시니어 · 질환자를 위한 AI 여행 플래너";
const START = "시작하기";

/** 랜딩. 시작하기를 누르면 로그인으로 */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <img
        className="landing__cards"
        src={landingCards}
        alt=""
        aria-hidden="true"
      />
      <img
        className="landing__character"
        src={landingCharacter}
        alt=""
        aria-hidden="true"
      />

      <div className="landing__heading">
        <p className="landing__tagline">{TAGLINE}</p>
        <img className="landing__logo" src={logoWhite} alt="YEORO" />
      </div>

      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.login)}>
          {START}
        </Btn>
      </BottomBar>
    </div>
  );
}
