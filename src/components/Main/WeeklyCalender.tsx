import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCalendarChores } from "../../api/calendar";
import type { CalendarDayChores } from "../../types/calendar";
import type { ChoreBoardItem } from "../../types/chore";
import type { MainChore } from "../../types/main";
import {
  CATEGORY_BG_CLASS,
  CATEGORY_TEXT_CLASS,
  CATEGORY_TINT_CLASS,
  buildMainChoreFromCalendar,
  expandBoardChoresForDate,
  formatLocalIsoDate,
  getTodayIsoDate,
  resolveChoreCategory,
  type FamilyMember,
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
    return formatLocalIsoDate(d);
  });
}

// 날짜를 주 단위(days의 배수)로 이동
function shiftDate(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return formatLocalIsoDate(d);
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

// 특정 날짜의 과업 태그 목록(최대 MAX_TAGS_PER_DAY개)을 계산
function getTagsByDate(dayChores: MainChore[]): DayTag[] {
  const tags: DayTag[] = [];

  for (const chore of dayChores) {
    const resolved = resolveChoreCategory(chore.category ?? "", chore.title);
    const key = String(chore.id);

    tags.push(
      resolved
        ? {
            key,
            label: chore.title,
            bgClass: CATEGORY_BG_CLASS[resolved],
            textClass: CATEGORY_TEXT_CLASS[resolved],
            tintClass: CATEGORY_TINT_CLASS[resolved],
          }
        : {
            key,
            label: chore.title,
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
  chores: ChoreBoardItem[];
  members: FamilyMember[];
  onSelectDate: (date: string, chores: MainChore[]) => void;
}

function mergeDayChores(primary: MainChore[], fallback: MainChore[]) {
  const merged = new Map<string, MainChore>();

  for (const chore of primary) {
    merged.set(`${chore.date}:${chore.id}`, chore);
  }

  for (const chore of fallback) {
    const key = `${chore.date}:${chore.id}`;
    if (!merged.has(key)) {
      merged.set(key, chore);
    }
  }

  return Array.from(merged.values());
}

function WeeklyCalendar({ groupId, chores, members, onSelectDate }: WeeklyCalendarProps) {
  const todayIso = getTodayIsoDate();
  const [anchorDate, setAnchorDate] = useState(todayIso);
  const [calendarData, setCalendarData] = useState<CalendarDayChores[]>([]);
  const [error, setError] = useState<string | null>(null);

  const weekDates = getWeekDates(anchorDate);
  const monthLabel = formatMonthLabel(weekDates[0]);
  const startDate = weekDates[0];
  const endDate = weekDates[DAYS_PER_WEEK - 1];

  useEffect(() => {
    let cancelled = false;

    fetchCalendarChores(groupId, startDate, endDate)
      .then((data) => {
        if (cancelled) {
          return;
        }

        setCalendarData(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) {
          return;
        }

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
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-headline leading-tight font-extrabold text-gray-900">{monthLabel}</h2>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPreviousWeek}
            aria-label="일주일 전"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-300"
          >
            <ChevronLeft size={16} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={goToNextWeek}
            aria-label="일주일 후"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-300"
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-2 text-caption leading-none font-medium text-gray-300">{error}</p>
      )}

      <div className="grid grid-cols-7 gap-1 overflow-visible rounded-[28px] bg-[#FCFCFE] px-3 py-3">
        {weekDates.map((date, idx) => {
          const day = Number(date.slice(-2));
          const isToday = date === todayIso;
          const isSunday = idx === 6;
          const isSaturday = idx === 5;
          const calendarDayChores =
            calendarData
              .find((dayData) => dayData.date === date)
              ?.chores.map((chore) => buildMainChoreFromCalendar(chore, members)) ?? [];
          const fallbackDayChores = expandBoardChoresForDate(chores, members, date);
          const dayChores = mergeDayChores(calendarDayChores, fallbackDayChores);
          const tags = getTagsByDate(dayChores);

          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelectDate(date, dayChores)}
              className="flex min-h-[92px] flex-col items-center gap-2 overflow-visible rounded-2xl px-0.5 py-1"
            >
              <span
                className={`text-caption leading-none font-medium ${
                  isSunday ? "text-brand" : isSaturday ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {WEEKDAY_LABELS[idx]}
              </span>

              <span
                className={`text-title-02 leading-none ${isToday ? "font-bold opacity-100" : "font-semibold opacity-[0.7]"} ${
                  isSunday ? "text-brand" : "text-gray-900"
                }`}
              >
                {day}
              </span>

              <div className="mt-1 flex w-full flex-col items-center gap-1 overflow-visible">
                {tags.map((tag) => (
                  <span
                    key={tag.key}
                    className={`flex w-max items-center justify-start gap-1 rounded-full px-1.5 py-1 whitespace-nowrap ${tag.tintClass}`}
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tag.bgClass}`} />
                    <span
                      className={`max-w-[52px] truncate text-[9px] leading-none font-medium ${tag.textClass}`}
                    >
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
