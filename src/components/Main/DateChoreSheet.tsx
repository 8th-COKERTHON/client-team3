import Layout from "../bottomsheet/Layout";
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
  if (!date) {
    return null;
  }

  const doneCount = chores.filter((chore) => chore.done).length;

  return (
    <Layout onClose={onClose}>
      <div className="flex max-h-[500px] flex-col pb-2">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <h2 className="text-title-02 leading-tight font-bold text-gray-900">{formatDateTitle(date)}</h2>
          <span className="rounded-full bg-[#F5F5FA] px-2.5 py-1 text-body-02 leading-none font-medium text-gray-400">
            {doneCount} / {chores.length} 완료
          </span>
        </div>

        {chores.length > 0 ? (
          <div className="min-h-0 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {chores.map((chore) => (
                <ChoreItem key={chore.id} chore={chore} onToggle={onToggle} />
              ))}
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-body-02 leading-none font-medium text-gray-300">
            이 날은 등록된 과업이 없어요.
          </p>
        )}
      </div>
    </Layout>
  );
}

export default DateChoreSheet;
