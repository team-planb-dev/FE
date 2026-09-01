import "./CompareCard.css";

import Tag from "../Tag/Tag";
import chevronIcon from "../../assets/icn_chevron_right.svg";

type CompareCardProps = {
  /** 393:10464 — "Before" · "After" */
  badge: string;
  /** 393:10456 — 여행 제목 */
  title: string;
  /** 393:10460 — 여행 테마 */
  theme: string;
  /** 393:10452 — 대표 이미지. 없으면 회색 자리만 둡니다 */
  image?: string;
  onMore?: () => void;
};

/** 393:10458 */
const MORE_LABEL = "더보기";

/**
 * Figma: Card (393:10452 / 393:10453) — 240 × 247, r10
 *  위 160 은 사진 위에 Before/After 알약, 아래는 흰 카드(제목 + 더보기 + 태그)
 *
 * [9-2] 수정 전후를 나란히 보여줄 때 두 장을 씁니다.
 */
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
        {/* TODO(api): 대표 이미지. 디자인에도 자리표시자라 회색으로 둡니다. */}
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
            {/* icn_empty_s (393:10459) — 20×20 상자 안에 7×12 셰브론 */}
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
