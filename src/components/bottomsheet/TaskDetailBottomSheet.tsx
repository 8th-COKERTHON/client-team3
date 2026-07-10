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
  groupChoreId: number
  members?: MemberOption[]
  onStatusUpdated?: (updatedChore: ChoreBoardItem) => void
  onClose?: () => void
}

function findChoreById(board: ChoreBoardResponse, groupChoreId: number) {
  return [...board.scheduled, ...board.inProgress, ...board.done].find(
    (item) => item.id === groupChoreId,
  )
}

export default function TaskDetailBottomSheet({
  groupId,
  groupChoreId,
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
        const targetChore = findChoreById(response.data, groupChoreId)

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
  }, [groupId, groupChoreId])

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
        chore.id,
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
      <div className='flex w-full flex-col items-start gap-1'>
        <div className='flex w-full items-start justify-between gap-3'>
          <div className='flex min-w-0 flex-1 flex-col items-start gap-[1px] pr-1'>
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
        <div className='flex flex-col w-full mt-6'>
          <p className='text-body-02 font-bold text-gray leading-[1.5]'>
            상태 선택
          </p>
          <div className='mt-2 grid w-full grid-cols-3 gap-2'>
            <StatButton
              status="pending"
              selected={selectedStatus === 'pending'}
              onClick={() => setSelectedStatus('pending')}
              className="w-full min-w-0"
            />
            <StatButton
              status="inProgress"
              selected={selectedStatus === 'inProgress'}
              onClick={() => setSelectedStatus('inProgress')}
              className="w-full min-w-0"
            />
            <StatButton
              status="done"
              selected={selectedStatus === 'done'}
              onClick={() => setSelectedStatus('done')}
              className="w-full min-w-0"
            />
          </div>

        </div>

        <div className='flex flex-col w-full items-center gap-1 py-[10px]'>
          <CTAButton onClick={handleRequest} disabled={isSubmitting || isRequested} className="w-full">
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
