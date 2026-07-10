import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TextBox } from "../components/chore/TextBox";

interface CatalogSelection {
  choreId?: number; // 있으면 카탈로그 선택, 없으면 새 과업
  name?: string;
  difficulty?: number;
  score?: number;
}

export default function ChoreAddPage() {
  const location = useLocation();
  const selected = (location.state as CatalogSelection | null) ?? null;
  const isFromCatalog = Boolean(selected?.choreId);

  const [name, setName] = useState(selected?.name ?? "");
  const [nameTouched, setNameTouched] = useState(false);

  const nameError =
    nameTouched && name.trim() === "" ? "제목을 입력해 주세요." : undefined;

  return (
    <div className="min-h-screen bg-white px-5 py-4">
      <TextBox
        label="제목"
        value={name}
        onChange={setName}
        onBlur={() => setNameTouched(true)}
        placeholder="집안일 이름을 입력해 주세요"
        error={nameError}
      />

      {isFromCatalog && selected && (
        <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <span>난이도</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={`w-4 h-4 rounded-full ${
                    level <= (selected.difficulty ?? 0)
                      ? "bg-rose-500"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="font-medium text-rose-500">+{selected.score}pt</span>
        </div>
      )}
    </div>
  );
}
