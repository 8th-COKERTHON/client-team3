interface StatButtonProps {
  status: 'pending' | 'inProgress' | 'done'
  selected?: boolean
  onClick?: () => void
}

const STATUS_CONFIG = {
  pending: {
    label: '예정',
    selectedClassName: 'border-2  border-[#C4C4C4]/60 bg-[#F4F4F4] text-[#484848] shadow-[0_2px_12px_rgba(34, 34, 34, 0.10)]',
  },
  inProgress: {
    label: '진행중',
    selectedClassName: 'border-2 border-[#F5A623] bg-[#FEF6E8] text-[#F5A623]',
  },
  done: {
    label: '완료',
    selectedClassName: 'border-2 border-[#2C75E9] bg-[#F0F3F8] text-[#2C75E9]',
  },
} as const

const baseClassName =
  'flex w-[110px] py-4 items-center justify-center rounded-[16px] text-body-01 font-extrabold'

const unselectedClassName = 'bg-[#F5F5FA] text-[#BBBBBB]'

export default function StatButton({
  status,
  selected = false,
  onClick,
}: StatButtonProps ) {
  const { label, selectedClassName } = STATUS_CONFIG[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClassName} ${selected ? selectedClassName : unselectedClassName}`}
    >
      {label}
    </button>
  )
}