import { IconChevronLeft } from '@tabler/icons-react'

interface HeaderProps {
  title: string
  onBack?: () => void
}

export default function Header({ title, onBack }: HeaderProps) {
  return (
    <header className="relative flex w-full h-12 items-center justify-center py-1">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-[20px] top-1/2 -translate-y-1/2 text-black"
        >
          <IconChevronLeft size={16} />
        </button>
      )}
      <h1 className="text-title-01 font-extrabold leading-[1.5] text-black">{title}</h1>
    </header>
  )
}
