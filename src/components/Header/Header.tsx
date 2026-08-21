import "./Header.css";

import backIcon from "../../assets/icn_empty_s.svg";

type HeaderProps = {
  /** 페이지에서 위치를 잡을 때 쓰는 추가 클래스 */
  className?: string;
  onBack?: () => void;
  backLabel?: string;
};

/** Figma: Header (19:831) — 390×54, padding 15/20 */
export default function Header({
  className,
  onBack,
  backLabel = "뒤로 가기",
}: HeaderProps) {
  return (
    <header className={className ? `header ${className}` : "header"}>
      <button
        type="button"
        className="header__back"
        aria-label={backLabel}
        onClick={onBack}
      >
        <img className="header__back-icon" src={backIcon} alt="" />
      </button>
    </header>
  );
}
