import "./ChipsXL.css";

type ChipsXLProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
};

/** 아이콘이 큰 선택 칩 */
export default function ChipsXL({
  label,
  selected,
  onClick,
  icon,
}: ChipsXLProps) {
  return (
    <button
      type="button"
      className={`chips-xl${selected ? " chips-xl--on" : ""}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {icon ? (
        <img className="chips-xl__icon" src={icon} alt="" aria-hidden="true" />
      ) : (
        <span className="chips-xl__icon-placeholder" aria-hidden="true">
          아이콘
        </span>
      )}
      <span className="chips-xl__label">{label}</span>
    </button>
  );
}
