// src/components/common/TextBox.tsx
interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
}

export function TextBox({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
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
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none placeholder:text-gray-400 ${
          error
            ? "border-rose-500 focus:border-rose-500"
            : "border-gray-200 focus:border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
