import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyMembers.css";

import Header from "../../components/Header/Header";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import MemberAddCard from "../../components/MemberAddCard/MemberAddCard";
import Modal from "../../components/Modal/Modal";
import Snackbar from "../../components/Snackbar/Snackbar";

import { deleteCompanion, fetchCompanions } from "../../api/companion";
import { toMember } from "../Plan/companionForm";
import type { Member } from "../Plan/memberData";
import { PATHS, memberEditPath } from "../../routes/paths";

const DELETE_DESC = "한 번 삭제한 구성원은 다시 복구할 수 없어요.";
const LOAD_FAILED = "구성원을 불러오지 못했어요.";
const DELETE_FAILED = "삭제하지 못했어요.";

/** 여행 구성원 관리. 카드에서 수정·삭제 */
export default function MyMembers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  useEffect(() => {
    let alive = true;

    fetchCompanions()
      .then((list) => {
        if (!alive) return;
        setMembers(list.map(toMember));
        setError(null);
      })
      .catch(() => {
        if (alive) setError(LOAD_FAILED);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);

    try {
      await deleteCompanion(Number(id));
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setError(null);
    } catch {
      setError(DELETE_FAILED);
    }
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
        {loading ? (
          <p className="my-members__status">불러오는 중…</p>
        ) : (
          <>
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
          </>
        )}
      </div>

      {pendingDelete && (
        <Modal
          title={`${pendingDelete.name}을 삭제하시겠어요?`}
          description={DELETE_DESC}
          cancelLabel="그만두기"
          confirmLabel="삭제하기"
          confirmVariant="danger"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => void confirmDelete()}
        />
      )}

      {error && <Snackbar className="my-members__snackbar">{error}</Snackbar>}
    </div>
  );
}
