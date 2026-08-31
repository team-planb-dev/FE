import "./Avatar.css";

type AvatarProps = {
  /** 60×60 이미지. 없으면 자리만 잡는 임시 도형을 그립니다 */
  src?: string;
  className?: string;
};

/**
 * Figma: Avatar / Variant2 (87:3241) — 60×60. [7-10] 로딩 화면에서 씁니다.
 *
 * TODO(asset): 원본 그림을 받으면 `src` 로 넘겨주세요.
 *   Figma 애셋 URL 이 막혀 있어 임시 도형으로 자리만 잡아뒀습니다.
 */
export default function Avatar({ src, className }: AvatarProps) {
  const rootClass = `avatar${src ? "" : " avatar--placeholder"}${
    className ? ` ${className}` : ""
  }`;

  if (src) {
    return <img className={rootClass} src={src} alt="" aria-hidden="true" />;
  }

  return <span className={rootClass} aria-hidden="true" />;
}
