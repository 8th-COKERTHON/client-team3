import { Circle, CheckCircle2 } from "lucide-react";
import type { Chore } from "../../mockData";
import { MEMBER_BG_CLASS, MEMBER_TEXT_CLASS } from "../../mockData";

interface ChoreItemProps {
  chore: Chore;
  onToggle?: (id: string) => void;
  onOpenDetail?: (chore: Chore) => void;
}

const DIFFICULTY_MAX = 5;

// 난이도만큼 채워지는 5칸짜리 바 (Figma DifficultyBar)
function DifficultyBar({
  difficulty,
  filledClass,
}: {
  difficulty: number;
  filledClass: string;
}) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: DIFFICULTY_MAX }, (_, i) => (
        <span
          key={i}
          className={`h-1 w-1 rounded-full ${i < difficulty ? filledClass : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function ChoreItem({ chore, onToggle, onOpenDetail }: ChoreItemProps) {
  const bgClass = MEMBER_BG_CLASS[chore.color];
  const textClass = MEMBER_TEXT_CLASS[chore.color];

  return (
    // 과업 리스트 로우 (카드 클릭 시 상세 상태 모달)
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail?.(chore)}
      className="flex items-center gap-3 py-3.5"
    >
      {/* 담당자 색상 바 */}
      <span className={`h-10 w-[3px] shrink-0 rounded-full ${bgClass}`} />

      {/* 과업명 · 담당자 · 난이도 · 점수 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span
          className={`text-subtitle leading-snug font-semibold ${
            chore.done ? "text-gray-400 line-through" : "text-gray-900"
          }`}
        >
          {chore.title}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-body-02 leading-none font-medium text-gray-400">
            {chore.assigneeName}
          </span>
          <span className="text-body-02 leading-none text-gray-300">·</span>
          <DifficultyBar difficulty={chore.difficulty} filledClass={bgClass} />
          <span
            className={`text-body-02 leading-none font-semibold ${textClass}`}
          >
            +{chore.point}pt
          </span>
        </div>
      </div>

      {/* 완료 체크 버튼 */}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.(chore.id);
        }}
        aria-pressed={chore.done}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-900"
      >
        {chore.done ? (
          <CheckCircle2 size={22} strokeWidth={1.5} />
        ) : (
          <Circle size={22} strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
}

export default ChoreItem;
