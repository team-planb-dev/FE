import "./Avatar.css";

import avatarIcon from "../../assets/avatar.svg";

type AvatarProps = {
  className?: string;
};

/** AI 캐릭터 아바타 60×60 */
export default function Avatar({ className }: AvatarProps) {
  return (
    <img
      className={`avatar${className ? ` ${className}` : ""}`}
      src={avatarIcon}
      alt=""
      aria-hidden="true"
    />
  );
}
