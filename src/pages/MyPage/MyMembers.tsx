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

/**
 * TODO(api): MY에 등록된 구성원 목록 조회 API로 교체하세요.
 * [6-2]·[6-3]과 같은 목록이라 목업도 같은 모양으로 둡니다.
 */
const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "김하늘", tags: ["알레르기 주의", "복약", "당뇨"] },
  { id: "2", name: "박서준", tags: [] },
];

/** 235:3333 — [11-4] 삭제 확인 모달 */
const DELETE_DESC = "한 번 삭제한 구성원은 다시 복구할 수 없어요.";

/**
 * Figma: [11-2] 여행 구성원 관리 (237:7336)
 *        [11-3] 여행 구성원 수정하기 (237:7359 목록 → 237:7368 건강정보)
 *        [11-4] 여행 구성원 삭제하기 (237:7406 목록 → 237:7415 확인 모달)
 * 세 흐름의 목록 화면이 모두 이 화면입니다.
 *
 * 개발 노트 (237:7350) [구성원 카드] —
 *   구성원 카드에서 수정 및 삭제 선택 가능.
 *   민감정보 옵션이 없는 경우, 태그 없는 카드 컴포넌트로.
 *
 * [6-3]과 같은 카드인데 **체크박스가 없습니다**(고르는 화면이 아니라 관리 화면).
 * select_card Variant5(235:3683, 태그 있음) · Variant6(235:3710, 태그 없음).
 *
 * ⚠ [11-3]·[11-4]의 두 번째 화면이 마이페이지가 아니라 [S6] 화면입니다
 *   (확인 필요 문서 참고). 여기서는 이 목록 위에서 이어지도록 했습니다.
 */
export default function MyMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  /** [11-4] 삭제 확인 모달 — 지울 구성원. null 이면 닫힌 상태입니다. */
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  // TODO(api): 구성원 삭제 API 로 교체하세요.
  const confirmDelete = () => {
    if (!pendingDelete) return;
    setMembers((prev) => prev.filter((m) => m.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  return (
    <div className="my-members">
      {/* Header (237:7337) — 화살표 + 가운데 타이틀 */}
      <Header
        className="my-members__header"
        variant="title"
        title="여행 구성원 관리"
        onBack={() => navigate(PATHS.myPage)}
      />

      {/* 237:7338 — x23 y74, w342, 세로 gap 20.
          ⚠ 디자인은 x23 인데 다른 화면들이 24 라 24 로 맞췄습니다. */}
      <div className="my-members__list">
        {members.map((member) => (
          <MemberSelectCard
            key={member.id}
            id={member.id}
            name={member.name}
            tags={member.tags}
            selectable={false}
            /* [11-3] 237:7368 — [6-4]와 완전히 같은 화면이라 그대로 씁니다.
               [확인]이 이 목록으로 돌아오도록 from 을 넘깁니다. */
            onEdit={() =>
              navigate(memberEditPath(member.id), {
                state: { from: PATHS.myMembers },
              })
            }
            /* [11-4] 235:3342 — 삭제 확인 모달 */
            onDelete={() => setPendingDelete(member)}
          />
        ))}

        {/* Frame 156 (148:1572) */}
        <MemberAddCard onClick={() => navigate(PATHS.memberNew)} />
      </div>

      {/* Modal (235:3342) — 340×196. [6-5]와 문구가 같습니다 */}
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
