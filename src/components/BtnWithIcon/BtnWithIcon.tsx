import "./BtnWithIcon.css";

type BtnWithIconSize = "s" | "m";

type BtnWithIconProps = {
  icon?: string;
  label: string;
  size?: BtnWithIconSize;
  onClick?: () => void;
};

/** 아이콘 + 라벨 버튼 */
export default function BtnWithIcon({
  icon,
  label,
  size = "s",
  onClick,
}: BtnWithIconProps) {
  return (
    <button
      type="button"
      className={`btn-with-icon btn-with-icon--${size}`}
      onClick={onClick}
    >
      {icon ? (
        <img
          className="btn-with-icon__icon"
          src={icon}
          alt=""
          aria-hidden="true"
        />
      ) : (
        <span className="btn-with-icon__icon" aria-hidden="true" />
      )}
      <span className="btn-with-icon__label">{label}</span>
    </button>
  );
}
