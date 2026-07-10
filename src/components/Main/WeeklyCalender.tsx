import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCalendarChores } from "../../api/calendar";
import type { ApiChore, CalendarDayChores } from "../../types/calendar";
import {
  CATEGORY_BG_CLASS,
  CATEGORY_LABEL,
  CATEGORY_TEXT_CLASS,
  CATEGORY_TINT_CLASS,
  getTodayIsoDate,
  resolveChoreCategory,
} from "../../types/main";

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

function formatMonthLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

interface DayTag {
  key: string;
  label: string;
  bgClass: string;
  textClass: string;
  tintClass: string;
}

// 특정 날짜의 과업 카테고리 태그 목록(중복 제거, 최대 MAX_TAGS_PER_DAY개)을 계산
function getTagsByDate(calendarData: CalendarDayChores[], date: string): DayTag[] {
  const dayChores = calendarData.find((day) => day.date === date)?.chores ?? [];
  const tags: DayTag[] = [];
  const seenKeys = new Set<string>();

  for (const chore of dayChores) {
    const resolved = resolveChoreCategory(chore.category);
    const key = resolved ?? chore.category;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    tags.push(
      resolved
        ? {
            key,
            label: CATEGORY_LABEL[resolved],
            bgClass: CATEGORY_BG_CLASS[resolved],
            textClass: CATEGORY_TEXT_CLASS[resolved],
            tintClass: CATEGORY_TINT_CLASS[resolved],
          }
        : {
            key,
            label: chore.category,
            bgClass: "bg-gray-400",
            textClass: "text-gray-400",
            tintClass: "bg-gray-100",
          },
    );

    if (tags.length >= MAX_TAGS_PER_DAY) break;
  }

  return tags;
}

interface WeeklyCalendarProps {
  groupId: number;
  onSelectDate: (date: string, chores: ApiChore[]) => void;
}

function WeeklyCalendar({ groupId, onSelectDate }: WeeklyCalendarProps) {
  const todayIso = getTodayIsoDate();
  const [anchorDate, setAnchorDate] = useState(todayIso);
  const [calendarData, setCalendarData] = useState<CalendarDayChores[]>([]);
  const [error, setError] = useState<string | null>(null);

  const weekDates = getWeekDates(anchorDate);
  const monthLabel = formatMonthLabel(weekDates[0]);
  const startDate = weekDates[0];
  const endDate = weekDates[DAYS_PER_WEEK - 1];

  // 표시 중인 주(startDate~endDate)가 바뀔 때마다 캘린더 과업을 서버에서 조회
  useEffect(() => {
    let cancelled = false;

    fetchCalendarChores(groupId, startDate, endDate)
      .then((data) => {
        if (cancelled) return;
        setCalendarData(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setCalendarData([]);
        setError(err instanceof Error ? err.message : "캘린더 과업을 불러오지 못했어요.");
      });

    return () => {
      cancelled = true;
    };
  }, [groupId, startDate, endDate]);

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

      {/* 조회 실패 안내 */}
      {error && (
        <p className="mb-2 text-caption leading-none font-medium text-gray-300">{error}</p>
      )}

      {/* 요일 · 날짜 · 카테고리 태그 목록 */}
      <div className="grid grid-cols-7 gap-1 rounded-lg bg-white p-3">
        {weekDates.map((date, idx) => {
          const day = Number(date.slice(-2));
          const isToday = date === todayIso;
          const isSunday = idx === 6;
          const isSaturday = idx === 5;
          const tags = getTagsByDate(calendarData, date);
          const dayChores = calendarData.find((dayData) => dayData.date === date)?.chores ?? [];

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date, dayChores)}
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
                className={`text-body-01 leading-none ${isToday ? "font-bold opacity-100" : "font-semibold opacity-[0.65]"} ${
                  isSunday ? "text-brand" : "text-gray-900"
                }`}
              >
                {day}
              </span>

              <div className="flex flex-col items-stretch gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag.key}
                    className={`flex items-center gap-1 rounded-md px-1.5 py-1 ${tag.tintClass}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tag.bgClass}`} />
                    <span className={`text-caption leading-none font-medium ${tag.textClass}`}>
                      {tag.label}
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
