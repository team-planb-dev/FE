import "./CompareCard.css";

import Tag from "../Tag/Tag";
import chevronIcon from "../../assets/icn_chevron_right.svg";

type CompareCardProps = {
  badge: string;
  title: string;
  theme: string;
  image?: string;
  onMore?: () => void;
};

const MORE_LABEL = "더보기";

/** 일정 수정 전후 비교 카드 */
export default function CompareCard({
  badge,
  title,
  theme,
  image,
  onMore,
}: CompareCardProps) {
  return (
    <div className="compare-card">
      <div className="compare-card__media">
        {image ? (
          <img className="compare-card__image" src={image} alt="" />
        ) : null}
        <span className="compare-card__badge">{badge}</span>
      </div>

      <div className="compare-card__body">
        <div className="compare-card__row">
          <p className="compare-card__title">{title}</p>
          <button
            type="button"
            className="compare-card__more"
            onClick={onMore}
          >
            <span className="compare-card__more-text">{MORE_LABEL}</span>
            <span className="compare-card__more-icon">
              <img src={chevronIcon} alt="" />
            </span>
          </button>
        </div>
        <Tag tone="purple">{theme}</Tag>
      </div>
    </div>
  );
}
