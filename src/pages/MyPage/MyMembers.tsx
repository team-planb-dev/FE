import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyMembers.css";

import Header from "../../components/Header/Header";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import MemberAddCard from "../../components/MemberAddCard/MemberAddCard";
import Modal from "../../components/Modal/Modal";

import { PATHS, memberEditPath } from "../../routes/paths";

type Member = {
  id: string;
  name: string;
  tags: string[];
};

const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "김하늘", tags: ["알레르기 주의", "복약", "당뇨"] },
  { id: "2", name: "박서준", tags: [] },
];

const DELETE_DESC = "한 번 삭제한 구성원은 다시 복구할 수 없어요.";

/** 여행 구성원 관리. 카드에서 수정·삭제 */
export default function MyMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);

  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setMembers((prev) => prev.filter((m) => m.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <div className="my-members">
      <Header
        className="my-members__header"
        variant="title"
        title="여행 구성원 관리"
        onBack={() => navigate(PATHS.myPage)}
      />

      <div className="my-members__list">
        {members.map((member) => (
          <MemberSelectCard
            key={member.id}
            id={member.id}
            name={member.name}
            tags={member.tags}
            selectable={false}
            onEdit={() =>
              navigate(memberEditPath(member.id), {
                state: { from: PATHS.myMembers },
              })
            }
            onDelete={() => setPendingDelete(member)}
          />
        ))}

        <MemberAddCard onClick={() => navigate(PATHS.memberNew)} />
      </div>

      {pendingDelete && (
        <Modal
          title={`${pendingDelete.name}을 삭제하시겠어요?`}
          description={DELETE_DESC}
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
