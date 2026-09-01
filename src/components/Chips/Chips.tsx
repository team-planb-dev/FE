import type { ReactNode } from "react";

import "./Chips.css";

type ChipsProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

/** 선택 칩 */
export default function Chips({
  selected,
  onClick,
  children,
  className,
}: ChipsProps) {
  return (
    <button
      type="button"
      className={`chips chips--${selected ? "on" : "off"}${
        className ? ` ${className}` : ""
      }`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
