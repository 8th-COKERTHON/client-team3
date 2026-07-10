import { useEffect, useMemo, useState } from 'react'
import StatButton from '../StatButton'
import Layout from './Layout'
import CTAButton from '../CTAButton'
import Dropdown from '../Dropdown'
import { getChoreBoard, updateChoreStatus } from '../../api/chore'
import {
  CHORE_OPTION_TO_STATUS,
  CHORE_STATUS_TO_OPTION,
  type ChoreBoardItem,
  type ChoreBoardResponse,
  type ChoreStatusOption,
} from '../../types/chore'

interface MemberOption {
  id: string
  label: string
}

interface TaskDetailBottomSheetProps {
  groupId: number
  choreId: number
  members?: MemberOption[]
  onStatusUpdated?: (updatedChore: ChoreBoardItem) => void
  onClose?: () => void
}

function findChoreById(board: ChoreBoardResponse, choreId: number) {
  return [...board.scheduled, ...board.inProgress, ...board.done].find(
    (item) => item.choreId === choreId,
  )
}

export default function TaskDetailBottomSheet({
  groupId,
  choreId,
  members = [],
  onStatusUpdated,
  onClose,
}: TaskDetailBottomSheetProps) {
  const [chore, setChore] = useState<ChoreBoardItem | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<ChoreStatusOption>('pending')
  const [isRequested, setIsRequested] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState('')

  useEffect(() => {
    async function fetchChore() {
      try {
        setIsLoading(true)

        const response = await getChoreBoard(groupId)
        const targetChore = findChoreById(response.data, choreId)

        if (!targetChore) {
          return
        }

        setChore(targetChore)
        setSelectedStatus(CHORE_STATUS_TO_OPTION[targetChore.status])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchChore()
  }, [groupId, choreId])

  const selectedMemberId = useMemo(() => {
    return members.find((member) => member.label === chore?.assigneeName)?.id ?? members[0]?.id ?? ''
  }, [members, chore?.assigneeName])

  useEffect(() => {
    setSelectedMember(selectedMemberId)
  }, [selectedMemberId])

  const handleRequest = async () => {
    if (!chore) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await updateChoreStatus(
        groupId,
        chore.choreId,
        CHORE_OPTION_TO_STATUS[selectedStatus],
      )

      setChore(response.data)
      setSelectedStatus(CHORE_STATUS_TO_OPTION[response.data.status])
      setIsRequested(true)
      onStatusUpdated?.(response.data)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !chore) {
    return (
      <Layout onClose={onClose}>
        <div className="flex min-h-[240px] w-full items-center justify-center">
          <p className="text-body-02 font-medium text-gray leading-[1.5]">불러오는 중...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onClose={onClose}>
      <div className='flex flex-col items-start gap-1'>
        {/* 제목 */}
        <div className='flex w-full items-center justify-between'>
          <div className='flex flex-col w-full items-start gap-[1px]'>
            <p className='text-subtitle font-extrabold text-black leading-[1.5]'>
              {chore.name}
            </p>
            <p className='text-body-02 font-medium text-gray leading-[1.5]'>
              {chore.assigneeName} · 난이도 {chore.difficulty} · +{chore.score}pt
            </p>
          </div>
          {members.length > 0 && (
            <Dropdown
              options={members}
              value={selectedMember}
              onChange={setSelectedMember}
            />
          )}
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
          <CTAButton onClick={handleRequest} disabled={isSubmitting}>
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
