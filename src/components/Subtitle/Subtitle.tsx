import type { ReactNode } from "react";

import "./Subtitle.css";

type SubtitleProps = {
  className?: string;
  children: ReactNode;
};

/** 화면 부제 */
export default function Subtitle({ className, children }: SubtitleProps) {
  return (
    <div className={className ? `subtitle ${className}` : "subtitle"}>
      <p className="subtitle__text">{children}</p>
    </div>
  );
}
