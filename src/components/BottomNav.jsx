import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import { IcCompass, IcWallet, IcQr, IcX, IcCamera } from './Icons'
import useAuthStore from '../store/useAuthStore'

function QrOverlay({ onClose }) {
  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('bn-qr-reader')
    scannerRef.current = scanner
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 200, height: 200 } },
      (text) => {
        scanner.stop().catch(() => {})
        onClose()
        try {
          const url = new URL(text)
          const slug = url.pathname.replace('/b/', '')
          if (slug) navigate(`/b/${slug}`)
        } catch {
          const slug = text.trim().replace('/b/', '')
          if (slug) navigate(`/b/${slug}`)
        }
      },
      () => {}
    ).then(() => setStarted(true)).catch(() => setError('Camera access denied'))
    return () => { scanner.stop().catch(() => {}) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-bg/96 backdrop-blur-md flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <p className="font-display font-black text-text text-lg" style={{ letterSpacing: '-0.02em' }}>Scan QR Code</p>
        <button onClick={onClose} className="p-2.5 bg-surface border border-border rounded-xl text-text-muted hover:text-text transition-colors">
          <IcX size={18} />
        </button>
      </div>

      {error ? (
        <div className="bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl px-4 py-3 max-w-sm w-full text-center">
          {error}
        </div>
      ) : (
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-surface-2 border border-border">
          <div id="bn-qr-reader" className="w-full" />
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IcCamera size={32} className="text-text-faint animate-pulse" />
            </div>
          )}
          {started && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-44 relative">
                <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-amber rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-amber rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-amber rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-amber rounded-br-lg" />
              </div>
            </div>
          )}
        </div>
      )}
      <p className="text-text-muted text-sm">Point camera at an Achievo QR code</p>
    </div>
  )
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const [showScanner, setShowScanner] = useState(false)

  const active = (path) => pathname === path || pathname.startsWith(path + '/')

  return (
    <>
      {showScanner && <QrOverlay onClose={() => setShowScanner(false)} />}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-bg/95 backdrop-blur-2xl md:hidden">
        <div className="flex items-center justify-around px-4 py-3 max-w-md mx-auto pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link to="/browse" className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all
            ${active('/browse') || active('/b') ? 'text-amber' : 'text-text-muted'}`}>
            <IcCompass size={21} />
            <span className="text-[10px] font-display font-bold">Browse</span>
          </Link>

          <button onClick={() => setShowScanner(true)} className="flex flex-col items-center -mt-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-amber flex items-center justify-center active:scale-95 transition-all"
              style={{ boxShadow: '0 0 24px rgba(245,166,35,0.45)' }}>
              <IcQr size={24} className="text-bg" />
            </div>
            <span className="text-[10px] font-display font-bold text-text-muted mt-1.5">Scan</span>
          </button>

          <Link to={user ? '/wallet' : '/auth'} className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all
            ${active('/wallet') || active('/profile') ? 'text-amber' : 'text-text-muted'}`}>
            <IcWallet size={21} />
            <span className="text-[10px] font-display font-bold">Wallet</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
