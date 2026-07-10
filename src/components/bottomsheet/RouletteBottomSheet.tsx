import { useEffect, useMemo, useState } from 'react'
import CTAButton from '../CTAButton'
import Layout from './Layout'
import { getGroupMembers } from '../../api/group'
import { getRouletteResults, getRouletteSlices } from '../../api/roulette'
import type { RouletteMember, RouletteSliceResponse } from '../../types/roulette'

const ROULETTE_COLORS = ['#34C77B', '#FF6157', '#4F80C8', '#F5A623', '#9B6DFF', '#00C2C7']

interface RouletteBottomSheetProps {
  groupId: number
  nextWeekStartDate?: string
  groupChoreId?: number
  onClose?: () => void
  onSave?: (winner: RouletteMember) => void
  onSpin?: () => Promise<number | null> | number | null
}

interface RouletteSegment extends RouletteMember {
  color: string
  startAngle: number
  endAngle: number
  centerAngle: number
}

function buildRouletteMembers(
  slices: RouletteSliceResponse[],
  members: { memberId: number; name: string }[],
) {
  return slices
    .filter((slice) => slice.shareRatio > 0)
    .map((slice) => ({
      memberId: slice.memberId,
      name: members.find((member) => member.memberId === slice.memberId)?.name ?? `멤버 ${slice.memberId}`,
      shareRatio: slice.shareRatio,
    }))
}

function getNormalizedRatio(member: RouletteMember, members: RouletteMember[]) {
  const totalRatio = members.reduce((sum, currentMember) => sum + currentMember.shareRatio, 0)

  if (totalRatio <= 0) {
    return 0
  }

  return member.shareRatio / totalRatio
}

function getWeightedWinnerIndex(members: RouletteMember[]) {
  const totalRatio = members.reduce((sum, member) => sum + member.shareRatio, 0)
  const randomPoint = Math.random() * totalRatio

  let cumulativeRatio = 0

  for (let index = 0; index < members.length; index += 1) {
    cumulativeRatio += members[index].shareRatio

    if (randomPoint <= cumulativeRatio) {
      return index
    }
  }

  return members.length - 1
}

function formatGradient(segments: RouletteSegment[]) {
  return `conic-gradient(${segments
    .map((segment) => `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`)
    .join(', ')})`
}

function getLabelPosition(centerAngle: number, radius: number) {
  const angleInRadians = ((centerAngle - 90) * Math.PI) / 180

  return {
    x: Math.cos(angleInRadians) * radius,
    y: Math.sin(angleInRadians) * radius,
  }
}

export default function RouletteBottomSheet({
  groupId,
  nextWeekStartDate,
  groupChoreId,
  onClose,
  onSave,
  onSpin,
}: RouletteBottomSheetProps) {
  const [rouletteMembers, setRouletteMembers] = useState<RouletteMember[]>([])
  const [winner, setWinner] = useState<RouletteMember | null>(null)
  const [rotation, setRotation] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSpinning, setIsSpinning] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function fetchRouletteData() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const [membersResponse, slicesResponse] = await Promise.all([
          getGroupMembers(groupId),
          getRouletteSlices(groupId),
        ])

        setRouletteMembers(buildRouletteMembers(slicesResponse.data, membersResponse.data.members))
      } catch {
        setErrorMessage('룰렛 정보를 불러오지 못했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchRouletteData()
  }, [groupId])

  const rouletteSegments = useMemo(() => {
    let currentAngle = 0

    return rouletteMembers.map((member, index) => {
      const segmentAngle = getNormalizedRatio(member, rouletteMembers) * 360
      const segment: RouletteSegment = {
        ...member,
        color: ROULETTE_COLORS[index % ROULETTE_COLORS.length],
        startAngle: currentAngle,
        endAngle: currentAngle + segmentAngle,
        centerAngle: currentAngle + segmentAngle / 2,
      }

      currentAngle += segmentAngle
      return segment
    })
  }, [rouletteMembers])

  const wheelStyle = useMemo(
    () => ({
      background: formatGradient(rouletteSegments),
      transform: `rotate(${rotation}deg)`,
      transition: isSpinning ? 'transform 3.2s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
    }),
    [isSpinning, rotation, rouletteSegments],
  )

  const handleSpin = async () => {
    if (rouletteMembers.length === 0 || isSpinning) {
      return
    }

    setIsSpinning(true)
    setWinner(null)

    let winnerIndex = -1

    if (onSpin) {
      const winnerId = await onSpin()
      winnerIndex = rouletteMembers.findIndex((member) => member.memberId === winnerId)
    }

    if (winnerIndex < 0 && nextWeekStartDate) {
      try {
        const response = await getRouletteResults(groupId, nextWeekStartDate)
        const targetResult =
          response.data.find((result) => result.groupChoreId === groupChoreId) ??
          response.data.at(-1) ??
          null

        if (targetResult) {
          winnerIndex = rouletteMembers.findIndex((member) => member.memberId === targetResult.winnerId)
        }
      } catch {
        setErrorMessage('룰렛 결과를 불러오지 못했습니다.')
      }
    }

    if (winnerIndex < 0) {
      winnerIndex = getWeightedWinnerIndex(rouletteMembers)
    }

    const nextWinner = rouletteMembers[winnerIndex]
    const targetSegment = rouletteSegments[winnerIndex]
    const spinRotation = 360 * 5 - targetSegment.centerAngle

    setRotation((prevRotation) => prevRotation + spinRotation)

    window.setTimeout(() => {
      setWinner(nextWinner)
      setIsSpinning(false)
    }, 3200)
  }

  const handleSave = () => {
    if (!winner) {
      return
    }

    onSave?.(winner)
    onClose?.()
  }

  return (
    <Layout onClose={onClose}>
      <div className="flex flex-col items-center">
        <div className="flex w-full flex-col items-start">
          <h2 className="text-subtitle font-extrabold leading-[1.5] text-black">룰렛 돌리기</h2>
          <p className="text-body-02 font-medium leading-[1.5] text-gray-08">
            이달의 기여도에 따라 당첨 확률이 달라져요
          </p>
        </div>

        <div className="mt-5 flex min-h-[250px] w-full items-center justify-center">
          {isLoading ? (
            <p className="text-body-02 font-medium leading-[1.5] text-[#999999]">불러오는 중...</p>
          ) : errorMessage ? (
            <p className="text-body-02 font-medium leading-[1.5] text-brand">{errorMessage}</p>
          ) : rouletteMembers.length === 0 ? (
            <p className="text-body-02 font-medium leading-[1.5] text-[#999999]">표시할 멤버가 없어요.</p>
          ) : (
            <div className="relative flex items-center justify-center">
              <div className="absolute top-[-4px] z-20 h-0 w-0 border-x-[10px] border-x-transparent border-t-[22px] border-t-[#2B2B2B]" />
              <div
                className="relative h-[184px] w-[184px] rounded-full shadow-[0_6px_20px_rgba(34,34,34,0.16)]"
                style={wheelStyle}
              >
                {rouletteSegments.map((segment) => {
                  const { x, y } = getLabelPosition(segment.centerAngle, 50)
                  return (
                    <div
                      key={segment.memberId}
                      className="absolute flex w-[72px] -translate-x-1/2 -translate-y-1/2 justify-center text-center text-caption font-bold leading-none text-white"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      {segment.name}
                    </div>
                  )
                })}
                <div className="absolute left-1/2 top-1/2 flex h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(34,34,34,0.18)]">
                  <div className="h-[10px] w-[10px] rounded-full bg-[#E7E7E7]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 flex min-h-[60px] items-center justify-center">
          {winner ? (
            <div className="flex items-center gap-2 rounded-[14px] border border-brand/20 bg-brand/6 px-4 py-3">
              <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-brand text-caption font-extrabold leading-[1.5] text-white">
                {winner.name.slice(0, 1)}
              </div>
              <span className="text-body-01 font-extrabold leading-[1.5] text-[#333333]">{winner.name}</span>
            </div>
          ) : (
            <p className="text-caption font-medium leading-[1.5] text-[#BBBBBB]">당첨자를 뽑아보세요</p>
          )}
        </div>

        <div className="mt-4 flex w-full justify-center">
          <CTAButton
            onClick={winner ? handleSave : handleSpin}
            disabled={isLoading || isSpinning || rouletteMembers.length === 0}
          >
            {isSpinning ? '돌리는 중...' : winner ? '저장하기' : '룰렛 돌리기'}
          </CTAButton>
        </div>
      </div>
    </Layout>
  )
}
