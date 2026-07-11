import { ApiError, type ApiResponse } from '../types/api'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL ?? '')
  : ''

export async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const result = (await response.json()) as ApiResponse<T>

  if (!response.ok || !result.success) {
    throw new ApiError(result)
  }

  return result
}
