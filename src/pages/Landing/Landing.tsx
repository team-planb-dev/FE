import { useNavigate } from "react-router-dom";

import "./Landing.css";

import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import characterIcon from "../../assets/character.svg";

import { PATHS } from "../../routes/paths";

const TITLE = ["고령 · 질환자를 위한", "AI 여행 플래너"];
const START = "시작하기";

/** 랜딩. 시작하기를 누르면 로그인으로 */
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <p className="landing__title">
        {TITLE[0]}
        <br />
        {TITLE[1]}
      </p>

      <img className="landing__character" src={characterIcon} alt="" aria-hidden="true" />

      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.login)}>
          {START}
        </Btn>
      </BottomBar>
    </div>
  );
}
