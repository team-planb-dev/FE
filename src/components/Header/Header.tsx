import "./Header.css";

import backIcon from "../../assets/icn_empty_s.svg";
import closeIcon from "../../assets/icn_close_line.svg";
import shareIcon from "../../assets/icn_share.svg";

type HeaderProps = {
  className?: string;
  onBack?: () => void;
  backLabel?: string;
  title?: string;
  action?: { label: string; onClick: () => void };
  variant?: "back" | "close" | "logo" | "empty" | "title";
};

/** 상단 헤더. back / close / logo / empty / title */
export default function Header({
  className,
  onBack,
  backLabel,
  title,
  action,
  variant = "back",
}: HeaderProps) {
  const rootClass = `header header--${variant}${className ? ` ${className}` : ""}`;

  if (variant === "logo") {
    return (
      <header className={rootClass}>
        <span className="header__logo">LOGO</span>
      </header>
    );
  }

  if (variant === "empty") {
    return <header className={rootClass} />;
  }

  if (variant === "title") {
    return (
      <header className={rootClass}>
        {onBack ? (
          <button
            type="button"
            className="header__back"
            aria-label={backLabel ?? "뒤로 가기"}
            onClick={onBack}
          >
            <img className="header__back-icon" src={backIcon} alt="" />
          </button>
        ) : (
          <span className="header__slot" aria-hidden="true" />
        )}
        <span className="header__title">{title}</span>
        {action ? (
          <button
            type="button"
            className="header__action"
            aria-label={action.label}
            onClick={action.onClick}
          >
            <img className="header__action-icon" src={shareIcon} alt="" />
          </button>
        ) : (
          <span className="header__slot" aria-hidden="true" />
        )}
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
