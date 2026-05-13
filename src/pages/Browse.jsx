import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Coffee, UtensilsCrossed, Scissors, Hotel, Dumbbell, ShoppingBag, Award, Zap, QrCode, Hash, X, Camera } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import BottomNav from '../components/BottomNav'

const CATS = [
  { value: '', label: 'All', icon: Zap },
  { value: 'cafe', label: 'Cafés', icon: Coffee },
  { value: 'restaurant', label: 'Restaurants', icon: UtensilsCrossed },
  { value: 'salon', label: 'Salons', icon: Scissors },
  { value: 'hotel', label: 'Hotels', icon: Hotel },
  { value: 'gym', label: 'Gyms', icon: Dumbbell },
  { value: 'retail', label: 'Retail', icon: ShoppingBag },
]

function QrScannerModal({ onClose, onResult }) {
  const scannerRef = useRef(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => {
        scanner.stop().catch(() => {})
        onResult(decodedText)
      },
      () => {}
    ).then(() => setStarted(true))
      .catch(() => setError('Camera access denied. Please allow camera permission and try again.'))

    return () => {
      scanner.stop().catch(() => {})
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm px-4">
      <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-text text-lg">Scan QR Code</h2>
            <p className="text-text-muted text-xs mt-0.5">Point your camera at a business QR code</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        {error ? (
          <div className="bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl p-4 text-center">
            {error}
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-surface-2">
            <div id="qr-reader" className="w-full" />
            {!started && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <Camera size={32} className="animate-pulse" />
                  <p className="text-sm">Starting camera...</p>
                </div>
              </div>
            )}
            {started && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber rounded-br-lg" />
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-text-muted text-xs text-center">
          Or enter a business code manually below
        </p>
      </div>
    </div>
  )
}

function CodeSearchModal({ onClose }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const slug = code.trim().toLowerCase()
    if (!slug) return
    setLoading(true)
    setError('')
    try {
      await api.get(`/businesses/slug/${slug}`)
      navigate(`/b/${slug}`)
      onClose()
    } catch {
      setError('No business found with that code. Check the code and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm px-4">
      <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-text text-lg">Enter Business Code</h2>
            <p className="text-text-muted text-xs mt-0.5">Type the code shown on the business's QR card</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="relative">
            <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="input pl-9 font-mono tracking-wider text-base uppercase"
              placeholder="e.g. karakoy-cafe"
              value={code}
              onChange={e => setCode(e.target.value)}
              autoFocus
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>

          {error && (
            <p className="text-coral text-xs bg-coral/10 border border-coral/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button type="submit" disabled={!code.trim() || loading} className="btn-primary justify-center disabled:opacity-40">
            {loading ? 'Looking up...' : 'Find business'}
          </button>
        </form>

        <div className="border-t border-border pt-3">
          <p className="text-text-muted text-xs text-center">
            The business code is printed on their QR card or loyalty materials
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Browse() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('')
  const [city, setCity] = useState('istanbul')
  const [showScanner, setShowScanner] = useState(false)
  const [showCodeSearch, setShowCodeSearch] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (cat) params.set('category', cat)
    api.get(`/businesses/city/${city}?${params}`).then(r => {
      setBusinesses(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [city, cat, search])

  const handleQrResult = (text) => {
    setShowScanner(false)
    try {
      const url = new URL(text)
      const slug = url.pathname.replace('/b/', '')
      if (slug) navigate(`/b/${slug}`)
    } catch {
      const slug = text.trim().replace('/b/', '')
      if (slug) navigate(`/b/${slug}`)
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {showScanner && <QrScannerModal onClose={() => setShowScanner(false)} onResult={handleQrResult} />}
      {showCodeSearch && <CodeSearchModal onClose={() => setShowCodeSearch(false)} />}

      {/* TOP NAV */}
      <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl bg-bg/90">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-text flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-amber flex items-center justify-center">
              <Award size={12} className="text-bg" />
            </div>
            Achievo
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowScanner(true)} className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
              <QrCode size={13} /> Scan QR
            </button>
            <button onClick={() => setShowCodeSearch(true)} className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
              <Hash size={13} /> Enter code
            </button>
            {user ? (
              <Link to="/wallet" className="badge-amber text-xs">My Wallet</Link>
            ) : (
              <Link to="/auth" className="btn-primary text-xs px-3 py-1.5">Sign in</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-amber" />
            <select value={city} onChange={e => setCity(e.target.value)} className="bg-transparent text-amber font-display font-bold text-sm focus:outline-none cursor-pointer">
              <option value="istanbul">Istanbul</option>
              <option value="ankara">Ankara</option>
            </select>
          </div>
          <h1 className="font-display font-bold text-3xl text-text">Discover & earn rewards</h1>
          <p className="text-text-muted text-sm mt-1">{businesses.length} businesses with active challenges</p>
        </div>

        {/* QUICK ACCESS BANNER */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button onClick={() => setShowScanner(true)}
            className="card p-4 flex items-center gap-3 hover:border-amber/40 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber/20 transition-colors">
              <QrCode size={18} className="text-amber" />
            </div>
            <div className="text-left">
              <p className="font-display font-semibold text-text text-sm">Scan QR Code</p>
              <p className="text-text-muted text-xs">Point camera at any Achievo QR</p>
            </div>
          </button>
          <button onClick={() => setShowCodeSearch(true)}
            className="card p-4 flex items-center gap-3 hover:border-amber/40 transition-all group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber/20 transition-colors">
              <Hash size={18} className="text-amber" />
            </div>
            <div className="text-left">
              <p className="font-display font-semibold text-text text-sm">Enter Code</p>
              <p className="text-text-muted text-xs">Type the business code</p>
            </div>
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="input pl-10"
            placeholder="Search businesses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
                ${cat === c.value ? 'bg-amber text-bg font-bold' : 'bg-surface border border-border text-text-muted hover:border-amber/40 hover:text-text'}`}>
              <c.icon size={13} /> {c.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-surface-2 mb-4" />
                <div className="h-4 bg-surface-2 rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface-2 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-24 text-text-muted">
            <div className="text-4xl mb-4">🏙️</div>
            <p className="font-display font-bold text-text text-lg mb-1">No businesses found</p>
            <p className="text-sm">Try a different category or city</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map(b => (
              <Link key={b.id} to={`/b/${b.slug}`} className="card-hover p-5 group block">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-xl flex-shrink-0">
                    {b.logo_url ? <img src={b.logo_url} className="w-full h-full object-cover rounded-xl" alt="" /> : '🏪'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-text text-sm truncate">{b.name}</p>
                    <p className="text-text-muted text-xs mt-0.5 capitalize">{b.category}</p>
                    <p className="text-text-faint text-xs mt-0.5 font-mono">{b.slug}</p>
                  </div>
                </div>
                {b.description && (
                  <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2">{b.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="badge-amber text-xs">{b.challenge_count} challenge{b.challenge_count !== '1' ? 's' : ''}</span>
                  <span className="text-xs text-amber opacity-0 group-hover:opacity-100 transition-opacity font-medium">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
