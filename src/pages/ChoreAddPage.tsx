import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TextBox } from "../components/chore/TextBox";
import { DifficultySelector } from "../components/chore/DifficultySelector";

interface CatalogSelection {
  choreId?: number;
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
  const [difficulty, setDifficulty] = useState(selected?.difficulty ?? 0);

  const nameError =
    nameTouched && name.trim() === "" ? "제목을 입력해 주세요." : undefined;

  // 카탈로그면 서버에서 받은 score 그대로, 새 과업이면 난이도로 계산
  const score = isFromCatalog ? (selected?.score ?? 0) : difficulty * 5;

  return (
    <div className="min-h-screen bg-white px-5 py-4 flex flex-col gap-5">
      <TextBox
        label="제목"
        value={name}
        onChange={setName}
        onBlur={() => setNameTouched(true)}
        placeholder="집안일 이름을 입력해 주세요"
        error={nameError}
        disabled={isFromCatalog}
      />

      <div>
        <DifficultySelector
          value={difficulty}
          onChange={setDifficulty}
          disabled={isFromCatalog}
        />
        {(difficulty > 0 || isFromCatalog) && (
          <p className="text-sm text-rose-500 mt-1 text-right">+{score}pt</p>
        )}
      </div>
    </div>
  );
}
