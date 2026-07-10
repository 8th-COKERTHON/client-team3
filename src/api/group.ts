import type {
  GroupChoreReportResponse,
  GroupCreateRequest,
  GroupCreateResponse,
  GroupInviteCodeResponse,
  GroupJoinRequest,
  GroupJoinResponse,
  GroupMembersResponse,
} from '../types/group'
import { request } from './client'

const GROUP_ID_STORAGE_KEY = 'groupId'

export function createGroup(payload: GroupCreateRequest) {
  return request<GroupCreateResponse>('/api/groups', {
    method: 'POST',
    body: payload,
  })
}

export function joinGroup(payload: GroupJoinRequest) {
  return request<GroupJoinResponse>('/api/groups/join', {
    method: 'POST',
    body: payload,
  })
}

export function getGroupMembers(groupId: number) {
  return request<GroupMembersResponse>(`/api/groups/${groupId}/members`, {
    method: 'GET',
  })
}

export function getGroupInviteCode(groupId: number) {
  return request<GroupInviteCodeResponse>(`/api/groups/${groupId}/invite-code`, {
    method: 'GET',
  })
}

export function getGroupChoreReport(groupId: number, targetWeek: string) {
  return request<GroupChoreReportResponse>(
    `/api/groups/${groupId}/chore-report?targetWeek=${targetWeek}`,
    {
      method: 'GET',
    },
  )
}

export function saveGroupId(groupId: number) {
  window.localStorage.setItem(GROUP_ID_STORAGE_KEY, String(groupId))
}

export function getSavedGroupId() {
  const value = window.localStorage.getItem(GROUP_ID_STORAGE_KEY)

  if (!value) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isNaN(parsedValue) ? null : parsedValue
}

export function clearSavedGroupId() {
  window.localStorage.removeItem(GROUP_ID_STORAGE_KEY)
}
