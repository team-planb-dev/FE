import { useEffect, useState } from "react";
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
import Snackbar from "../../components/Snackbar/Snackbar";

import { deleteCompanion, fetchCompanions } from "../../api/companion";
import { toMember } from "./companionForm";
import type { Member, RegisteredNavState } from "./memberData";
import { PATHS, memberEditPath } from "../../routes/paths";

const LOAD_FAILED = "구성원을 불러오지 못했어요.";
const DELETE_FAILED = "삭제하지 못했어요.";

/** 여행 구성원 선택 */
export default function PlanMembers() {
  const navigate = useNavigate();

  const registered = useLocation().state as RegisteredNavState | null;
  const justRegistered = registered?.justRegistered === true;
  const registeredName = registered?.registeredName;

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  useEffect(() => {
    let alive = true;

    fetchCompanions()
      .then((list) => {
        if (!alive) return;

        const mapped = list.map(toMember);
        setMembers(mapped);
        setError(null);

        // 방금 등록한 구성원을 체크된 상태로 보여줍니다
        if (!registeredName) return;
        const mine = lastNamed(mapped, registeredName);
        if (mine) setSelectedIds([mine.id]);
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
  }, [registeredName]);

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);

    try {
      await deleteCompanion(Number(id));
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      setError(null);
    } catch {
      setError(DELETE_FAILED);
    }
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
        {loading ? (
          <p className="plan-members__status">불러오는 중…</p>
        ) : (
          <>
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
          </>
        )}
      </div>

      <BottomBar>
        <Btn variant="outline" onClick={leave}>
          그만두기
        </Btn>

        <Btn
          variant={canSubmit ? "primary" : "muted"}
          onClick={() =>
            canSubmit &&
            navigate(PATHS.memberConfirm, {
              state: {
                members: members.filter((m) => selectedIds.includes(m.id)),
              },
            })
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
          onConfirm={() => void confirmDelete()}
        />
      )}

      {error && <Snackbar className="plan-members__snackbar">{error}</Snackbar>}
    </div>
  );
}

/** 같은 이름이 여럿이면 healthId 가 가장 큰 쪽이 방금 만든 구성원입니다 */
function lastNamed(list: Member[], name: string): Member | null {
  const matched = list.filter((member) => member.name === name);
  if (matched.length === 0) return null;

  return matched.reduce((latest, member) =>
    Number(member.id) > Number(latest.id) ? member : latest,
  );
}
