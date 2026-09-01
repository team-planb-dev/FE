import "./BtnWithIcon.css";

/**
 * "s" → Btn_withicn (187:1170 수정 / 187:1172 삭제)
 *        h32, 아이콘 20, 라벨 neutral-500
 * "m" → Btn_withicn (393:10989 / 393:10990 / 393:10991)
 *        h40, 아이콘 24, 라벨 Brand/pressed — [9-1] "이런 요청을 할 수 있어요"
 */
type BtnWithIconSize = "s" | "m";

type BtnWithIconProps = {
  /** "s" 는 20×20, "m" 은 24×24. 에셋이 없으면 자리만 잡습니다 */
  icon?: string;
  label: string;
  size?: BtnWithIconSize;
  onClick?: () => void;
};

/**
 * Figma: Btn_withicn
 * r10, padding 12, gap 4, 테두리 1px neutral-100, 배경 흰색.
 * 두 크기는 높이·아이콘 크기·라벨 색만 다릅니다.
 */
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
        /* TODO(asset): 아이콘 에셋이 없을 때는 자리만 잡습니다 */
        <span className="btn-with-icon__icon" aria-hidden="true" />
      )}
      <span className="btn-with-icon__label">{label}</span>
    </button>
  );
}
