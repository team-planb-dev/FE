import "./TypeTag.css";

import removeIcon from "../../assets/icn_close.svg";

type TypeTagProps = {
  label: string;
  onRemove: () => void;
};

/** 장소 분류 태그 */
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
