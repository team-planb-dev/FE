import type { ReactNode } from "react";

import "./ChipsM.css";

type ChipsMProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
};

/**
 * Figma: Chips_m (17:225) — padding 6/18, radius 200, 14px Medium / 1.5 / -0.42px
 * 미선택: 배경 흰색, 테두리 #E4E4E4, 글자 #636363
 *
 * ⚠ 선택 상태가 디자인에 없습니다 — [6-6] 어느 프레임에도 선택된 Chips_m 이 없습니다.
 *   고르는 칩인데 고른 표시가 없으면 쓸 수 없어, Chips_L 의 선택 상태와 같은
 *   Brand/Solid + 흰 글자로 두었습니다. 확정되면 .chips-m--on 만 고치면 됩니다.
 *
 * ⚠ 테두리 #E4E4E4 와 글자 #636363 은 neutral 팔레트에 없는 값입니다
 *   (가까운 값은 #E5E5E5 / #525252). 원본 그대로 두었습니다.
 */
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
