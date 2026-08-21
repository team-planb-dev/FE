import { useEffect, useRef, useState } from "react";

import "./Select.css";

import chevronIcon from "../../assets/icn_chevron_down.svg";

type SelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
};

/**
 * Figma: Component 1 (120:1291 닫힘 / 217:3060 열림)
 *  - 트리거 h54, r8. 닫힘 테두리 1px neutral-200, 열림 1px Brand/Solid
 *  - 열리면 아래 8px 간격으로 그림자 패널(r10, padding 16/0, 항목 48px)
 *  - 패널은 레이아웃을 밀지 않는 오버레이 (피그마에서도 프레임 밖으로 넘침)
 * 네이티브 select로는 패널을 재현할 수 없어 커스텀 리스트박스로 구현했습니다.
 */
export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder = "placeholder",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        id={id}
        className={`select__trigger${open ? " select__trigger--open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={`select__value${value ? " select__value--filled" : ""}`}
        >
          {value || placeholder}
        </span>
        {/* icn_empty_s / chevron_down (120:1295) — 20×20, 열리면 180도 회전 */}
        <span className="select__icon">
          <img className="select__icon-glyph" src={chevronIcon} alt="" />
        </span>
      </button>

      {open && (
        <ul className="select__panel" role="listbox" aria-labelledby={id}>
          {options.map((option) => (
            <li key={option} role="option" aria-selected={option === value}>
              <button
                type="button"
                className={`select__option${
                  option === value ? " select__option--selected" : ""
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
