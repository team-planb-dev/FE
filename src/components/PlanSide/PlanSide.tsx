import "./PlanSide.css";

/** 일정 카드 사이의 복약체크 · 이동시간 */
export type PlanGap = {
  id: string;
  label: string;
  parts: string[];
};

export default function PlanSide({ gap }: { gap: PlanGap }) {
  return (
    <div className="plan-side">
      <span className="plan-side__line" aria-hidden="true" />
      <div className="plan-side__texts">
        <p className="plan-side__label">{gap.label}</p>
        <p className="plan-side__value">
          {gap.parts.map((part, i) => (
            <span key={`${gap.id}-${String(i)}`}>{part}</span>
          ))}
        </p>
      </div>
    </div>
  );
}
