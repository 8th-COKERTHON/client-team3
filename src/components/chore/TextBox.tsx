interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean; // 추가
}

export function TextBox({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  disabled,
}: Props) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none placeholder:text-gray-400 ${
          disabled
            ? "bg-gray-100 border-gray-100 text-gray-500 cursor-not-allowed"
            : error
              ? "border-rose-500 focus:border-rose-500"
              : "border-gray-200 focus:border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
