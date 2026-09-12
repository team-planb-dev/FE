import { useLocation, useNavigate } from "react-router-dom";

import "./MemberConfirm.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import { MOCK_MEMBERS, type Member } from "./memberData";
import { PATHS, memberEditPath } from "../../routes/paths";

/** 여행 구성원 확정 */
export default function MemberConfirm() {
  const navigate = useNavigate();
  const passed = useLocation().state as { members?: Member[] } | null;

  // 선택 화면에서 넘겨준 목록을 쓰고, 직접 주소로 들어오면 목업을 보여줍니다
  const members = passed?.members ?? MOCK_MEMBERS;

  return (
    <div className="member-confirm">
      <Header className="member-confirm__header" variant="empty" />
      <TitleL className="member-confirm__title">여행 구성원을 확정했어요! </TitleL>

      <div className="member-confirm__list">
        {members.map((member) => (
          <MemberSelectCard
            key={member.id}
            id={member.id}
            name={member.name}
            tags={member.tags}
            selectable={false}
            editStyle="icon"
            onEdit={() =>
              navigate(memberEditPath(member.id), {
                state: { from: PATHS.memberConfirm, members },
              })
            }
          />
        ))}
      </div>

      <BottomBar>
        <Btn variant="primary" onClick={() => navigate(PATHS.tripName)}>
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
