import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

interface DropdownOption {
  id: string
  label: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (id: string) => void
}

export default function Dropdown({
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false)

  const selectedOption = options.find((option) => option.id === value)

  return (
    <div className="relative w-fit h-11">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-[110px] h-full items-center justify-between rounded-[16px] border-2 border-gray-03 bg-[#F5F5FA] px-3 outline-none"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex w-5 h-5 items-center justify-center rounded-full bg-brand text-caption font-extrabold text-white leading-[1.5]">
            {selectedOption?.label.slice(0, 1)}
          </div>
          <span className="text-body-02 font-bold text-[#444444] text-center leading-[1.5]">
            {selectedOption?.label}
          </span>
          <IconChevronDown size={13} className={`text-gray-08 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-full overflow-hidden rounded-[20px] bg-white shadow-[0_8px_24px_rgba(34,34,34,0.12)]">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-center ${
                option.id === value ? 'bg-[#FD5F54]/7' : 'bg-white'
              }`}
            >
              <div className="flex w-5 h-5 items-center justify-center rounded-full bg-brand text-caption font-extrabold text-white leading-[1.5]">
                {option.label.slice(0, 1)}
              </div>
              <span className="text-body-02 font-bold text-[#444444] text-center leading-[1.5]">
                {option?.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}