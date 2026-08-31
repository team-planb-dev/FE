import "./PlanCard.css";

import chevronIcon from "../../assets/icn_chevron_down.svg";

/** 카테고리에 따라 점·선·태그 색이 달라집니다 */
export type PlanCardKind = "food" | "sight";

export type PlanStop = {
  id: string;
  kind: PlanCardKind;
  name: string;
  /** "AM 8:00 - 9:00" */
  time: string;
  /** "식당" · "관광지" */
  category: string;
  /** 개발 노트 2 — 태그는 3개까지, 넘치면 가로 스크롤 */
  tags: string[];
  thumbnail?: string;
  /** 개발 노트 — 식당 카드에서 1개까지만 */
  recommendedMenu?: string;
};

type PlanCardProps = {
  stop: PlanStop;
  /** 식당 카드의 `상세 보기` — [8-2]로 갑니다 */
  onDetail?: () => void;
};

/**
 * Figma: card — [8-1] 일정 타임라인의 장소 카드
 *  Variant3 (344:11149) 식당 · Variant2 (344:10686) 관광지
 *
 * ⚠ 제목의 20×20 아이콘(`217:2257`)과 `상세 보기` 의 16×16 아이콘 에셋이 없어
 *   기존 셰브론(12×7)을 돌려 쓰고 있습니다.
 * ⚠ 제목 아이콘이 접기/펴기인지 다른 동작인지 디자인에 없습니다 —
 *   펼쳐진 상태만 그려져 있어 지금은 표시만 하고 동작을 넣지 않았습니다.
 */
export default function PlanCard({ stop, onDetail }: PlanCardProps) {
  return (
    <div className={`plan-card plan-card--${stop.kind}`}>
      {/* title (344:10491 / 344:10513) */}
      <div className="plan-card__title">
        <span className="plan-card__dot" aria-hidden="true" />
        <span className="plan-card__title-texts">
          <span className="plan-card__title-name">{stop.name}</span>
          <span className="plan-card__title-time">{stop.time}</span>
        </span>
        {/* TODO(design): 이 아이콘의 동작이 정해지지 않았습니다. */}
        <span className="plan-card__toggle-icon" aria-hidden="true">
          <img src={chevronIcon} alt="" />
        </span>
      </div>

      {/* cardwithline (344:11151 / 344:10688) */}
      <div className="plan-card__body">
        <span className="plan-card__line" aria-hidden="true" />

        {/* card_plan (344:10471) */}
        <div className="plan-card__plan">
          <div className="plan-card__row">
            {/* thumbnail (344:10236) — TODO(api): 장소 이미지 */}
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

              {/* 344:11122 — 태그 줄 */}
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

          {/* 393:7798 — 추천메뉴 (식당만) */}
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
