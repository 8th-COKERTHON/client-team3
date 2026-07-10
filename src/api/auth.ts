import { request } from './client'
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignUpRequest,
  SignUpResponse,
} from '../types/auth'

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
