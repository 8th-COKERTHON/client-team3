const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

// ISO 날짜를 "5분", "1시간", "3일 전"과 같은 상대 시간 문자열로 변환
export function formatRelativeTime(isoDate: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(isoDate).getTime());

  if (diffMs < MINUTE_MS) return "방금 전";
  if (diffMs < HOUR_MS) return `${Math.floor(diffMs / MINUTE_MS)}분`;
  if (diffMs < DAY_MS) return `${Math.floor(diffMs / HOUR_MS)}시간`;
  if (diffMs < WEEK_MS) return `${Math.floor(diffMs / DAY_MS)}일 전`;
  if (diffMs < MONTH_MS) return `${Math.floor(diffMs / WEEK_MS)}주 전`;
  if (diffMs < YEAR_MS) return `${Math.floor(diffMs / MONTH_MS)}개월 전`;
  return `${Math.floor(diffMs / YEAR_MS)}년 전`;
}
