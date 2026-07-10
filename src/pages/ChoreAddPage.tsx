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
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
          난이도
        </label>
        <DifficultySelector
          value={difficulty}
          onChange={setDifficulty}
          disabled={isFromCatalog}
        />
      </div>
    </div>
  );
}
