import type { ReactNode } from "react";

import "./ChatBubble.css";

/**
 * Figma: chat_ai 변형
 *  "ai"      Default  (393:8344) Brand/Solid 배경, 흰 글자
 *  "user"    Variant2 (393:8513) 흰 배경 + neutral-100 테두리, neutral-900 글자, 오른쪽 정렬
 *  "loading" Variant3 (393:8517) Default 와 같은데 왼쪽에 16×16 스피너 + gap 4
 */
type ChatBubbleVariant = "ai" | "user" | "loading";

type ChatBubbleProps = {
  variant?: ChatBubbleVariant;
  children: ReactNode;
  /** 페이지에서 폭·정렬을 잡을 때 쓰는 추가 클래스 */
  className?: string;
};

/** Figma: chat_ai — r10, padding 12, 14px Medium / 1.5 / -0.28px */
export default function ChatBubble({
  variant = "ai",
  children,
  className,
}: ChatBubbleProps) {
  const rootClass = `chat-bubble chat-bubble--${variant}${
    className ? ` ${className}` : ""
  }`;

  if (variant === "loading") {
    return (
      <p className={rootClass}>
        {/* lucide/loader-circle (I393:8526;286:9275) — 16×16.
            TODO(asset): 에셋이 없어 자리만 잡았습니다. */}
        <span className="chat-bubble__spinner" aria-hidden="true" />
        <span>{children}</span>
      </p>
    );
  }

  return <p className={rootClass}>{children}</p>;
}
