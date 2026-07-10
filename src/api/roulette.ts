import { request } from './client'
import type { RouletteResultResponse, RouletteSliceResponse } from '../types/roulette'

export function getRouletteSlices(groupId: number) {
  return request<RouletteSliceResponse[]>(`/api/groups/${groupId}/roulette/slices`, {
    method: 'GET',
  })
}

export function getRouletteResults(groupId: number, nextWeekStartDate: string) {
  return request<RouletteResultResponse[]>(`/api/groups/${groupId}/roulette/results?nextWeekStartDate=${nextWeekStartDate}`, {
    method: 'GET',
  })
}
