import type { ReactNode } from "react";

import "./Tag.css";

/**
 * Figma: 알약형 라벨. 모양(padding 4/8, radius 200, 10px Medium / 1.5 / -0.2px)이
 * 같은 컴포넌트가 파일에 두 벌 있어 색만 tone 으로 갈랐습니다.
 *
 *  - "purple"  → Tag (393:9377)  [S5] 여행 테마.   bg #FDF6FF / 글자 #B747E3
 *  - "neutral" → Tag (87:3470)   [6-3] 구성원 특성. bg #FAFAFA / 글자 #525252
 *
 * ⚠ 두 Tag 는 Figma 상 별개 컴포넌트인데 치수가 완전히 같습니다.
 *   한 컴포넌트의 variant 로 합치는 편이 맞아 보입니다(확인 필요 문서 참고).
 */
type TagTone = "purple" | "neutral";

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
