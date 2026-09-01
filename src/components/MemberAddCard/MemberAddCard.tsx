import "./MemberAddCard.css";

/** 148:1529 */
const LABEL = "구성원 추가하기";

/**
 * Figma: Frame 156 (148:1572) — 342×114, r10, neutral-100
 *  [6-2]·[6-3] 구성원 선택과 [11-2] 여행 구성원 관리에서 같이 씁니다.
 */
export default function MemberAddCard({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="member-add" onClick={onClick}>
      {/* icn_empty_s / Variant7 (88:1049) — 20×20, x160 y33
          TODO(asset): icn_plus.svg 는 임시본입니다. Variant7 을 20×20 프레임째
          export 하면 이 자리와 바텀 네비 가운데 버튼이 함께 해결됩니다. */}
      <span className="member-add__icon" aria-hidden="true" />
      {/* 148:1529 — x120 y63, 16px Medium / 1.5 / -0.32px / neutral-500 */}
      <span className="member-add__label">{LABEL}</span>
    </button>
  );
}
