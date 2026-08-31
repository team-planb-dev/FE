/**
 * 로컬 날짜를 YYYY-MM-DD 로 바꿉니다.
 * `toISOString()` 은 UTC 로 변환해 한국 시간 기준으로 하루가 어긋나므로 쓰지 않습니다.
 *
 * (컴포넌트 파일에서 함께 export 하면 react-refresh 규칙에 걸려 파일을 나눴습니다 —
 *  memberFormContext.ts 와 같은 이유입니다.)
 */
export function toDateKey(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}
