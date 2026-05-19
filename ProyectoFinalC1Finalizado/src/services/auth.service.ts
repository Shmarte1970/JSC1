import api from './api'
import type { LoginPayload, RegisterPayload, AuthResponse, User, UpdateProfilePayload } from '@/types'

function normalizeUser(u: any): User {
  return {
    id:    u.id ?? u.userId,
    name:  u.name,
    email: u.email,
  }
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    localStorage.setItem('access_token', data.access_token)
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload)
    localStorage.setItem('access_token', data.access_token)
    return data
  },

  logout(): void {
    localStorage.removeItem('access_token')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<any>('/users/me')
    return normalizeUser(data)
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.patch<any>('/users/me', payload)
    return normalizeUser(data)
  },

  async resetData(): Promise<void> {
    await api.delete('/users/me/reset')
  },

  async loadSeedData(): Promise<void> {
    await api.post('/users/me/seed')
  },
}
