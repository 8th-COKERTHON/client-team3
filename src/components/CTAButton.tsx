import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function CTAButton({
  children,
  className = '',
  ...props
}: CTAButtonProps) {
  return (
    <button
      type="button"
      className={`
        flex h-12 w-[350px] items-center justify-center rounded-[16px] py-4
        bg-brand
        shadow-[0_2_20px_rgba(0, 0, 0, 0.08)]
        ${className}
      `}
      {...props}
    >
      <span className="whitespace-nowrap text-body-01 font-body-01 font-extrabold text-white leading-none">
        {children}
      </span>
    </button>
  );
}