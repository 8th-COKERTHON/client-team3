import type { Chore } from "../../mockData";
import ChoreItem from "./ChoreItem";

interface ChoreListProps {
  chores: Chore[];
  onToggle?: (id: string) => void;
}

function ChoreList({ chores, onToggle }: ChoreListProps) {
  const doneCount = chores.filter((chore) => chore.done).length;

  return (
    // 오늘의 과업 섹션
    <section className="w-full">
      {/* 완료 현황 타이틀 */}
      <div className="mb-3">
        <h2 className="text-title-02 leading-tight font-bold text-gray-900">
          오늘의 과업 ({doneCount} / {chores.length} 완료)
        </h2>
      </div>

      {/* 과업 리스트 카드 */}
      <div className="divide-y divide-gray-100 rounded-2xl bg-white px-4">
        {chores.map((chore) => (
          <ChoreItem key={chore.id} chore={chore} onToggle={onToggle} />
        ))}
      </div>
    </section>
  );
}

export default ChoreList;
