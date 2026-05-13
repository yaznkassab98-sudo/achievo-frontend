import { useEffect, useState } from 'react'
import { IcCheck, IcX, IcAlert, IcInfo } from './Icons'
import useToastStore from '../store/useToastStore'

const CONFIGS = {
  success: { Icon: IcCheck, bg: 'bg-green-stamp/10 border-green-stamp/30', text: 'text-green-stamp', dot: 'bg-green-stamp' },
  error:   { Icon: IcAlert, bg: 'bg-coral/10 border-coral/30',             text: 'text-coral',       dot: 'bg-coral'       },
  info:    { Icon: IcInfo,  bg: 'bg-amber/10 border-amber/30',             text: 'text-amber',       dot: 'bg-amber'       },
}

function ToastItem({ toast }) {
  const [visible, setVisible] = useState(false)
  const dismiss = useToastStore(s => s.dismiss)
  const cfg = CONFIGS[toast.type] || CONFIGS.info
  const { Icon } = cfg

  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-xl
      transition-all duration-300 ${cfg.bg} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.dot}/20`}>
        <Icon size={13} className={cfg.text} />
      </div>
      <p className={`text-sm font-medium flex-1 ${cfg.text}`}>{toast.message}</p>
      <button onClick={() => dismiss(toast.id)} className={`${cfg.text} opacity-50 hover:opacity-100 transition-opacity`}>
        <IcX size={13} />
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
