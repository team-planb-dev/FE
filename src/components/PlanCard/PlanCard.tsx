import "./PlanCard.css";

import chevronIcon from "../../assets/icn_chevron_down.svg";

/** 일정 타임라인의 장소 카드 */
export type PlanCardKind = "food" | "sight";

export type PlanStop = {
  id: string;
  kind: PlanCardKind;
  name: string;
  time: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  recommendedMenu?: string;
};

type PlanCardProps = {
  stop: PlanStop;
  onDetail?: () => void;
};

export default function PlanCard({ stop, onDetail }: PlanCardProps) {
  return (
    <div className={`plan-card plan-card--${stop.kind}`}>
      <div className="plan-card__title">
        <span className="plan-card__dot" aria-hidden="true" />
        <span className="plan-card__title-texts">
          <span className="plan-card__title-name">{stop.name}</span>
          <span className="plan-card__title-time">{stop.time}</span>
        </span>

        <span className="plan-card__toggle-icon" aria-hidden="true">
          <img src={chevronIcon} alt="" />
        </span>
      </div>

      <div className="plan-card__body">
        <span className="plan-card__line" aria-hidden="true" />
        <div className="plan-card__plan">
          <div className="plan-card__row">
            <img
              className="plan-card__thumb"
              src={stop.thumbnail}
              alt=""
              aria-hidden="true"
            />

            <div className="plan-card__info">
              <div className="plan-card__names">
                <div className="plan-card__name-row">
                  <p className="plan-card__name">{stop.name}</p>
                  {onDetail && (
                    <button
                      type="button"
                      className="plan-card__more"
                      onClick={onDetail}
                    >
                      <span className="plan-card__more-text">상세 보기</span>
                      <span className="plan-card__more-icon" aria-hidden="true">
                        <img src={chevronIcon} alt="" />
                      </span>
                    </button>
                  )}
                </div>
                <p className="plan-card__category">{stop.category}</p>
              </div>

              <div className="plan-card__tags">
                {stop.tags.map((tag) => (
                  <span className="plan-card__tag" key={tag}>
                    {tag}
                  </span>
                ))}
                <span className="plan-card__tags-fade" aria-hidden="true" />
              </div>
            </div>
          </div>

          {stop.recommendedMenu && (
            <div className="plan-card__recommend">
              <span>추천메뉴</span>
              <span
                className="plan-card__recommend-divider"
                aria-hidden="true"
              />
              <span>{stop.recommendedMenu}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
