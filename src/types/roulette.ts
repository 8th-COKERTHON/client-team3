export interface RouletteSliceResponse {
  memberId: number
  shareRatio: number
}

export interface RouletteResultResponse {
  id: number
  winnerId: number
  groupChoreId: number
  nextWeekStartDate: string
}

export interface RouletteMember {
  memberId: number
  name: string
  shareRatio: number
}
