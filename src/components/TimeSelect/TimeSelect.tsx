import "./TimeSelect.css";

import Select from "../Select/Select";

export type TimeValue = { meridiem: string; hour: string; minute: string };

type TimeSelectProps = {
  /** 셀렉트 3개의 id 접두사 */
  idPrefix: string;
  value: TimeValue;
  onChange: (value: TimeValue) => void;
};

/** 오전/오후 · 시 · 분 선택지 — 디자인에 목록이 없어 일반적인 값으로 채웠습니다. */
export const MERIDIEMS = ["AM", "PM"] as const;
export const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
export const MINUTES = ["00", "10", "20", "30", "40", "50"];

/**
 * Figma: Component 1 ×3 + 콜론 (237:6742 복약 시간 / 237:6931 식사시간)
 * 84 + 10 + 79 + 10 + 2 + 10 + 79 = 274
 *
 * [6-6] 2단계 복약 시간과 3단계 식사시간이 같은 모양이라 컴포넌트로 뺐습니다.
 */
export default function TimeSelect({
  idPrefix,
  value,
  onChange,
}: TimeSelectProps) {
  return (
    <div className="time-select">
      <div className="time-select__meridiem">
        <Select
          id={`${idPrefix}-meridiem`}
          value={value.meridiem}
          onChange={(v) => onChange({ ...value, meridiem: v })}
          options={MERIDIEMS}
          placeholder="AM"
        />
      </div>
      <div className="time-select__unit">
        <Select
          id={`${idPrefix}-hour`}
          value={value.hour}
          onChange={(v) => onChange({ ...value, hour: v })}
          options={HOURS}
          placeholder="00"
        />
      </div>
      {/* 237:6745 / 237:6934 — 2×14, 위아래 2px 점 두 개 */}
      <span className="time-select__colon" aria-hidden="true" />
      <div className="time-select__unit">
        <Select
          id={`${idPrefix}-minute`}
          value={value.minute}
          onChange={(v) => onChange({ ...value, minute: v })}
          options={MINUTES}
          placeholder="00"
        />
      </div>
    </div>
  );
}
