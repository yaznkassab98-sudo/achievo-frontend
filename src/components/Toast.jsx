import { useEffect, useState } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'
import useToastStore from '../store/useToastStore'

const CONFIGS = {
  success: { icon: Check, bg: 'bg-green-stamp/10 border-green-stamp/30', text: 'text-green-stamp', iconBg: 'bg-green-stamp/20' },
  error:   { icon: AlertCircle, bg: 'bg-coral/10 border-coral/30', text: 'text-coral', iconBg: 'bg-coral/20' },
  info:    { icon: Info, bg: 'bg-amber/10 border-amber/30', text: 'text-amber', iconBg: 'bg-amber/20' },
}

function ToastItem({ toast }) {
  const [visible, setVisible] = useState(false)
  const dismiss = useToastStore(s => s.dismiss)
  const cfg = CONFIGS[toast.type] || CONFIGS.info
  const Icon = cfg.icon

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm shadow-lg
        transition-all duration-300 ${cfg.bg}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
        <Icon size={14} className={cfg.text} />
      </div>
      <p className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</p>
      <button onClick={() => dismiss(toast.id)} className={`${cfg.text} opacity-60 hover:opacity-100 transition-opacity`}>
        <X size={14} />
      </button>
    </div>
  )
}

export default function Toast() {
  const toasts = useToastStore(s => s.toasts)
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  )
}
