import { useState } from "react";

import "./Input.css";

import eyeIcon from "../../assets/icn_eye.svg";
import clearIcon from "../../assets/icn_close.svg";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  clearable?: boolean;
  /** 상태 테두리 — negative: 오류(237:5713) / positive: 사용 가능 */
  status?: "negative" | "positive";
};

/**
 * Figma: Input_password (88:580 / 237:5670)
 * 기본 테두리 1px, focus 시 1.5px Brand/Solid.
 * 디자인 주석: 마스킹이 기본 상태이고, 눈 아이콘을 누르면 해제됩니다.
 *
 * TODO(asset): 마스킹 해제 상태의 "뜬 눈" 아이콘(Figma 120:1110)이 아직 없어
 * 두 상태 모두 icn_eye.svg 를 씁니다. icn_eye_on.svg 가 추가되면
 * 아래 eyeIcon 자리를 visible ? eyeOnIcon : eyeIcon 으로만 바꾸면 됩니다.
 */
export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  clearable = true,
  status,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const showClear = clearable && focused && value.length > 0;

  return (
    <div className={`input input--password${status ? ` input--${status}` : ""}`}>
      <input
        id={id}
        className="input__control"
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* icn_eye (148:769) */}
      <button
        type="button"
        className="input__icon-btn"
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
        aria-pressed={visible}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setVisible((v) => !v)}
      >
        <img className="input__icon" src={eyeIcon} alt="" />
      </button>

      {/* icn_empty_s / Variant8 (119:784) */}
      {showClear && (
        <button
          type="button"
          className="input__icon-btn"
          aria-label="입력 지우기"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange("")}
        >
          <img className="input__icon" src={clearIcon} alt="" />
        </button>
      )}
    </div>
  );
}
