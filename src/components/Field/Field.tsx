import type { ReactNode } from "react";

import "./Field.css";

type FieldProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
};

/** Figma: Frame 132 (88:579 라벨 + 88:580 인풋) — 342×114, padding 8/0, gap 8 */
export default function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="field">
      <div className="field__label-row">
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
      </div>
      {children}
    </div>
  );
}
