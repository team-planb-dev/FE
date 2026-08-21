import type { ReactNode } from "react";

import "./BottomBar.css";

type BottomBarProps = {
  children: ReactNode;
};

/**
 * Figma: bottom (206:3044) — 390×120, 흰색 그라데이션 위에 버튼 1개.
 * 프레임마다 프레임 맨 아래에 붙어 있고 그라데이션으로 콘텐츠가 비쳐 보이므로
 * 화면 하단 고정(position: fixed)으로 구현했습니다.
 */
export default function BottomBar({ children }: BottomBarProps) {
  return (
    <div className="bottom-bar">
      <div className="bottom-bar__inner">{children}</div>
    </div>
  );
}
