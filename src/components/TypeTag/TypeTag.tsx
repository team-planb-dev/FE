import "./TypeTag.css";

import removeIcon from "../../assets/icn_close.svg";

type TypeTagProps = {
  label: string;
  onRemove: () => void;
};

/**
 * Figma: Chips_XL/type tag (344:9740) — 90×28
 * 고른 항목을 인풋 아래에 붙여 보여주고 ⊗ 로 지웁니다. [7-5] 장소 선택에서 씁니다.
 *
 * 이름은 피그마의 `Chips_XL/type tag` 인데 Chips_XL(167×167)과는 전혀 다른
 * 컴포넌트라 `TypeTag` 로 따로 두었습니다.
 */
export default function TypeTag({ label, onRemove }: TypeTagProps) {
  return (
    <span className="type-tag">
      <span className="type-tag__label">{label}</span>
      <button
        type="button"
        className="type-tag__remove"
        aria-label={`${label} 지우기`}
        onClick={onRemove}
      >
        {/* icn_empty_s / Variant8 (119:784) */}
        <img
          className="type-tag__remove-icon"
          src={removeIcon}
          alt=""
          aria-hidden="true"
        />
      </button>
    </span>
  );
}
