import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import "./Select.css";

import chevronIcon from "../../assets/icn_chevron_down.svg";

type SelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
};

/* 패널이 화면 밖으로 밀리지 않게 하는 값들 */
const PANEL_GAP = 8;
const PANEL_MARGIN = 16;
const PANEL_MAX = 272;
const PANEL_MIN = 120;

/** 드롭다운 선택 */
export default function Select({
  id,
  value,
  onChange,
  options,
  placeholder = "placeholder",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  /** 아래 공간이 모자라면 위로 펼칩니다 */
  const [up, setUp] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();
  const rootRef = useRef<HTMLDivElement>(null);

  /*
   * 열릴 때마다 트리거 위아래 공간을 재서 방향과 높이를 정합니다.
   * 화면 아래쪽에서 열면 패널이 잘려 마지막 항목을 못 고르기 때문입니다.
   *
   * visualViewport 를 쓰는 이유: iOS 사파리는 주소창·툴바가 화면을 덮는데
   * window.innerHeight 는 그 영역까지 포함해서 공간을 실제보다 넓게 봅니다
   */
  useLayoutEffect(() => {
    if (!open) return;

    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;

    const viewport = window.visualViewport;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const offsetTop = viewport?.offsetTop ?? 0;

    const below = viewportHeight - (rect.bottom - offsetTop) - PANEL_GAP - PANEL_MARGIN;
    const above = rect.top - offsetTop - PANEL_GAP - PANEL_MARGIN;

    const flip = below < Math.min(PANEL_MAX, above) && above > below;
    const room = flip ? above : below;

    setUp(flip);
    setPanelStyle({
      maxHeight: Math.max(PANEL_MIN, Math.min(PANEL_MAX, room)),
    });
  }, [open]);

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
        <ul
          className={`select__panel${up ? " select__panel--up" : ""}`}
          style={panelStyle}
          role="listbox"
          aria-labelledby={id}
        >
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
