import type { ApiDate, ApiTime } from "./planTypes";

/** [2026, 9, 9] → "2026.09.09" */
export function formatDate(date: ApiDate | null): string {
  if (!date) return "";
  const [year, month, day] = date;
  return `${year}.${pad(month)}.${pad(day)}`;
}

/** [10, 0] → "AM 10:00" */
export function formatTime(time: ApiTime | null): string {
  if (!time) return "";
  const [hour, minute] = time;
  return `${meridiem(hour)} ${hour12(hour)}:${pad(minute)}`;
}

/** [10,0] · [11,30] → "AM 10:00 - 11:30". 오전·오후가 바뀌면 뒤에도 붙입니다 */
export function formatTimeRange(
  start: ApiTime | null,
  end: ApiTime | null,
): string {
  if (!start) return "";
  if (!end) return formatTime(start);

  const sameMeridiem = meridiem(start[0]) === meridiem(end[0]);
  const tail = sameMeridiem
    ? `${hour12(end[0])}:${pad(end[1])}`
    : formatTime(end);

  return `${formatTime(start)} - ${tail}`;
}

/** 정렬용. 시각이 없으면 맨 뒤로 보냅니다 */
export function minutesOf(time: ApiTime | null): number {
  if (!time) return Number.MAX_SAFE_INTEGER;
  return time[0] * 60 + time[1];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function meridiem(hour: number) {
  return hour < 12 ? "AM" : "PM";
}

function hour12(hour: number) {
  const h = hour % 12;
  return h === 0 ? 12 : h;
}
