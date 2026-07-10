interface Props {
  value: number; // 0 = 미선택, 1~5
  onChange: (v: number) => void;
  disabled?: boolean;
  pointPerLevel?: number; // 레벨당 포인트, 기본 10
}

export function DifficultySelector({
  value,
  onChange,
  disabled,
  pointPerLevel = 5,
}: Props) {
  const score = value * pointPerLevel;

  return (
    <div
      className={`flex items-center justify-between rounded-2xl px-5 py-4 ${
        disabled ? "bg-gray-100" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            disabled={disabled}
            onClick={() => onChange(level)}
            className={`w-9 h-9 rounded-full transition-colors ${
              level <= value ? "bg-rose-500" : "bg-gray-200"
            } ${disabled ? "cursor-not-allowed" : ""}`}
          />
        ))}
      </div>

      {value === 0 ? (
        <span className="w-4 h-[2px] bg-gray-300" />
      ) : (
        <div className="flex flex-col items-end">
          <span className="text-rose-500 font-bold text-sm">Lv.{value}</span>
          <span className="text-gray-400 text-xs">+{score}pt</span>
        </div>
      )}
    </div>
  );
}
