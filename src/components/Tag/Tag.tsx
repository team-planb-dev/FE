import type { ReactNode } from "react";

import "./Tag.css";

/**
 * Figma: Tag (393:9377) — 알약형 라벨
 * 배경 purple/bg #FDF6FF, 글자 purple/solid #B747E3.
 *
 * ⚠ 디자인에 보라색 한 벌만 있습니다. 여행 테마가 여러 종류라면
 *   테마별 색이 더 필요하므로 tone 을 열어두었습니다.
 */
type TagTone = "purple";

type TagProps = {
  tone?: TagTone;
  className?: string;
  children: ReactNode;
};

export default function Tag({ tone = "purple", className, children }: TagProps) {
  return (
    <span className={`tag tag--${tone}${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}
