import "./Header.css";

import backIcon from "../../assets/icn_empty_s.svg";
import closeIcon from "../../assets/icn_close_line.svg";

type HeaderProps = {
  /** 페이지에서 위치를 잡을 때 쓰는 추가 클래스 */
  className?: string;
  onBack?: () => void;
  backLabel?: string;
  /**
   * 왼쪽 아이콘 — Figma Header 변형
   *  "back"  : 19:831  (icn_empty_s / Variant2, ←)
   *  "close" : 87:3765 (icn_empty_s / Variant3, ×)
   */
  variant?: "back" | "close";
};

/** Figma: Header — 390×54, padding 15/20 */
export default function Header({
  className,
  onBack,
  backLabel,
  variant = "back",
}: HeaderProps) {
  const isClose = variant === "close";
  const icon = isClose ? closeIcon : backIcon;
  const label = backLabel ?? (isClose ? "닫기" : "뒤로 가기");
  return (
    <header className={className ? `header ${className}` : "header"}>
      <button
        type="button"
        className="header__back"
        aria-label={label}
        onClick={onBack}
      >
        <img className="header__back-icon" src={icon} alt="" />
      </button>
    </header>
  );
}
