import type { ReactNode } from "react";

import "./BottomBar.css";

type BottomBarProps = {
  children: ReactNode;
};

/** 화면 하단 고정 버튼 영역 390×120 */
export default function BottomBar({ children }: BottomBarProps) {
  return (
    <div className="bottom-bar">
      <div className="bottom-bar__inner">{children}</div>
    </div>
  );
}
