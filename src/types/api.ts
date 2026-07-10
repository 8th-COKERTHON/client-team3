export interface ApiResponse<T> {
  success: boolean
  status: number
  code: string
  message: string
  data: T
  timestamp: string
  reasons?: Record<string, string>
}

export class ApiError extends Error {
  status: number
  code: string
  reasons?: Record<string, string>

  constructor(response: Pick<ApiResponse<unknown>, 'status' | 'code' | 'message' | 'reasons'>) {
    super(response.message)
    this.name = 'ApiError'
    this.status = response.status
    this.code = response.code
    this.reasons = response.reasons
  }
}
