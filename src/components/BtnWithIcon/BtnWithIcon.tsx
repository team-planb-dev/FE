import "./BtnWithIcon.css";

type BtnWithIconProps = {
  /** 20×20 아이콘 */
  icon: string;
  label: string;
  onClick?: () => void;
};

/**
 * Figma: Btn_withicn (187:1170 수정 / 187:1172 삭제)
 * h32, r10, padding 8/12, gap 4, 테두리 1px neutral-100, 배경 흰색,
 * 라벨 12px Medium / 1.3 / -0.12px / neutral-500.
 *
 * 두 variant 는 아이콘만 다릅니다.
 */
export default function BtnWithIcon({ icon, label, onClick }: BtnWithIconProps) {
  return (
    <button type="button" className="btn-with-icon" onClick={onClick}>
      <img className="btn-with-icon__icon" src={icon} alt="" aria-hidden="true" />
      <span className="btn-with-icon__label">{label}</span>
    </button>
  );
}
