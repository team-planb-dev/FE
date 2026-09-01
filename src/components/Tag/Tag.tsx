import type { ReactNode } from "react";

import "./Tag.css";

type TagTone = "purple" | "neutral";

type TagProps = {
  tone?: TagTone;
  className?: string;
  children: ReactNode;
};

/** 알약형 라벨 */
export default function Tag({ tone = "purple", className, children }: TagProps) {
  return (
    <span className={`tag tag--${tone}${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}
