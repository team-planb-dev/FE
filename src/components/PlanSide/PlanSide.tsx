import "./PlanSide.css";

export type PlanGap = {
  id: string;
  /** "복약체크" · "이동시간" */
  label: string;
  /** 값 조각들. 이동시간은 ["{00}분", "·", "걷기 부담 낮음"] 처럼 옵니다 */
  parts: string[];
};

/**
 * Figma: side — [8-1] 카드 사이 블록 (높이 64)
 *  Default (344:10648) 복약체크 · Variant2 (344:10667) 이동시간
 *
 * 개발 노트 3 — 구성원에서 복약시간 고려를 선택한 경우 지정시간 또는
 * 식전/식후로 복약 시간을 배치합니다.
 */
export default function PlanSide({ gap }: { gap: PlanGap }) {
  return (
    <div className="plan-side">
      <span className="plan-side__line" aria-hidden="true" />
      <div className="plan-side__texts">
        <p className="plan-side__label">{gap.label}</p>
        <p className="plan-side__value">
          {/* 값 조각은 순서가 곧 의미라 위치를 키로 씁니다 */}
          {gap.parts.map((part, i) => (
            <span key={`${gap.id}-${String(i)}`}>{part}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
