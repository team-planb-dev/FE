import "./ChipsXL.css";

type ChipsXLProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** 72×72 아이콘. 없으면 디자인의 분홍 자리표시자를 그립니다 */
  icon?: string;
};

/**
 * Figma: Chips_XL — 167×167, padding 24/47, r10, gap 24
 *  - 미선택 (19:548)  bg neutral-50,   테두리 neutral-100
 *  - 선택   (344:9527) bg Brand/bg-weak, 테두리 Brand/pressed
 *
 * [7-4] 이동수단 · [7-6] 여행 스타일 · [7-7] 여행 테마에서 씁니다.
 *
 * ⚠ 아이콘이 디자인에도 `icn_empty_lg`(18:496) 자리표시자입니다 —
 *   분홍 상자에 "아이콘" 이라고만 적혀 있습니다. 실제 에셋이 필요합니다.
 */
export default function ChipsXL({
  label,
  selected,
  onClick,
  icon,
}: ChipsXLProps) {
  return (
    <button
      type="button"
      className={`chips-xl${selected ? " chips-xl--on" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon ? (
        <img className="chips-xl__icon" src={icon} alt="" aria-hidden="true" />
      ) : (
        <span className="chips-xl__icon-placeholder" aria-hidden="true">
          아이콘
        </span>
      )}
      <span className="chips-xl__label">{label}</span>
    </button>
  );
}
