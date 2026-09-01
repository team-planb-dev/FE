import "./TimeSelect.css";

import Select from "../Select/Select";

/** 오전·오후 / 시 / 분 선택 */
export type TimeValue = { meridiem: string; hour: string; minute: string };

type TimeSelectProps = {
  idPrefix: string;
  value: TimeValue;
  onChange: (value: TimeValue) => void;
};

const MERIDIEMS = ["AM", "PM"] as const;
const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);
const MINUTES = ["00", "10", "20", "30", "40", "50"];

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
