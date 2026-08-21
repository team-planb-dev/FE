import type { ReactNode } from "react";

import "./Btn.css";

/**
 * Figma 변형 그대로 매핑
 *  - "primary" → Btn / Variant1 (18:331)  bg #00513F, 글자 #FFFFFF
 *  - "muted"   → Btn / Variant2 (73:844)  bg #F5F5F5, 글자 #A3A3A3
 *  - "outline" → Btn / Default  (73:685)  bg #FFFFFF, 테두리 #E5E5E5, 글자 #0A0A0A
 */
type BtnVariant = "primary" | "muted" | "outline";

type BtnProps = {
  variant: BtnVariant;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  /** 페이지에서 폭을 잡을 때 쓰는 추가 클래스 */
  className?: string;
};

/** Figma: Btn — h54, r10, 14px SemiBold / 1.3 / -0.14px */
export default function Btn({
  variant,
  children,
  onClick,
  type = "button",
  disabled,
  className,
}: BtnProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
