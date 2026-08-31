import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./PlanMembers.css";

import Header from "../../components/Header/Header";
import TitleL from "../../components/TitleL/TitleL";
import Subtitle from "../../components/Subtitle/Subtitle";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import BottomBar from "../../components/BottomBar/BottomBar";
import Btn from "../../components/Btn/Btn";
import Modal from "../../components/Modal/Modal";

import { PATHS } from "../../routes/paths";

/**
 * Figma: [6-2] 등록한 구성원 없을 때 (237:7084)
 *        [6-3] MY에서 등록한 구성원이 있을 때 (237:7122 미선택 / 237:7132 1개 선택)
 *        [6-5] 구성원 삭제 (237:7204 목록 → 237:7222 확인 모달 → 237:7213 삭제 후)
 * 한 화면의 여러 상태입니다.
 *
 * 개발 노트
 *  [6-2] 1 — 구성원은 여행에 묶이지 않고 여행과 별도로 등록·수정됩니다.
 *  [6-2] 2 — 헤더 ← 와 [그만두기] 모두 메인으로 나갑니다.
 *  [6-2] 3 — 구성원이 없으면 [등록하기]가 활성화되지 않습니다.
 *  [6-3] 1 — 터치 영역은 체크박스가 아니라 카드 전체이고,
 *            카드가 하나 이상 선택되어야 [등록하기]가 활성화됩니다.
 *
 * [6-5]는 마지막 구성원을 지우면 [6-2] 빈 상태로 돌아갑니다(237:7213).
 */

type Member = {
  id: string;
  name: string;
  tags: string[];
};

/**
 * TODO(api): MY에 등록된 구성원 목록 조회 API로 교체하세요.
 * 서버가 없어 목업으로 둡니다.
 */
const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "김하늘", tags: ["알레르기 주의", "복약", "당뇨"] },
  { id: "2", name: "박서준", tags: ["알레르기 주의", "복약", "당뇨"] },
];

/**
 * 미리보기용 스위치 — true 로 바꾸면 [6-2] 구성원이 없는 상태를 볼 수 있습니다.
 * API 를 붙이면 이 줄과 함께 지우고, 조회 결과가 비었는지로 판단하면 됩니다.
 */
const PREVIEW_EMPTY = false;

export default function PlanMembers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>(
    PREVIEW_EMPTY ? [] : MOCK_MEMBERS,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  /** [6-5] 삭제 확인 모달 — 지울 구성원. null 이면 닫힌 상태입니다. */
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // TODO(api): 구성원 삭제 API로 교체하세요.
  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setPendingDelete(null);
  };

  // 개발 노트 [6-2] 3 / [6-3] 1 — 하나 이상 선택되어야 활성화됩니다.
  const canSubmit = selectedIds.length > 0;

  // 개발 노트 [6-2] 2 — 헤더 ← 와 [그만두기] 모두 메인으로.
  const leave = () => navigate(PATHS.home);

  return (
    <div className="plan-members">
      {/* Header (237:7085) — x0 y0 */}
      <Header className="plan-members__header" onBack={leave} />

      {/* heading (237:7086) — y54, w390 */}
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

      {/* 237:7127 — y228, w342, gap 20
          ⚠ 피그마 x 는 21 이라 좌우가 21/27 로 비대칭입니다.
            [6-2]의 같은 카드가 24 이므로 24 로 맞췄습니다(확인 필요 문서 참고). */}
      <div className="plan-members__list">
        {members.map((member) => (
          <MemberSelectCard
            key={member.id}
            id={member.id}
            name={member.name}
            tags={member.tags}
            selected={selectedIds.includes(member.id)}
            onToggle={() => toggle(member.id)}
            // TODO(route): [6-4] 구성원 수정 화면이 생기면 연결해주세요.
            onEdit={() => {}}
            onDelete={() => setPendingDelete(member)}
          />
        ))}

        {/* Frame 156 (148:1572) — 342×114, r10, neutral-100 */}
        {/* TODO(route): [6-6] 신규 구성원 등록 화면이 생기면 연결해주세요. */}
        <button type="button" className="plan-members__add">
          {/* icn_empty_s / Variant7 (88:1049) — 20×20, y33
              TODO(asset): icn_plus.svg 는 임시본입니다. Variant7 을 20×20 프레임째
              export 하면 이 자리와 바텀 네비 가운데 버튼이 함께 해결됩니다. */}
          <span className="plan-members__add-icon" aria-hidden="true" />
          {/* 148:1529 — y63, 16px Medium / 1.5 / -0.32px / neutral-500 */}
          <span className="plan-members__add-label">구성원 추가하기</span>
        </button>
      </div>

      {/* bottom (237:7090) — y724, 390×120 */}
      <BottomBar>
        <Btn variant="outline" onClick={leave}>
          그만두기
        </Btn>
        {/* TODO(route): 구성원 선택 다음 단계 화면이 아직 없습니다. */}
        <Btn
          variant={canSubmit ? "primary" : "muted"}
          onClick={() => {}}
          disabled={!canSubmit}
        >
          등록하기
        </Btn>
      </BottomBar>

      {/* [6-5] 삭제 확인 (237:7222) */}
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
