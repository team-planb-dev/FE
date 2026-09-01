import type { ReactNode } from "react";

import "./ChatBubble.css";

import loaderIcon from "../../assets/icn_loader.svg";

type ChatBubbleVariant = "ai" | "user" | "loading";

type ChatBubbleProps = {
  variant?: ChatBubbleVariant;
  children: ReactNode;
  className?: string;
};

/** AI 수정 대화 말풍선. ai / user / loading */
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
        <img className="chat-bubble__spinner" src={loaderIcon} alt="" />
        <span>{children}</span>
      </p>
    );
  }

  return <p className={rootClass}>{children}</p>;
}
