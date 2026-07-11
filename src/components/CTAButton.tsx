import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  textClassName?: string;
}

export default function CTAButton({
  children,
  className = '',
  textClassName = '',
  disabled = false,
  ...props
}: CTAButtonProps) {
  const resolvedTextClassName = disabled
    ? textClassName || 'text-gray-05'
    : textClassName || 'text-white'

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        flex h-12 w-[350px] items-center justify-center rounded-[16px] py-4
        ${disabled ? 'bg-[#F0F0F6] shadow-none' : 'bg-brand shadow-[0_2_20px_rgba(0, 0, 0, 0.08)]'}
        ${className}
      `}
      {...props}
    >
      <span
        className={`whitespace-nowrap text-body-01 font-body-01 font-extrabold leading-none ${resolvedTextClassName}`}
      >
        {children}
      </span>
    </button>
  );
}
