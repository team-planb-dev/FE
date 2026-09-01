import type { ReactNode } from "react";

import "./Btn.css";

/**
 * Figma 변형 그대로 매핑
 *  - "primary" → Btn / Variant1 (18:331)  bg #00513F, 글자 #FFFFFF
 *  - "muted"   → Btn / Variant2 (73:844)  bg #F5F5F5, 글자 #A3A3A3
 *  - "outline" → Btn / Default  (73:685)  bg #FFFFFF, 테두리 #E5E5E5, 글자 #0A0A0A
 *  - "danger"  → Modal Btn      (235:3334) bg #FA5852, 글자 #FFFFFF
 *  - "accent"  → Btn            (393:11061) bg #35A68E, r200 알약, 글자 폭만큼 — [9-2] 대화 속 선택지
 */
type BtnVariant = "primary" | "muted" | "outline" | "danger" | "accent";

/**
 * "lg" (54) 가 기본입니다. "md" (48) 는 모달 버튼(235:3334 / 235:3337) 전용입니다.
 * ⚠ 같은 모양의 버튼인데 높이가 화면마다 다릅니다 — 확인 필요 문서 참고.
 */
type BtnSize = "lg" | "md";

type BtnProps = {
  variant: BtnVariant;
  size?: BtnSize;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** 페이지에서 폭을 잡을 때 쓰는 추가 클래스 */
  className?: string;
};

/** Figma: Btn — r10, 14px SemiBold / 1.3 / -0.14px */
export default function Btn({
  variant,
  size = "lg",
  children,
  onClick,
  type = "button",
  disabled,
  className,
}: BtnProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
