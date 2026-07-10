import type { InputHTMLAttributes } from 'react'

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  errorMessage?: string
}

export default function AuthInput({
  label,
  errorMessage,
  className = '',
  ...props
}: AuthInputProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-body-01 font-bold leading-[1.5] text-[#444444]">{label}</span>
      <input
        className={`h-[52px] rounded-[16px] border px-4 text-body-01 font-medium text-black outline-none placeholder:text-gray-11/50 ${
          errorMessage ? 'border-brand' : 'border-gray-03'
        } ${className}`}
        {...props}
      />
      {errorMessage && (
        <span className="text-body-01 font-medium leading-[1.5] text-brand">
          {errorMessage}
        </span>
      )}
    </label>
  )
}
