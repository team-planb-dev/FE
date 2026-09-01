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
  status?: "negative" | "positive";
};

/** 비밀번호 입력 */
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
