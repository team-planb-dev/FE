import "./Checkbox.css";

import uncheckedIcon from "../../assets/icn_checkbox.svg";
import checkedIcon from "../../assets/icn_checkbox_checked.svg";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/**
 * Figma: Checkbox — 20×20, r4
 *  - Default  (73:804) 배경 neutral-100, 체크 회색
 *  - Variant2 (73:806) 배경 Brand/Solid, 체크 흰색
 * 배경과 체크 색이 함께 바뀌어 20×20 아이콘 두 벌을 그대로 사용합니다.
 */
export default function Checkbox({ id, checked, onChange }: CheckboxProps) {
  return (
    <span className="checkbox">
      <input
        id={id}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <img
        className="checkbox__icon"
        src={checked ? checkedIcon : uncheckedIcon}
        alt=""
        aria-hidden="true"
      />
    </span>
  );
}
