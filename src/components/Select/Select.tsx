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

/** 드롭다운 선택 */
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
