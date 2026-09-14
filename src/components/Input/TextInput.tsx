import { useState } from "react";

import "./Input.css";

import clearIcon from "../../assets/icn_close.svg";

type TextInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Enter 를 눌렀을 때. 태그를 직접 추가하는 입력칸에서 씁니다 */
  onEnter?: () => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  clearable?: boolean;
  status?: "negative" | "positive";
  leadingIcon?: string;
  className?: string;
};

/** 텍스트 입력 */
export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  onEnter,
  type = "text",
  autoComplete,
  clearable = true,
  status,
  leadingIcon,
  className,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const showClear = clearable && focused && value.length > 0;

  return (
    <div
      className={`input input--text${status ? ` input--${status}` : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      {leadingIcon && (
        <img className="input__icon" src={leadingIcon} alt="" aria-hidden="true" />
      )}
      <input
        id={id}
        className="input__control"
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter" || !onEnter) return;
          e.preventDefault();
          onEnter();
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
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
