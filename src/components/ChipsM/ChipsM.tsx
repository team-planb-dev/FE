import type { ReactNode } from "react";

import "./ChipsM.css";

type ChipsMProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
};

/** 선택 칩 (중간 크기) */
export default function ChipsM({ selected, onClick, children }: ChipsMProps) {
  return (
    <button
      type="button"
      className={`chips-m chips-m--${selected ? "on" : "off"}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
