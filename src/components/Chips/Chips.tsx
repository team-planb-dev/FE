import type { ReactNode } from "react";

import "./Chips.css";

type ChipsProps = {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  /** 페이지에서 폭을 잡을 때 쓰는 추가 클래스 */
  className?: string;
};

/**
 * Figma: Chips_L — padding 8/24, radius 200, 16px Medium / 1.5 / -0.48px
 *  - 선택   (17:169) bg Brand/Solid, 글자 흰색
 *  - 미선택 (17:143) bg neutral-50,  글자 neutral-400
 *
 * ⚠ 자간이 -0.48px 입니다. 같은 16px 인데 인풋은 -0.24px, 라벨은 -0.16px 이라
 *   칩만 유독 좁습니다(확인 필요 문서 참고). 디자인 그대로 두었습니다.
 * ⚠ 선택된 칩만 Chips_L 인스턴스이고 미선택은 분리된 프레임입니다.
 *   같은 컴포넌트의 두 상태로 보고 하나로 구현했습니다.
 */
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
