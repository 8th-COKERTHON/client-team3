import BottomSheet from "../common/BottomSheet";
import ChoreItem from "./ChoreItem";
import type { MainChore } from "../../types/main";

interface DateChoreSheetProps {
  date: string | null;
  chores: MainChore[];
  onClose: () => void;
  onToggle: (id: number, done: boolean) => void;
}

function formatDateTitle(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function DateChoreSheet({ date, chores, onClose, onToggle }: DateChoreSheetProps) {
  const doneCount = chores.filter((chore) => chore.done).length;

  return (
    <BottomSheet open={date !== null} onClose={onClose}>
      {date && (
        <div className="px-5 pb-8">
          {/* 날짜 타이틀 · 완료 현황 */}
          <div className="mb-2 flex items-center justify-between py-3">
            <h2 className="text-title-02 leading-tight font-bold text-gray-900">{formatDateTitle(date)}</h2>
            <span className="rounded-full bg-[#F5F5FA] px-2.5 py-1 text-body-02 leading-none font-medium text-gray-400">
              {doneCount} / {chores.length} 완료
            </span>
          </div>

          {/* 과업 리스트 */}
          {chores.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {chores.map((chore) => (
                <ChoreItem key={chore.id} chore={chore} onToggle={onToggle} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-body-02 leading-none font-medium text-gray-300">
              이 날은 등록된 과업이 없어요.
            </p>
          )}
        </div>
      )}
    </BottomSheet>
  );
}

export default DateChoreSheet;
