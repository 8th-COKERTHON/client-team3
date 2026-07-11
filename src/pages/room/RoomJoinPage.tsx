import { IconKeyFilled } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CTAButton from '../../components/CTAButton'
import Header from '../../components/common/Header'
import { joinGroup, saveGroupId } from '../../api/group'
import { ApiError } from '../../types/api'

export default function RoomJoinPage() {
  const navigate = useNavigate()
  const [inviteCode, setInviteCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setErrorMessage('초대코드를 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const response = await joinGroup({
        inviteCode: inviteCode.trim(),
      })

      saveGroupId(response.data.groupId)
      navigate('/main')
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('방 참여 중 오류가 발생했습니다.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex h-dvh w-full flex-col items-center bg-[#F5F5FA]">
      <Header
        title=""
        onBack={() => navigate(-1)}
        backgroundClassName="bg-[#F5F5FA]"
        compact
      />

      <section className="flex w-full flex-col items-center justify-center gap-4 pt-1 pb-[128px]">
        <div className="w-[350px] rounded-[24px] bg-white p-6 shadow-[0_2px_20px_rgba(0, 0, 0, 0.07)] gap-4">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[16px] bg-brand/10">
            <IconKeyFilled size={24} className="text-[#F4B000]" />
          </div>
          <h1 className="text-title-01 font-extrabold leading-[1.5] text-black">
            방에 참여하기
          </h1>
          <p className="mt-[6px] text-subtitle font-medium leading-[1.5] text-[#999999] tex-start">
            친구에게 받은 초대코드를 입력해서<br />
            방에 들어가요</p>
        </div>

        <div className="w-[350px] rounded-[24px] bg-white p-5 shadow-[0_2px_20px_rgba(0, 0, 0, 0,06)]">
          <label className="flex flex-col gap-3 items-start">
            <span className="text-body-02 font-extrabold leading-[1.5] text-[#999999]">초대코드 입력</span>
            <input
              value={inviteCode}
              onChange={(event) => {
                setInviteCode(event.target.value.toUpperCase())
                setErrorMessage('')
              }}
              placeholder="AAAAA"
              className="w-[310px] h-[67px] rounded-[16px] bg-[#F5F5FA] p-4 text-center text-title-01 font-bold tracking-[0.16em] text-black outline-none placeholder:text-[#CCCCCC]"
            />
          </label>
        </div>
      </section>

      <div className="absolute right-0 bottom-[32px] left-0 flex flex-col items-center gap-[8px]">
        {errorMessage && (
          <p className="w-full text-center text-body-02 font-medium leading-[1.5] text-brand">
            {errorMessage}
          </p>
        )}
        <div className="flex w-full justify-center">
          <CTAButton onClick={handleJoin} disabled={isSubmitting}>
            입장하기
          </CTAButton>
        </div>
      </div>
    </main>
  )
}
