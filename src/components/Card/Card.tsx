import "./Card.css";

import Tag from "../Tag/Tag";

type CardProps = {
  title: string;
  theme?: string;
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
};

/** 홈 화면 여행 카드 */
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
        <div className="card__thumbnail">
          {thumbnail && (
            <img className="card__thumbnail-image" src={thumbnail} alt="" />
          )}
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
