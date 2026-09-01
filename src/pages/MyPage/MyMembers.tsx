import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyMembers.css";

import Header from "../../components/Header/Header";
import MemberSelectCard from "../../components/MemberSelectCard/MemberSelectCard";
import MemberAddCard from "../../components/MemberAddCard/MemberAddCard";

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

/**
 * Figma: [11-2] 여행 구성원 관리 (237:7336)
 *
 * 개발 노트 1 (237:7350) [구성원 카드] —
 *   구성원 카드에서 수정 및 삭제 선택 가능.
 *   민감정보 옵션이 없는 경우, 태그 없는 카드 컴포넌트로.
 *
 * [6-3]과 같은 카드인데 **체크박스가 없습니다**(고르는 화면이 아니라 관리 화면).
 * select_card Variant5(235:3683, 태그 있음) · Variant6(235:3710, 태그 없음).
 *
 * ⚠ [11-3] 수정 / [11-4] 삭제는 다음 작업입니다. 지금은 [6-4] 구성원 수정 화면과
 *   [6-5] 삭제 모달로 보냅니다(확인 필요 문서 참고).
 */
export default function MyMembers() {
  const navigate = useNavigate();
  const [members] = useState<Member[]>(MOCK_MEMBERS);

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
            /* TODO(route): [11-3] 구성원 수정 화면이 생기면 바꿔주세요. */
            onEdit={() => navigate(memberEditPath(member.id))}
            /* TODO(route): [11-4] 구성원 삭제 모달이 생기면 연결해주세요. */
            onDelete={() => undefined}
          />
        ))}

        {/* Frame 156 (148:1572) */}
        <MemberAddCard onClick={() => navigate(PATHS.memberNew)} />
      </div>
    </div>
  );
}
