import { request } from './client'
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
} from '../types/auth'

const USER_NICKNAME_STORAGE_KEY = 'userNickname'

// 회원가입
export function signUp(payload: SignUpRequest) {
  return request<SignUpResponse>('/api/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

// 로그인
export function login(payload: LoginRequest) {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
}

// 로그아웃
export function logout() {
  return request<LogoutResponse>('/api/auth/logout', {
    method: 'POST',
  })
}

export function saveAuthUser(user: AuthUser) {
  window.localStorage.setItem(USER_NICKNAME_STORAGE_KEY, user.nickname)
}

export function getSavedUserNickname() {
  return window.localStorage.getItem(USER_NICKNAME_STORAGE_KEY)
}

export function clearSavedAuthUser() {
  window.localStorage.removeItem(USER_NICKNAME_STORAGE_KEY)
}
