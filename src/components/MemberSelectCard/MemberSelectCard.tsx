import "./MemberSelectCard.css";

import Checkbox from "../Checkbox/Checkbox";
import Tag from "../Tag/Tag";
import BtnWithIcon from "../BtnWithIcon/BtnWithIcon";

import editIcon from "../../assets/icn_edit.svg";
import trashIcon from "../../assets/icn_trash.svg";

type MemberSelectCardProps = {
  id: string;
  name: string;
  /** 알레르기·복약·질환 등 구성원 특성 라벨 */
  tags: string[];
  /** false 면 체크박스 없이 이름 + 수정·삭제만 (Variant5 235:3683 / Variant6 235:3710) */
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

/**
 * Figma: 구성원 select card
 *  · Default  (148:1556) 배경 흰색,   테두리 neutral-200
 *  · Variant3 (232:2706) 배경 Brand/bg-weak, 테두리 Brand/Solid
 *  · Variant5 (235:3683) 체크박스 없이 태그까지 — [11-2] 여행 구성원 관리
 *  · Variant6 (235:3710) 체크박스도 태그도 없음 — 같은 화면
 *
 * 개발 노트([6-3] 1번): 터치 영역은 체크박스가 아니라 카드 전체입니다.
 * 카드 안의 수정·삭제 버튼은 카드 선택과 겹치므로 클릭 전파를 막습니다.
 */
export default function MemberSelectCard({
  id,
  name,
  tags,
  selectable = true,
  selected = false,
  onToggle,
  onEdit,
  onDelete,
}: MemberSelectCardProps) {
  return (
    <div
      className={`member-card${selectable ? "" : " member-card--plain"}${
        selected ? " member-card--selected" : ""
      }`}
      onClick={selectable ? onToggle : undefined}
    >
      <div className="member-card__row">
        {/* 체크박스 자체 클릭은 input 의 onChange 가 처리하므로 카드로 전파하지 않습니다.
            [11-2]는 고르는 화면이 아니라 체크박스가 없습니다. */}
        {selectable && (
          <span
            className="member-card__check"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              id={`member-${id}`}
              checked={selected}
              onChange={() => onToggle?.()}
            />
          </span>
        )}

        {/* 148:1537 — 18px Medium / 1.5 / -0.36px / neutral-900 */}
        <p className="member-card__name">{name}</p>

        {/* 187:1317 — gap 4 */}
        <div
          className="member-card__actions"
          onClick={(e) => e.stopPropagation()}
        >
          {/* TODO(route): [6-4] 구성원 수정 화면이 생기면 연결해주세요. */}
          <BtnWithIcon icon={editIcon} label="수정" onClick={onEdit} />
          {/* TODO(route): [6-5] 구성원 삭제 화면이 생기면 연결해주세요. */}
          <BtnWithIcon icon={trashIcon} label="삭제" onClick={onDelete} />
        </div>
      </div>

      {/* 148:1532 — gap 3.
          건강조건을 '아니오'로 등록하면 뱃지가 없습니다([6-6] 개발 노트 3).
          그때는 태그 행과 gap 을 통째로 빼야 카드가 66px 이 됩니다(237:6996). */}
      {tags.length > 0 && (
        <div className="member-card__tags">
          {tags.map((tag) => (
            <Tag key={tag} tone="neutral">
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}
