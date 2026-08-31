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
 * 선택 (17:230): 배경 neutral-800(#262626), 글자 흰색.
 *   [6-6] 프레임에는 선택된 Chips_m 이 하나도 없어 한동안 추정값(Brand/Solid)을
 *   썼는데, [7-2] 여행 지역(343:7908)에서 실제 선택 상태가 나와 바로잡았습니다.
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
