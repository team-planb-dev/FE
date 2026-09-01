import type { ReactNode } from "react";

import "./Snackbar.css";

import alertIcon from "../../assets/icn_24.svg";

type SnackbarProps = {
  className?: string;
  withIcon?: boolean;
  children: ReactNode;
};

/** 화면 하단 알림 */
export default function Snackbar({
  className,
  withIcon = true,
  children,
}: SnackbarProps) {
  return (
    <div
      className={className ? `snackbar ${className}` : "snackbar"}
      role="status"
      aria-live="polite"
    >

      {withIcon && <img className="snackbar__icon" src={alertIcon} alt="" />}
      <p className="snackbar__text">{children}</p>
    </div>
  );
}
