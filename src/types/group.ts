export interface GroupCreateRequest {
  groupName: string
}

export interface GroupCreateResponse {
  groupId: number
  groupName: string
  inviteCode: string
}

export interface GroupJoinRequest {
  inviteCode: string
}

export interface GroupJoinResponse {
  groupId: number
  groupName: string
}

export interface GroupMember {
  memberId: number
  name: string
}

export interface GroupMembersResponse {
  groupName: string
  members: GroupMember[]
}

export interface GroupInviteCodeResponse {
  groupId: number
  inviteCode: string
}
