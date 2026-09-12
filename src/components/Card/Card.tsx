import "./Card.css";

import Tag from "../Tag/Tag";
import {
  onThumbnailError,
  thumbnailSrc,
  type ThumbnailKind,
} from "../common/defaultThumbnail";

type CardProps = {
  title: string;
  theme?: string;
  /** 일정의 첫 번째 장소 썸네일 */
  thumbnail?: string;
  thumbnailKind?: ThumbnailKind;
  onClick?: () => void;
  className?: string;
};

/** 홈 화면 여행 카드 */
export default function Card({
  title,
  theme,
  thumbnail,
  thumbnailKind = "place",
  onClick,
  className,
}: CardProps) {
  return (
    <article className={`card${className ? ` ${className}` : ""}`}>
      <button type="button" className="card__button" onClick={onClick}>
        <div className="card__thumbnail">
          <img
            className="card__thumbnail-image"
            src={thumbnailSrc(thumbnail, thumbnailKind, "wide")}
            onError={onThumbnailError(thumbnailKind, "wide")}
            alt=""
          />
        </div>

        <div className="card__body">
          <div className="card__row">
            <h3 className="card__title">{title}</h3>
          </div>
          {theme && <Tag>{theme}</Tag>}
        </div>
      </button>
    </article>
  );
}
