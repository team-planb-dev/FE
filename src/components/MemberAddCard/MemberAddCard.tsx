import "./MemberAddCard.css";

const LABEL = "구성원 추가하기";

/** 구성원 추가하기 카드 */
export default function MemberAddCard({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="member-add" onClick={onClick}>
      <span className="member-add__icon" aria-hidden="true" />
      <span className="member-add__label">{LABEL}</span>
    </button>
  );
}
