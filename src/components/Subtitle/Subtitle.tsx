import type { ReactNode } from "react";

import "./Subtitle.css";

type SubtitleProps = {
  /** 페이지에서 위치를 잡을 때 쓰는 추가 클래스 */
  className?: string;
  children: ReactNode;
};

/** Figma: subtitle (187:1402) — w390, padding 12/24, 14px Medium / 1.6 / -0.28px */
export default function Subtitle({ className, children }: SubtitleProps) {
  return (
    <div className={className ? `subtitle ${className}` : "subtitle"}>
      <p className="subtitle__text">{children}</p>
    </div>
  );
}
