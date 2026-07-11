import type { MainChore } from "../../types/main";
import ChoreItem from "./ChoreItem";

interface ChoreListProps {
  chores: MainChore[];
  onToggle?: (id: number, done: boolean) => void;
  onOpenDetail?: (chore: MainChore) => void;
}

function ChoreList({ chores, onToggle, onOpenDetail }: ChoreListProps) {
  const doneCount = chores.filter((chore) => chore.done).length;

  return (
    <section className="w-full">
      <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_14px_36px_rgba(31,31,31,0.06)]">
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <h2 className="text-title-02 leading-tight font-extrabold text-gray-900">
            오늘의 과업
          </h2>
          <span className="rounded-full bg-[#F4F4F8] px-3 py-1 text-body-02 font-bold leading-none text-gray-400">
            {doneCount} / {chores.length} 완료
          </span>
        </div>

        {chores.length > 0 ? (
          <div className="max-h-[320px] snap-y snap-mandatory divide-y divide-gray-100 overflow-y-auto px-4">
            {chores.map((chore) => (
              <div key={chore.id} className="snap-start">
                <ChoreItem chore={chore} onToggle={onToggle} onOpenDetail={onOpenDetail} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center px-5 pb-8">
            <p className="text-body-01 font-medium leading-[1.6] text-gray-400">
              오늘 등록된 과업이 없어요.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ChoreList;
