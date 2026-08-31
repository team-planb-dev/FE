import "./Card.css";

import Tag from "../Tag/Tag";

/**
 * Figma: Card (237:7433 / 87:3891+87:3892) — 280×247
 *  · 썸네일 280×160
 *  · 본문 280×87 (padding 16, 제목 24 + gap 8 + 태그 23)
 *
 * ⚠ 우측 상단 "더보기 >"(393:9173, 51×20)는 피그마에서 숨김 처리되어 있습니다.
 *   노출 조건이 정해지면 showMore 를 켜면 됩니다.
 */
type CardProps = {
  title: string;
  /** 여행 테마 — Tag (393:9377) */
  theme?: string;
  /** 썸네일 URL. 없으면 회색 자리만 표시합니다. */
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
};

export default function Card({
  title,
  theme,
  thumbnail,
  onClick,
  className,
}: CardProps) {
  return (
    <article className={`card${className ? ` ${className}` : ""}`}>
      <button type="button" className="card__button" onClick={onClick}>
        {/* Frame 140 (87:3891) — 280×160 */}
        <div className="card__thumbnail">
          {thumbnail && (
            <img className="card__thumbnail-image" src={thumbnail} alt="" />
          )}
        </div>

        {/* Frame 139 (87:3892) — 280×87 */}
        <div className="card__body">
          <div className="card__row">
            <h3 className="card__title">{title}</h3>
            {/* TODO(design): 숨김 처리된 "더보기 >" 자리 (393:9173) */}
          </div>
          {theme && <Tag>{theme}</Tag>}
        </div>
      </button>
    </article>
  );
}
