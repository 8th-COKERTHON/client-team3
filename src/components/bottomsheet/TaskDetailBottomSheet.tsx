import { useState } from 'react'
import StatButton from '../StatButton'
import Layout from './Layout'
import CTAButton from '../CTAButton'

type Status = 'pending' | 'inProgress' | 'done'

export default function TaskDetailBottomSheet() {
  const [selectedStatus, setSelectedStatus] = useState<Status>('pending')
  const [isRequested, setIsRequested] = useState(false)

  const handleRequest = () => {
    setIsRequested(true)
  }

  return (
    <Layout>
      <div className='flex flex-col items-start gap-1'>
        {/* 제목 */}
        <div className='flex flex-col w-full items-start gap-[1px]'>
          <p className='text-subtitle font-extrabold text-black leading-[1.5]'>
            욕실 청소
          </p>
          <p className='text-body-02 font-medium text-gray leading-[1.5]'>
            김민준 · 난이도 6 · +20pt
          </p>
        </div>

        {/* 본문 */}
        <div className='flex flex-col w-full mt-6'>
          <p className='text-body-02 font-bold text-gray leading-[1.5]'>
            상태 선택
          </p>
          <div className='flex w-full items-center justify-between py-1'>
            <StatButton
              status="pending"
              selected={selectedStatus === 'pending'}
              onClick={() => setSelectedStatus('pending')}
            />
            <StatButton
              status="inProgress"
              selected={selectedStatus === 'inProgress'}
              onClick={() => setSelectedStatus('inProgress')}
            />
            <StatButton
              status="done"
              selected={selectedStatus === 'done'}
              onClick={() => setSelectedStatus('done')}
            />
          </div>

        </div>

        {/* 버튼 */}
        <div className='flex flex-col w-full items-center py-[10px] gap-1'>
          <CTAButton onClick={handleRequest}>
            수행 요청하기
          </CTAButton>
          {isRequested && (
            <p className="mt-2 text-body-02 leading-[1.5] font-medium text-brand">
              요청을 보냈어요!
            </p>
          )}

        </div>
      </div>
    </Layout>
  )
}