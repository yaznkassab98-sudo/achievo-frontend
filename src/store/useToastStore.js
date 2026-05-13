import { create } from 'zustand'

let id = 0

const useToastStore = create((set) => ({
  toasts: [],

  toast: (message, type = 'success', duration = 3500) => {
    const toastId = ++id
    set(s => ({ toasts: [...s.toasts, { id: toastId, message, type }] }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== toastId) }))
    }, duration)
  },

  dismiss: (toastId) => set(s => ({ toasts: s.toasts.filter(t => t.id !== toastId) })),
}))

export default useToastStore
