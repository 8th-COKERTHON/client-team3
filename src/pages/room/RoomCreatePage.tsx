import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CTAButton from '../../components/CTAButton'
import Header from '../../components/Header'
import { createGroup, saveGroupId } from '../../api/group'
import { ApiError } from '../../types/api'

interface RoomCreateLocationState {
  groupId?: number
  groupName?: string
  inviteCode?: string
}

export default function RoomCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state ?? {}) as RoomCreateLocationState
  const [roomName, setRoomName] = useState(locationState.groupName ?? '우리집')
  const [inviteCode, setInviteCode] = useState(locationState.inviteCode ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isCreated = inviteCode.length > 0
  const buttonLabel = useMemo(() => (isCreated ? '홈으로 이동' : '만들기'), [isCreated])

  const handleCreate = async () => {
    if (isCreated) {
      navigate('/')
      return
    }

    if (!roomName.trim()) {
      setErrorMessage('방 이름을 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await createGroup({
        groupName: roomName.trim(),
      })

      saveGroupId(response.data.groupId)
      setRoomName(response.data.groupName)
      setInviteCode(response.data.inviteCode)
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('방 생성 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex h-dvh w-full flex-col items-center bg-[#F5F5FA] gap-4">
      <Header title="" onBack={() => navigate(-1)} />

      <section className="flex flex-1 flex-col w-full items-center">
        <div className="w-[350px] rounded-[24px] bg-white p-5 shadow-[0_2px_20px_rgba(0, 0, 0, 0,06)]">
          <label className="flex flex-col gap-2 items-start">
            <span className="text-body-02 font-bold leading-[1.5] text-[#999999]">방 이름</span>
            <input
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
              disabled={isCreated}
              className="w-full h-[48px] rounded-[16px] bg-[#F5F5FA] px-4 py-3 text-body-01 font-bold leading-[1.5] text-black outline-none"
            />
          </label>

          <div className="mt-5 flex flex-col items-start">
            <p className="text-body-02 font-bold leading-[1.5] text-[#999999]">초대코드</p>
            <p className="text-body-01 font-medium leading-[1.5] text-[#BBBBBB]">
              코드를 친구에게 공유하세요 ✨
            </p>
          </div>

          <div className="relative mt-[12px] overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.07)]">
            <div className="absolute bottom-[-20px] left-[-10px] h-[58px] w-[58px] rounded-full bg-[#DDF6F4]" />
            <div className="absolute right-[-15px] top-[-30px] h-[87px] w-[87px] rounded-full bg-[#FFE8E5]" />
            <p className="relative text-caption font-bold leading-[1.5] text-[#999999]">초대 코드</p>
            <p className="relative mt-[8px] text-[40px] font-bold leading-[1.5] text-brand">
              {inviteCode || '-----'}
            </p>
          </div>
        </div>

        <div className="absolute right-0 bottom-[32px] left-0 flex flex-col items-center gap-[8px]">
          {errorMessage && (
            <p className="w-full text-center text-body-02 font-medium leading-[1.5] text-brand">
              {errorMessage}
            </p>
          )}
          <div className="flex w-full justify-center">
            <CTAButton onClick={handleCreate} disabled={isSubmitting}>
            {buttonLabel}
          </CTAButton>
          </div>
        </div>
      </section>
    </main>
  )
}
