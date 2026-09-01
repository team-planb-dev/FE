import type { ReactNode } from "react";

import "./TitleL.css";

type TitleLProps = {
  className?: string;
  children: ReactNode;
};

/** 화면 제목 */
export default function TitleL({ className, children }: TitleLProps) {
  return (
    <div className={className ? `title-l ${className}` : "title-l"}>
      <p className="title-l__text">{children}</p>
    </div>
  );
}
