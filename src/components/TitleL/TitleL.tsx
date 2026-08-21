import type { ReactNode } from "react";

import "./TitleL.css";

type TitleLProps = {
  /** 페이지에서 위치를 잡을 때 쓰는 추가 클래스 */
  className?: string;
  children: ReactNode;
};

/** Figma: title_L (187:1401) — w390, padding 12/24, 22px SemiBold */
export default function TitleL({ className, children }: TitleLProps) {
  return (
    <div className={className ? `title-l ${className}` : "title-l"}>
      <p className="title-l__text">{children}</p>
    </div>
  );
}
