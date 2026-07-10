import type { Chore } from "../../mockData";
import ChoreItem from "./ChoreItem";

interface ChoreListProps {
  chores: Chore[];
  onToggle?: (id: string) => void;
  onOpenDetail?: (chore: Chore) => void;
}

function ChoreList({ chores, onToggle, onOpenDetail }: ChoreListProps) {
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

      {/* 과업 리스트 카드 - 최대 3개 높이로 고정, 스와이프(스크롤)로 나머지 확인 */}
      <div className="max-h-[220px] snap-y snap-mandatory divide-y divide-gray-100 overflow-y-auto rounded-2xl bg-white px-4">
        {chores.map((chore) => (
          <div key={chore.id} className="snap-start">
            <ChoreItem chore={chore} onToggle={onToggle} onOpenDetail={onOpenDetail} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ChoreList;
