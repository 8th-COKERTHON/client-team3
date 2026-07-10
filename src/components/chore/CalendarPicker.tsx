// components/common/CalendarPicker.tsx
import { useState } from "react";

interface Props {
  value: string; // "2026-07-11"
  onChange: (date: string) => void;
  highlightedDates?: string[]; // 추가로 강조 표시할 날짜들 (반복 패턴 미리보기 등)
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year: number, month: number) {
  const day = new Date(year, month, 1).getDay(); // 0(일)~6(토)
  return (day + 6) % 7; // 월요일 시작으로 변환
}

export function CalendarPicker({
  value,
  onChange,
  highlightedDates = [],
}: Props) {
  const initial = value ? new Date(value) : new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth()); // 0-indexed

  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekday(year, month);
  const today = new Date();
  const isToday = (d: number) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    d === today.getDate();

  const formatDate = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const goPrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="w-full max-w-xs rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goPrevMonth}
          className="p-1 text-gray-400"
        >
          ‹
        </button>
        <span className="font-bold text-sm">
          {year}년 {month + 1}월
        </span>
        <button
          type="button"
          onClick={goNextMonth}
          className="p-1 text-gray-400"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEKDAYS.map((w, i) => (
          <span
            key={w}
            className={`text-xs ${i === 6 ? "text-rose-400" : "text-gray-400"}`}
          >
            {w}
          </span>
        ))}

        {cells.map((d, i) => {
          if (d === null) return <span key={`empty-${i}`} />;

          const dateStr = formatDate(d);
          const selected = value === dateStr;
          const todayFlag = isToday(d);
          const weekdayIdx = (firstWeekday + (d - 1)) % 7;
          const isSunday = weekdayIdx === 6;

          return (
            <button
              key={d}
              type="button"
              onClick={() => onChange(dateStr)}
              className={`w-8 h-8 mx-auto rounded-full text-sm flex items-center justify-center ${
                selected || todayFlag
                  ? "bg-rose-500 text-white font-medium"
                  : isSunday
                    ? "text-rose-400"
                    : "text-gray-700"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
