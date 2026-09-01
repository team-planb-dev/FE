import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./PlanMembers.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import MemberAddCard from "../../components/MemberAddCard/MemberAddCard";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";
import Modal from "../../components/Modal/Modal";

import { PATHS, memberEditPath } from "../../routes/paths";

type Member = {
  id: string;
  name: string;
  tags: string[];
};

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "김하늘", tags: ["알레르기 주의", "복약", "당뇨"] },
  { id: "2", name: "박서준", tags: ["알레르기 주의", "복약", "당뇨"] },
];

const PREVIEW_EMPTY = false;

/** 여행 구성원 선택 */
export default function PlanMembers() {
  const navigate = useNavigate();
  const location = useLocation();

  const registered = location.state as
    | { justRegistered?: boolean; newMember?: Member }
    | null;
  const justRegistered = registered?.justRegistered === true;

  const [members, setMembers] = useState<Member[]>(() => {
    const base = PREVIEW_EMPTY ? [] : MOCK_MEMBERS;
    return registered?.newMember ? [registered.newMember, ...base] : base;
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(
    registered?.newMember ? [registered.newMember.id] : [],
  );

  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setPendingDelete(null);
  };

  const canSubmit = selectedIds.length > 0;

  const leave = () => navigate(PATHS.home);

  return (
    <div className="plan-members">
      <Header className="plan-members__header" onBack={leave} />
      <div className="plan-members__heading">
        <TitleL>
          이번 여행을 떠나는
          <br />
          구성원을 선택해주세요.
        </TitleL>
        <Subtitle>
          구성원이 없는 경우는
          <br />
          ‘추가하기&apos; 버튼을 눌러 구성원을 추가해주세요.
        </Subtitle>
      </div>

      <div className="plan-members__list">
        {members.map((member) => (
          <MemberSelectCard
            key={member.id}
            id={member.id}
            name={member.name}
            tags={member.tags}
            selected={selectedIds.includes(member.id)}
            onToggle={() => toggle(member.id)}
            onEdit={() => navigate(memberEditPath(member.id))}
            onDelete={() => setPendingDelete(member)}
          />
        ))}

        <MemberAddCard onClick={() => navigate(PATHS.memberNew)} />
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={leave}>
          그만두기
        </Btn>

        <Btn
          variant={canSubmit ? "primary" : "muted"}
          onClick={() =>
            canSubmit && justRegistered && navigate(PATHS.memberConfirm)
          }
          disabled={!canSubmit}
        >
          {justRegistered ? "완료" : "등록하기"}
        </Btn>
      </BottomBar>

      {pendingDelete && (
        <Modal
          title={`${pendingDelete.name}을 삭제하시겠어요?`}
          description="한 번 삭제한 구성원은 다시 복구할 수 없어요."
          cancelLabel="그만두기"
          confirmLabel="삭제하기"
          confirmVariant="danger"
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
