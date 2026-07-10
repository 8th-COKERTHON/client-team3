import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CatalogChore } from "../../types/chore";
import { getChoreCatalog } from "../../api/chore";
import { groupByCategory } from "../../utils/groupByCategory";
import Layout from "../bottomsheet/Layout";

interface Props {
  onClose?: () => void;
}

export default function ChoreCatalogBottomSheet({ onClose }: Props) {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<CatalogChore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CatalogChore | null>(null);

  useEffect(() => {
    getChoreCatalog()
      .then((res) => setCatalog(res.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const grouped = groupByCategory(catalog);

  const handleConfirm = () => {
    if (!selected) return;
    navigate("/chores/add", {
      state: {
        choreId: selected.id,
        name: selected.name,
        difficulty: selected.difficulty,
        score: selected.score,
      },
    });
  };

  return (
    <Layout onClose={onClose}>
      <h2 className="text-lg font-bold mb-4">집안일 추가</h2>

      <button
        type="button"
        className="w-full text-left px-4 py-3 rounded-xl bg-gray-100 mb-4 text-sm text-gray-500"
        onClick={() => navigate("/chores/add")}
      >
        + 새 과업 추가하기
      </button>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">불러오는 중...</p>
      ) : (
        grouped.map(({ category, tasks }) => (
          <div key={category} className="mb-4">
            <div className="text-sm font-semibold mb-2">{category}</div>
            <div className="flex flex-wrap gap-2">
              {tasks.map((task) => {
                const isSelected = selected?.id === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSelected(task)}
                    className={`px-3 py-2 rounded-full border text-sm ${
                      isSelected
                        ? "bg-rose-500 text-white border-rose-500"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    {task.name}{" "}
                    <span
                      className={isSelected ? "text-white/80" : "text-gray-400"}
                    >
                      +{task.score}pt
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        disabled={!selected}
        onClick={handleConfirm}
        className="w-full mt-4 py-3 rounded-xl bg-rose-500 text-white font-medium disabled:bg-gray-300"
      >
        {selected ? "선택 완료" : "집안일을 선택해 주세요."}
      </button>
    </Layout>
  );
}
