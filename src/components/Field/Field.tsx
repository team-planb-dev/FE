import type { ReactNode } from "react";

import "./Field.css";

type FieldSpacing = "default" | "no-gap" | "none" | "gap";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  subtext?: ReactNode;
  reserveSubtext?: boolean;
  subtextTone?: "default" | "negative" | "positive";
  spacing?: FieldSpacing;
  className?: string;
  children: ReactNode;
};

/** 라벨 + 입력 + 보조 문구 묶음 */
export default function Field({
  label,
  htmlFor,
  required = false,
  subtext,
  reserveSubtext = false,
  subtextTone = "default",
  spacing = "default",
  className,
  children,
}: FieldProps) {
  return (
    <div
      className={`field field--${spacing}${className ? ` ${className}` : ""}`}
    >
      <div className="field__label-row">
        <label className="field__label" htmlFor={htmlFor}>
          {label}
        </label>
        {required && (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        )}
      </div>

      {children}

      {(subtext || reserveSubtext) && (
        <div className="field__subtext">
          {subtext && (
            <p className={`field__subtext-text field__subtext-text--${subtextTone}`}>
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
