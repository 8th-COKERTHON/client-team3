interface Props {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean; // 추가
}

export function DifficultySelector({ value, onChange, disabled }: Props) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">난이도</label>
      <div
        className={`flex items-center gap-2 rounded-xl px-4 py-3 ${
          disabled ? "bg-gray-100" : "bg-gray-50"
        }`}
      >
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level)}
            className={`w-6 h-6 rounded-full transition-colors ${
              level <= value ? "bg-rose-500" : "bg-gray-200"
            } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
