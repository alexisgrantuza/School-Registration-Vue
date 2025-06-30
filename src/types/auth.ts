export interface User {
  id?: number
  username: string
  password?: string
  email?: string
}

export interface LoginResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  error?: string
}

export interface ChangePasswordResponse {
  success?: boolean
  error?: string
  username: string
  password: string
  confirmPassword: string
}
