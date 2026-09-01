import "./DatePicker.css";

import { toDateKey } from "./dateKey";
import arrowIcon from "../../assets/icn_empty_s.svg";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type DatePickerProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: string[];
  onSelect: (dateKey: string) => void;
};

/** 달력. 시작일과 박수로 구간을 칠합니다 */
export default function DatePicker({
  month,
  onMonthChange,
  selected,
  onSelect,
}: DatePickerProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const first = new Date(year, monthIndex, 1);
  const gridStart = new Date(year, monthIndex, 1 - first.getDay());

  const last = new Date(year, monthIndex + 1, 0);
  const rowCount = Math.ceil((first.getDay() + last.getDate()) / 7);

  const rows = Array.from({ length: rowCount }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + r * 7 + c,
      );
      return date;
    }),
  );

  const shiftMonth = (delta: number) =>
    onMonthChange(new Date(year, monthIndex + delta, 1));

  return (
    <div className="date-picker">
      <div className="date-picker__header">
        <button
          type="button"
          className="date-picker__nav"
          aria-label="이전 달"
          onClick={() => shiftMonth(-1)}
        >

          <img className="date-picker__nav-icon" src={arrowIcon} alt="" />
        </button>

        <p className="date-picker__month">{`${MONTHS[monthIndex]} ${year}`}</p>
        <button
          type="button"
          className="date-picker__nav"
          aria-label="다음 달"
          onClick={() => shiftMonth(1)}
        >

          <img
            className="date-picker__nav-icon"
            src={arrowIcon}
            alt=""
            style={{ transform: "rotate(180deg)" }}
          />
        </button>
      </div>

      <div className="date-picker__grid">
        <div className="date-picker__row">
          {WEEKDAYS.map((w) => (
            <div className="date-picker__weekday" key={w}>
              {w}
            </div>
          ))}
        </div>

        {rows.map((week) => (
          <div className="date-picker__row" key={toDateKey(week[0])}>
            {week.map((date) => {
              const key = toDateKey(date);
              const outside = date.getMonth() !== monthIndex;
              const on = selected.includes(key);

              return (
                <button
                  type="button"
                  key={key}
                  className={`date-picker__day${outside ? " date-picker__day--outside" : ""}${
                    on ? " date-picker__day--on" : ""
                  }`}
                  disabled={outside}
                  aria-pressed={on}
                  onClick={() => onSelect(key)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
