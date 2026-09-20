import { useLocation, useNavigate } from "react-router-dom";

import "./MemberConfirm.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";

import type { Member } from "./memberData";
import { PATHS, memberEditPath } from "../../routes/paths";

/** 여행 구성원 확정 */
export default function MemberConfirm() {
  const navigate = useNavigate();
  const passed = useLocation().state as { members?: Member[] } | null;

  const members = passed?.members ?? [];

  return (
    <div className="member-confirm">
      <Header
        className="member-confirm__header"
        variant="back"
        onBack={() => navigate(PATHS.planMembers)}
      />
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
        <Btn
          variant={members.length > 0 ? "primary" : "muted"}
          disabled={members.length === 0}
          onClick={() => navigate(PATHS.tripName, { state: { members } })}
        >
          다음으로
        </Btn>
      </BottomBar>
    </div>
  );
}
