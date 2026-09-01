import "./MemberSelectCard.css";

import Checkbox from "../Checkbox/Checkbox";
import Tag from "../Tag/Tag";
import BtnWithIcon from "../BtnWithIcon/BtnWithIcon";

import editIcon from "../../assets/icn_edit.svg";
import trashIcon from "../../assets/icn_trash.svg";

type MemberSelectCardProps = {
  id: string;
  name: string;
  tags: string[];
  selectable?: boolean;
  selected?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

/** 구성원 카드. selectable=false 면 체크박스 없이 관리용 */
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

        <p className="member-card__name">{name}</p>
        <div
          className="member-card__actions"
          onClick={(e) => e.stopPropagation()}
        >

          <BtnWithIcon icon={editIcon} label="수정" onClick={onEdit} />
          <BtnWithIcon icon={trashIcon} label="삭제" onClick={onDelete} />
        </div>
      </div>

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
