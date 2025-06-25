import { defineStore } from 'pinia'
import type { User, LoginResponse } from '../types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: {} as User,
    isAuthenticated: false,
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      this.isAuthenticated = !!token
    },
    setUser(user: User) {
      this.user = user
    },
    /* login(token: string, user: User) {
      this.setToken(token)
      this.setUser(user)

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }, */
    async login(username: string, password: string) {
      try {
        const response = await this.authenticateUser(username, password)

        if (response.success) {
          const { token, user } = response.data || {}
          console.log(token)
          console.log(user)

          this.setToken(token || '')
          this.setUser(user || ({} as User))

          localStorage.setItem('token', token || '')
          localStorage.setItem('user', JSON.stringify(user || {}))

          return { success: true, data: response.data }
        } else {
          return { success: false, error: response.error }
        }
      } catch (error) {
        console.error('Login failed:', error)
        return { success: false, error: 'Login failed. Please try again.' }
      }
    },

    async authenticateUser(username: string, password: string) {
      return new Promise<LoginResponse>((resolve) => {
        const user = localStorage.getItem('user')
        const userData = JSON.parse(user || '{}')

        setTimeout(() => {
          if (username === 'admin' && password === userData?.password) {
            resolve({
              success: true,
              data: {
                token: '12312312412413123123',
                user: {
                  id: 1,
                  username: username,
                  password: userData?.password,
                  email: userData?.email,
                },
              },
            })
          } else {
            resolve({
              success: false,
              error: 'Invalid username or password',
            })
          }
        }, 1000)
      })
    },
    async changePassword(newPassword: string) {
      const user = localStorage.getItem('user')
      console.log(user)
      if (user) {
        const userData = JSON.parse(user)
        userData.password = newPassword
        console.log(userData.password)
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true }
      }
      return { success: false, error: 'User not Found!' }
    },
    logout() {
      this.token = ''
      this.user = {} as User
      this.isAuthenticated = false

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('admin')
    },
    initializeAuth() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        this.setToken(token)
        this.setUser(JSON.parse(user))
      }
    },
  },
})
