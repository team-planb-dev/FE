import type { ReactNode } from "react";

import "./Btn.css";

type BtnVariant = "primary" | "muted" | "outline" | "danger" | "accent";

type BtnSize = "lg" | "md";

type BtnProps = {
  variant: BtnVariant;
  size?: BtnSize;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

/** 기본 버튼. variant 로 색, size 로 높이를 정합니다 */
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
