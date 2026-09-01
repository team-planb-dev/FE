import { useNavigate } from "react-router-dom";

import "./MemberConfirm.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { PATHS } from "../../routes/paths";

/** 여행 구성원 확정 */
export default function MemberConfirm() {
  const navigate = useNavigate();

  return (
    <div className="member-confirm">
      <Header className="member-confirm__header" variant="empty" />
      <TitleL className="member-confirm__title">여행 구성원을 확정했어요! </TitleL>
      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripName)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
