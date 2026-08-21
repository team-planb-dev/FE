import type { ReactNode } from "react";

import "./Field.css";

/**
 * 라벨 행 + 컨트롤 + 보조 텍스트 묶음.
 * 피그마에 여백이 다른 프레임이 여러 벌 존재해 spacing으로 구분합니다.
 *  - "default" : Frame 132 (88:579+88:580)      padding 8/0, gap 8  ← 로그인, 복구질문, 답변
 *  - "no-gap"  : Frame 152 / Frame 154 (206:4615) padding 8/0, gap 0  ← 비밀번호, 비밀번호 확인
 *  - "none"    : Frame 155 / Frame 154 (206:3495) padding 0,   gap 0  ← 닉네임, 이메일
 */
type FieldSpacing = "default" | "no-gap" | "none";

type FieldProps = {
  label: string;
  htmlFor: string;
  /** 라벨 뒤에 필수 표시(*) — Figma Frame 130 / Variant2 (182:1429) */
  required?: boolean;
  /** 인풋 아래 보조 텍스트 영역 — Figma subtext_field (206:3513 / 206:4610) */
  subtext?: ReactNode;
  /** subtext가 비어 있어도 높이 33px을 유지할지 (닉네임·이메일은 유지) */
  reserveSubtext?: boolean;
  /** subtext 색 — negative #FA5852 (237:5909) / positive #3A9675 (237:5923) */
  subtextTone?: "default" | "negative" | "positive";
  spacing?: FieldSpacing;
  children: ReactNode;
};

export default function Field({
  label,
  htmlFor,
  required = false,
  subtext,
  reserveSubtext = false,
  subtextTone = "default",
  spacing = "default",
  children,
}: FieldProps) {
  return (
    <div className={`field field--${spacing}`}>
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
