import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Compass, Wallet, User, QrCode, X } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

function QrOverlay({ onClose }) {
  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const [error, setError] = useState('')

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
    ).catch(() => setError('Camera access denied'))
    return () => { scanner.stop().catch(() => {}) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 px-4">
      <div className="flex items-center justify-between w-full max-w-sm">
        <p className="font-display font-bold text-text text-lg">Scan QR Code</p>
        <button onClick={onClose} className="p-2 bg-surface rounded-xl text-text-muted hover:text-text">
          <X size={18} />
        </button>
      </div>
      {error ? (
        <p className="text-coral text-sm text-center">{error}</p>
      ) : (
        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-surface-2">
          <div id="bn-qr-reader" className="w-full" />
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber rounded-br-lg" />
            </div>
          </div>
        </div>
      )}
      <p className="text-text-muted text-sm text-center">Point camera at an Achievo QR code</p>
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
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-bg/95 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
          <Link to="/browse" className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all
            ${active('/browse') || active('/b') ? 'text-amber' : 'text-text-muted'}`}>
            <Compass size={20} />
            <span className="text-[10px] font-medium">Browse</span>
          </Link>

          <button onClick={() => setShowScanner(true)}
            className="flex flex-col items-center -mt-5 relative">
            <div className="w-14 h-14 rounded-2xl bg-amber flex items-center justify-center shadow-[0_0_20px_rgba(245,166,35,0.5)] active:scale-95 transition-all">
              <QrCode size={24} className="text-bg" />
            </div>
            <span className="text-[10px] font-medium text-text-muted mt-1">Scan</span>
          </button>

          <Link to={user ? '/wallet' : '/auth'} className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all
            ${active('/wallet') || active('/profile') ? 'text-amber' : 'text-text-muted'}`}>
            <Wallet size={20} />
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
