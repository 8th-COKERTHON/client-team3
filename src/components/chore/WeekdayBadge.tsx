// components/common/WeekdayBadge.tsx
interface Props {
  day: string; // "월"|"화"|"수"|"목"|"금"|"토"|"일"
}

export function WeekdayBadge({ day }: Props) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-sm text-gray-400">{day}</span>
      <span className="w-8 h-8 rounded-full bg-rose-500 text-white text-sm font-medium flex items-center justify-center">
        {day}
      </span>
    </div>
  );
}
