import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { chores, CATEGORY_BG_CLASS, CATEGORY_TEXT_CLASS, CATEGORY_TINT_CLASS, CATEGORY_LABEL, TODAY_ISO } from "../../mockData";
import type { ChoreCategory } from "../../mockData";

const WEEKDAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const MAX_TAGS_PER_DAY = 2;
const DAYS_PER_WEEK = 7;

// 기준 날짜가 포함된 주(월~일)의 날짜 목록을 계산
function getWeekDates(isoDate: string): string[] {
  const base = new Date(isoDate);
  const daysSinceMonday = (base.getDay() + 6) % 7;
  const monday = new Date(base);
  monday.setDate(base.getDate() - daysSinceMonday);

  return Array.from({ length: DAYS_PER_WEEK }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

// 날짜를 주 단위(days의 배수)로 이동
function shiftDate(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// 특정 날짜에 존재하는 과업 카테고리 목록(중복 제거)을 계산
function getCategoriesByDate(date: string): ChoreCategory[] {
  const categories = chores.filter((chore) => chore.date === date).map((chore) => chore.category);
  return Array.from(new Set(categories));
}

function formatMonthLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

interface WeeklyCalendarProps {
  onSelectDate: (date: string) => void;
}

function WeeklyCalendar({ onSelectDate }: WeeklyCalendarProps) {
  const [anchorDate, setAnchorDate] = useState(TODAY_ISO);
  const weekDates = getWeekDates(anchorDate);
  const monthLabel = formatMonthLabel(weekDates[0]);

  const goToPreviousWeek = () => setAnchorDate((prev) => shiftDate(prev, -DAYS_PER_WEEK));
  const goToNextWeek = () => setAnchorDate((prev) => shiftDate(prev, DAYS_PER_WEEK));

  return (
    // 주간 달력 섹션
    <section className="w-full">
      {/* 연/월 라벨 · 주 이동 버튼 */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-title-02 leading-tight font-bold text-gray-900">{monthLabel}</h2>

        <div className="flex items-center">
          <button
            type="button"
            onClick={goToPreviousWeek}
            aria-label="일주일 전"
            className="flex h-8 w-8 items-center justify-center text-gray-300"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            aria-label="일주일 후"
            className="flex h-8 w-8 items-center justify-center text-gray-300"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* 요일 · 날짜 · 카테고리 태그 목록 */}
      <div className="grid grid-cols-7 gap-1 rounded-lg bg-white p-3">
        {weekDates.map((date, idx) => {
          const day = Number(date.slice(-2));
          const isToday = date === TODAY_ISO;
          const isSunday = idx === 6;
          const isSaturday = idx === 5;
          const categories = getCategoriesByDate(date).slice(0, MAX_TAGS_PER_DAY);

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-caption leading-none font-medium ${
                  isSunday ? "text-brand" : isSaturday ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {WEEKDAY_LABELS[idx]}
              </span>

              <span
                className={`text-body-01 leading-none ${isToday ? "font-bold" : "font-semibold"} ${
                  isSunday ? "text-brand" : "text-gray-900"
                }`}
              >
                {day}
              </span>

              <div className="flex flex-col items-stretch gap-1">
                {categories.map((category) => (
                  <span
                    key={category}
                    className={`flex items-center gap-1 rounded-md px-1.5 py-1 ${CATEGORY_TINT_CLASS[category]}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${CATEGORY_BG_CLASS[category]}`} />
                    <span className={`text-caption leading-none font-medium ${CATEGORY_TEXT_CLASS[category]}`}>
                      {CATEGORY_LABEL[category]}
                    </span>
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default WeeklyCalendar;
