import { create } from 'zustand'
import api from '../api/client'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      set({ user: data.user, token: data.token, loading: false })
      return data.user
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  signup: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/signup', payload)
      set({ loading: false })
      return data
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  verifyOtp: async (userId, code) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/verify-otp', { userId, code })
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
      set({ user: data.user, token: data.token, loading: false })
      return data.user
    } catch (err) {
      set({ loading: false })
      throw err
    }
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data })
    } catch {
      localStorage.clear()
      set({ user: null, token: null })
    }
  },

  logout: () => {
    localStorage.clear()
    set({ user: null, token: null })
  },
}))

export default useAuthStore
