import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
            { refreshToken: refresh }
          )
          localStorage.setItem('token', data.token)
          err.config.headers.Authorization = `Bearer ${data.token}`
          return api.request(err.config)
        } catch {
          localStorage.clear()
          window.location.href = '/auth'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
