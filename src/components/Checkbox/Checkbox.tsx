import "./Checkbox.css";

import uncheckedIcon from "../../assets/icn_checkbox.svg";
import checkedIcon from "../../assets/icn_checkbox_checked.svg";

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** 체크박스 */
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
