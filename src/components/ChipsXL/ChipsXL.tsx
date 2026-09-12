import type { CSSProperties } from "react";

import "./ChipsXL.css";

type ChipsXLProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon: string;
};

/** 아이콘이 큰 선택 칩 */
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
      <span
        className="chips-xl__icon"
        style={{ "--chips-xl-icon": `url("${icon}")` } as CSSProperties}
        aria-hidden="true"
      />
      <span className="chips-xl__label">{label}</span>
    </button>
  );
}
