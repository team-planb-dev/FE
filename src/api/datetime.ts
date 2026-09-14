/*
 * 서버 날짜·시각을 화면 문자열로 바꿉니다.
 */

import type { RawDate, RawTime } from "./schema";

export type DateParts = { year: number; month: number; day: number };
export type TimeParts = { hour: number; minute: number };

/* ──────────────────────────── 파싱 ──────────────────────────── */

export function parseDate(value: RawDate | null | undefined): DateParts | null {
  if (value == null) return null;

  if (Array.isArray(value)) {
    const [year, month, day] = value;
    return isNum(year) && isNum(month) && isNum(day)
      ? { year, month, day }
      : null;
  }

  // "2026-09-16" · "2026-09-16T00:00:00" 모두 앞 10자만 씁니다
  const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!matched) return null;

  return {
    year: Number(matched[1]),
    month: Number(matched[2]),
    day: Number(matched[3]),
  };
}

export function parseTime(value: RawTime | null | undefined): TimeParts | null {
  if (value == null) return null;

  if (Array.isArray(value)) {
    const [hour, minute] = value;
    return isNum(hour) && isNum(minute) ? { hour, minute } : null;
  }

  // "10:00" · "10:00:00" · "2026-09-16T10:00:00" 모두 받습니다
  const matched = /(\d{1,2}):(\d{2})/.exec(value.trim());
  if (!matched) return null;

  return { hour: Number(matched[1]), minute: Number(matched[2]) };
}

/* ──────────────────────────── 표시 ──────────────────────────── */

/** [2026, 9, 16] → "2026.09.16" */
export function formatDate(value: RawDate | null | undefined): string {
  const parsed = parseDate(value);
  if (!parsed) return "";
  return `${parsed.year}.${pad(parsed.month)}.${pad(parsed.day)}`;
}

/** [2026, 9, 16] → "9월 16일" */
export function formatMonthDay(value: RawDate | null | undefined): string {
  const parsed = parseDate(value);
  if (!parsed) return "";
  return `${parsed.month}월 ${parsed.day}일`;
}

/** 요일 한 글자. [2026, 9, 16] → "수" */
export function formatWeekday(value: RawDate | null | undefined): string {
  const parsed = parseDate(value);
  if (!parsed) return "";
  const date = new Date(parsed.year, parsed.month - 1, parsed.day);
  return WEEKDAYS[date.getDay()];
}

/** [10, 0] → "AM 10:00" */
export function formatTime(value: RawTime | null | undefined): string {
  const parsed = parseTime(value);
  if (!parsed) return "";
  return `${meridiem(parsed.hour)} ${hour12(parsed.hour)}:${pad(parsed.minute)}`;
}

/**
 * [10,0] · [11,30] → "AM 10:00 - 11:30"
 * 오전·오후가 바뀌면 뒤쪽에도 붙입니다.
 */
export function formatTimeRange(
  start: RawTime | null | undefined,
  end: RawTime | null | undefined,
): string {
  const from = parseTime(start);
  if (!from) return "";

  const to = parseTime(end);
  if (!to) return formatTime(start);

  const tail =
    meridiem(from.hour) === meridiem(to.hour)
      ? `${hour12(to.hour)}:${pad(to.minute)}`
      : formatTime(end);

  return `${formatTime(start)} - ${tail}`;
}

/** 정렬용. 시각이 없으면 맨 뒤로 보냅니다 */
export function minutesOf(value: RawTime | null | undefined): number {
  const parsed = parseTime(value);
  if (!parsed) return Number.MAX_SAFE_INTEGER;
  return parsed.hour * 60 + parsed.minute;
}

/* ──────────────────────── 요청 값 만들기 ──────────────────────── */

/** 서버로 보낼 "2026-09-16" */
export function toRequestDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * 화면의 AM/PM 셀렉트를 서버가 쓰는 24시간 "08:00" 으로 바꿉니다.
 * 값이 하나라도 비어 있으면 null 을 돌려줍니다.
 */
export function toRequestTime(
  meridiemLabel: string,
  hour: string,
  minute: string,
): string | null {
  if (!meridiemLabel || !hour || !minute) return null;

  const rawHour = Number(hour);
  const rawMinute = Number(minute);
  if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) return null;

  const isPm = meridiemLabel.toUpperCase() === "PM" || meridiemLabel === "오후";
  let hour24 = rawHour % 12;
  if (isPm) hour24 += 12;

  return `${pad(hour24)}:${pad(rawMinute)}`;
}

/** "13:30" → { meridiem: "PM", hour: "01", minute: "30" }. 화면 셀렉트에 되돌릴 때 씁니다 */
export function fromRequestTime(value: RawTime | null | undefined): {
  meridiem: string;
  hour: string;
  minute: string;
} {
  const parsed = parseTime(value);
  if (!parsed) return { meridiem: "", hour: "", minute: "" };

  return {
    meridiem: meridiem(parsed.hour),
    hour: pad(hour12(parsed.hour)),
    minute: pad(parsed.minute),
  };
}

/* ──────────────────────────── 내부 ──────────────────────────── */

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function isNum(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
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
