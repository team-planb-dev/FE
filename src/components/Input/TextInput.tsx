import { useState } from "react";

import "./Input.css";

import clearIcon from "../../assets/icn_close.svg";

type TextInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  /** 포커스 상태에서 값이 있을 때 오른쪽에 지우기(x) 버튼 노출 — Figma 237:5649 */
  clearable?: boolean;
  /** 상태 테두리 — negative: 오류(237:5711, 237:5909) / positive: 사용 가능(237:5923) */
  status?: "negative" | "positive";
  /** 인풋 왼쪽 아이콘 (20x20) — Figma Input 206:3496 의 돋보기 */
  leadingIcon?: string;
  /** 페이지에서 폭을 잡을 때 쓰는 추가 클래스 */
  className?: string;
};

/** Figma: Input (88:580) — h54, 테두리 1.5px, focus 시 Brand/Solid */
export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  clearable = true,
  status,
  leadingIcon,
  className,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  // 237:5645(포커스+입력중)에만 x 버튼이 있고
  // 237:5660(값은 있지만 포커스 해제)에는 없습니다.
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {showClear && (
        <button
          type="button"
          className="input__icon-btn"
          aria-label="입력 지우기"
          onMouseDown={(e) => e.preventDefault()} /* 클릭해도 포커스 유지 */
          onClick={() => onChange("")}
        >
          <img className="input__icon" src={clearIcon} alt="" />
        </button>
      )}
    </div>
  );
}
