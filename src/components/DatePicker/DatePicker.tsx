import "./DatePicker.css";

import { toDateKey } from "./dateKey";
import arrowIcon from "../../assets/icn_empty_s.svg";

/** 요일 머리글 — Figma 237:6365~6371 은 영어입니다(확인 필요 문서 참고). */
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** 237:6362 의 월 표기도 영어입니다 — "May 2025". */
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type DatePickerProps = {
  /** 화면에 보여줄 달 — 이 달의 1일이면 충분합니다 */
  month: Date;
  onMonthChange: (month: Date) => void;
  /** 선택된 날짜들(YYYY-MM-DD). 하루만 고르면 1개, 기간이면 여러 개입니다 */
  selected: string[];
  onSelect: (dateKey: string) => void;
};

/**
 * Figma: Date Picker (237:6361) — 343×326
 *
 * ⚠ 이 컴포넌트만 다른 디자인 시스템(Geist)에서 그대로 가져온 것으로 보입니다.
 *   글꼴·요일 표기·자간 규칙이 앱의 나머지와 다릅니다. 확인 필요 문서를 봐주세요.
 *
 * 표시할 달은 부모가 정합니다. 디자인의 "May 2025" 는 목업이라
 * 페이지에서는 오늘이 속한 달로 시작합니다.
 */
export default function DatePicker({
  month,
  onMonthChange,
  selected,
  onSelect,
}: DatePickerProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  // 이번 달 1일이 있는 주의 일요일부터 시작합니다.
  const first = new Date(year, monthIndex, 1);
  const gridStart = new Date(year, monthIndex, 1 - first.getDay());

  // 마지막 날이 있는 주의 토요일까지 — 달에 따라 4~6줄이 됩니다.
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
      {/* .Calendar / Header (237:6362) */}
      <div className="date-picker__header">
        <button
          type="button"
          className="date-picker__nav"
          aria-label="이전 달"
          onClick={() => shiftMonth(-1)}
        >
          {/* Icon / arrow-left (120:1492).
              에셋이 없어 헤더 뒤로가기 화살표를 16px로 줄여 씁니다. */}
          <img className="date-picker__nav-icon" src={arrowIcon} alt="" />
        </button>

        <p className="date-picker__month">{`${MONTHS[monthIndex]} ${year}`}</p>

        <button
          type="button"
          className="date-picker__nav"
          aria-label="다음 달"
          onClick={() => shiftMonth(1)}
        >
          {/* Icon / arrow-right (120:1885) — 같은 화살표를 뒤집었습니다. */}
          <img
            className="date-picker__nav-icon"
            src={arrowIcon}
            alt=""
            style={{ transform: "rotate(180deg)" }}
          />
        </button>
      </div>

      {/* Grid (237:6363) */}
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
