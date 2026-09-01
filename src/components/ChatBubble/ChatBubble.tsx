import type { ReactNode } from "react";

import "./ChatBubble.css";

type ChatBubbleProps = {
  children: ReactNode;
  /** 페이지에서 폭을 잡을 때 쓰는 추가 클래스 */
  className?: string;
};

/**
 * Figma: chat_ai / Default (393:8344) — AI 말풍선
 *  r10, padding 12, 배경 Brand/Solid, 14px Medium / 1.5 / -0.28px / 흰색.
 *
 * ⚠ [9-2]·[9-3] 에는 오른쪽에 붙는 사용자 말풍선도 같은 컴포넌트의 다른 변형으로
 *   들어갑니다. [9-1] 에는 Default 만 나와서 지금은 이 변형만 만들었습니다.
 */
export default function ChatBubble({ children, className }: ChatBubbleProps) {
  return (
    <p className={`chat-bubble${className ? ` ${className}` : ""}`}>
      {children}
    </p>
  );
}
