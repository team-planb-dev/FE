import "./Header.css";

import backIcon from "../../assets/icn_empty_s.svg";
import closeIcon from "../../assets/icn_close_line.svg";

type HeaderProps = {
  /** 페이지에서 위치를 잡을 때 쓰는 추가 클래스 */
  className?: string;
  onBack?: () => void;
  backLabel?: string;
  /** variant="title" 일 때 가운데에 놓을 문구 */
  title?: string;
  /**
   * Figma Header 변형
   *  "back"  : 19:831   (icn_empty_s / Variant2, ←)
   *  "close" : 87:3765  (icn_empty_s / Variant3, ×)
   *  "logo"  : 148:1834 (Variant4, 가운데 LOGO 텍스트 · 뒤로가기 없음)
   *  "empty" : 182:1622 (Variant5, 아이콘도 텍스트도 없는 빈 헤더)
   *  "title" : 237:7165 (가운데 타이틀 · 좌우는 빈 20×20 자리)
   */
  variant?: "back" | "close" | "logo" | "empty" | "title";
};

/** Figma: Header — 390×54, padding 15/20 */
export default function Header({
  className,
  onBack,
  backLabel,
  title,
  variant = "back",
}: HeaderProps) {
  const rootClass = `header header--${variant}${className ? ` ${className}` : ""}`;

  // Variant4 (148:1834) — 로고만 가운데 놓입니다.
  // TODO(asset): 로고 이미지가 나오면 이 텍스트를 <img>로 교체하세요.
  if (variant === "logo") {
    return (
      <header className={rootClass}>
        <span className="header__logo">LOGO</span>
      </header>
    );
  }

  // Variant5 (182:1622) — 빈 헤더. [6-6] 확정 화면처럼 되돌아갈 수 없는 곳에 씁니다.
  if (variant === "empty") {
    return <header className={rootClass} />;
  }

  // 237:7165 — 가운데 타이틀. 좌우의 20×20 은 icn_empty_s/Default(16:32)로
  // 아이콘이 비어 있습니다. 자리를 남겨야 타이틀이 가운데에 옵니다.
  if (variant === "title") {
    return (
      <header className={rootClass}>
        <span className="header__slot" aria-hidden="true" />
        <span className="header__title">{title}</span>
        <span className="header__slot" aria-hidden="true" />
      </header>
    );
  }

  const isClose = variant === "close";
  const icon = isClose ? closeIcon : backIcon;
  const label = backLabel ?? (isClose ? "닫기" : "뒤로 가기");

  return (
    <header className={rootClass}>
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
