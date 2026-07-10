import { IconArrowRight, IconHomeFilled, IconKeyFilled } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import HouseIcon from '../../assets/house.svg'

function EntryCard({
  title,
  description,
  icon,
  highlighted = false,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  highlighted?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-[350px] items-center justify-between rounded-[24px] border p-5 text-left shadow-[0_2px_20px_rgba(0, 0, 0, 0.08)] ${
        highlighted ? 'border-brand/25 bg-brand/7' : 'border-transparent bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-[56px] w-[56px] items-center justify-center rounded-[16px] ${
          highlighted ? 'bg-brand/16' : 'bg-[#F7F8FF]'
        }`}>
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-subtitle font-bold leading-[1.5] text-black">{title}</p>
          <p className="text-body-02 font-semibold leading-[1.5] text-[#999999]">{description}</p>
        </div>
      </div>
      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
        highlighted ? 'bg-brand text-white' : 'bg-[#EBEBEB] text-black'
      }`}>
        <IconArrowRight size={16}/>
      </div>
    </button>
  )
}

export default function RoomEntryPage() {
  const navigate = useNavigate()

  return (
    <main className="flex w-full h-dvh flex-col bg-[#F5F5FA] items-start justify-center gap-9">
      <section className="flex flex-col gap-6">
        <img src={HouseIcon} alt="집 일러스트" className="h-auto w-[238px]" />
        <div className='flex flex-col gap-4 px-9'>
          <h1 className="text-headline font-bold leading-[1.5] text-black">
            집·적에 오신걸 환영합니다!
          </h1>
          <p className="text-subtitle font-medium leading-[1.5] text-gray-09 text-start">
            새로운 방을 만들거나
            <br />
            초대코드로 기존 방에 참여하세요
          </p>
        </div>
      </section>

      <section className="w-full flex flex-col gap-3 items-center">
        <EntryCard
          title="방 만들기"
          description="새로운 방을 만들고 멤버를 초대해요"
          icon={<IconHomeFilled size={28} className="text-brand" />}
          highlighted
          onClick={() => navigate('/room/create')}
        />
        <EntryCard
          title="초대코드로 참여"
          description="친구에게 받은 코드를 입력해서 방에 들어가요"
          icon={<IconKeyFilled size={28} className="text-[#F4B000]" />}
          onClick={() => navigate('/room/join')}
        />
      </section>
    </main>
  )
}
