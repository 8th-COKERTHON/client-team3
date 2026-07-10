export interface AuthUser {
  id: number
  nickname: string
  loginId: string
  groupIds: number[]
}

export interface SignUpRequest {
  name: string
  loginId: string
  password: string
  passwordCheck: string
}

export interface LoginRequest {
  loginId: string
  password: string
}

export type SignUpResponse = AuthUser

export type LoginResponse = AuthUser

export type LogoutResponse = string
