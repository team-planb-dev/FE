import type { ReactNode } from "react";

import "./Snackbar.css";

import alertIcon from "../../assets/icn_24.svg";

type SnackbarProps = {
  /** 페이지에서 위치를 잡을 때 쓰는 추가 클래스 */
  className?: string;
  children: ReactNode;
};

/** Figma: Snackbar (237:5770) — h54, r10, bg #262626, padding 15/16, gap 8 */
export default function Snackbar({ className, children }: SnackbarProps) {
  return (
    <div
      className={className ? `snackbar ${className}` : "snackbar"}
      role="status"
      aria-live="polite"
    >
      {/* icn_24 / Default (204:2503) — 24×24 */}
      <img className="snackbar__icon" src={alertIcon} alt="" />
      <p className="snackbar__text">{children}</p>
    </div>
  );
}
