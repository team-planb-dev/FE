import "./Avatar.css";

import avatarIcon from "../../assets/avatar.svg";

type AvatarProps = {
  className?: string;
};

/**
 * Figma: Avatar / Variant2 (87:3241) — 60×60
 * [7-10] AI 일정 생성 중 · [9-1] AI 수정에서 씁니다.
 */
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
