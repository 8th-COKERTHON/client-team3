interface Props {
  value: number; // 0 = 미선택, 1~5
  onChange: (v: number) => void;
}

export function DifficultySelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">난이도</label>
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`w-6 h-6 rounded-full transition-colors ${
              level <= value ? "bg-rose-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
