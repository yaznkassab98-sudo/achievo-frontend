import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import {
  IcSearch, IcMapPin, IcCoffee, IcFood, IcScissors, IcBuilding,
  IcDumbbell, IcBag, IcAward, IcZap, IcQr, IcHash, IcX, IcCamera, IcArrowRight,
} from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import BottomNav from '../components/BottomNav'

const CATS = [
  { value: '',           label: 'All',         icon: IcZap },
  { value: 'cafe',       label: 'Cafés',        icon: IcCoffee },
  { value: 'restaurant', label: 'Restaurants',  icon: IcFood },
  { value: 'salon',      label: 'Salons',       icon: IcScissors },
  { value: 'hotel',      label: 'Hotels',       icon: IcBuilding },
  { value: 'gym',        label: 'Gyms',         icon: IcDumbbell },
  { value: 'retail',     label: 'Retail',       icon: IcBag },
]

const CAT_ACCENTS = {
  cafe: '#F5A623', restaurant: '#FF5C3A', salon: '#A78BFA',
  hotel: '#38BDF8', gym: '#22C55E', retail: '#F472B6', '': '#F5A623',
}

function QrModal({ onClose, onResult }) {
  const scannerRef = useRef(null)
  const [error, setError] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (text) => { scanner.stop().catch(() => {}); onResult(text) },
      () => {}
    ).then(() => setStarted(true))
      .catch(() => setError('Camera access denied. Please allow camera permissions.'))
    return () => { scanner.stop().catch(() => {}) }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-text text-lg">Scan QR Code</h2>
            <p className="text-text-muted text-xs mt-0.5">Point at any Achievo QR code</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text transition-colors rounded-xl hover:bg-surface-2">
            <IcX size={18} />
          </button>
        </div>
        {error ? (
          <div className="bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl p-4 text-center">{error}</div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-surface-2">
            <div id="qr-reader" className="w-full" />
            {!started && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <IcCamera size={28} className="animate-pulse" />
                  <p className="text-sm">Starting camera...</p>
                </div>
              </div>
            )}
            {started && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 relative">
                  <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-amber rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-amber rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-amber rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-amber rounded-br-lg" />
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-text-muted text-xs text-center">Or enter a business code manually in Browse</p>
      </div>
    </div>
  )
}

function CodeModal({ onClose }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const slug = code.trim().toLowerCase()
    if (!slug) return
    setLoading(true); setError('')
    try {
      await api.get(`/businesses/slug/${slug}`)
      navigate(`/b/${slug}`); onClose()
    } catch {
      setError('No business found with that code.'); setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-text text-lg">Enter Business Code</h2>
            <p className="text-text-muted text-xs mt-0.5">From their QR card or loyalty materials</p>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-surface-2 transition-colors">
            <IcX size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="relative">
            <IcHash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input className="input pl-9 font-mono tracking-wider text-base" placeholder="karakoy-cafe"
              value={code} onChange={e => setCode(e.target.value)} autoFocus autoCapitalize="off" spellCheck={false} />
          </div>
          {error && <p className="text-coral text-xs bg-coral/10 border border-coral/20 rounded-xl px-3 py-2">{error}</p>}
          <button type="submit" disabled={!code.trim() || loading} className="btn-primary justify-center disabled:opacity-40">
            {loading ? 'Looking up...' : 'Find business'}
          </button>
        </form>
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
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (cat) params.set('category', cat)
    api.get(`/businesses/city/${city}?${params}`).then(r => {
      setBusinesses(r.data); setLoading(false)
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
    <div className="min-h-screen pb-28">
      {showScanner && <QrModal onClose={() => setShowScanner(false)} onResult={handleQrResult} />}
      {showCode && <CodeModal onClose={() => setShowCode(false)} />}

      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-2xl bg-bg/90">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-md bg-amber flex items-center justify-center">
              <IcAward size={12} className="text-bg" />
            </div>
            <span className="font-display font-black text-text hidden sm:block" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </Link>

          <div className="relative flex-1 max-w-sm">
            <IcSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input className="input pl-9 h-9 text-sm" placeholder="Search businesses..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowScanner(true)} className="btn-secondary text-xs px-3 py-1.5 gap-1.5 hidden sm:inline-flex">
              <IcQr size={13} /> Scan
            </button>
            <button onClick={() => setShowCode(true)} className="btn-secondary text-xs px-3 py-1.5 gap-1.5 hidden sm:inline-flex">
              <IcHash size={13} /> Code
            </button>
            {user
              ? <Link to="/wallet" className="badge-amber text-xs">Wallet</Link>
              : <Link to="/auth" className="btn-primary text-xs px-3 py-1.5">Sign in</Link>
            }
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IcMapPin size={14} className="text-amber" />
              <select value={city} onChange={e => setCity(e.target.value)}
                className="bg-transparent text-amber font-display font-black text-sm focus:outline-none cursor-pointer" style={{ letterSpacing: '-0.01em' }}>
                <option value="istanbul">Istanbul</option>
                <option value="ankara">Ankara</option>
              </select>
            </div>
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.035em', lineHeight: 1 }}>
              Discover & earn
            </h1>
            <p className="text-text-muted text-sm mt-1.5">{businesses.length} businesses with active challenges</p>
          </div>

          {/* Mobile quick actions */}
          <div className="flex gap-2 sm:hidden">
            <button onClick={() => setShowScanner(true)} className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted active:scale-95 transition-all">
              <IcQr size={17} />
            </button>
            <button onClick={() => setShowCode(true)} className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted active:scale-95 transition-all">
              <IcHash size={17} />
            </button>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 hide-scrollbar">
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-display font-bold whitespace-nowrap transition-all flex-shrink-0
                ${cat === c.value
                  ? 'text-bg'
                  : 'bg-surface border border-border text-text-muted hover:text-text hover:border-border-2'}`}
              style={cat === c.value ? { backgroundColor: CAT_ACCENTS[c.value] || '#F5A623', borderColor: 'transparent' } : {}}>
              <c.icon size={13} className={cat === c.value ? 'text-bg' : ''} />
              {c.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse h-44">
                <div className="w-10 h-10 rounded-xl bg-surface-2 mb-4" />
                <div className="h-4 bg-surface-2 rounded w-3/4 mb-2" />
                <div className="h-3 bg-surface-2 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-24 text-text-muted">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-5">
              <IcMapPin size={24} className="text-text-faint" />
            </div>
            <p className="font-display font-bold text-text text-lg mb-1">No businesses found</p>
            <p className="text-sm">Try a different category or city</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {businesses.map(b => {
              const accent = CAT_ACCENTS[b.category] || '#F5A623'
              return (
                <Link key={b.id} to={`/b/${b.slug}`} className="card-hover group block">
                  {/* Color strip */}
                  <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: accent, opacity: 0.7 }} />

                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-lg flex-shrink-0 border border-border"
                        style={{ background: `${accent}18`, color: accent }}>
                        {b.logo_url
                          ? <img src={b.logo_url} className="w-full h-full object-cover rounded-xl" alt="" />
                          : (b.name?.[0] || '?')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-display font-bold text-text text-sm truncate">{b.name}</p>
                        <p className="text-text-muted text-xs mt-0.5 capitalize">{b.category}</p>
                        <p className="text-text-faint text-[10px] font-mono mt-0.5">{b.slug}</p>
                      </div>
                    </div>

                    {b.description && (
                      <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-2">{b.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="badge text-xs px-2.5 py-1 font-display font-bold"
                        style={{ backgroundColor: `${accent}15`, color: accent, borderColor: `${accent}30`, border: '1px solid' }}>
                        {b.challenge_count} challenge{b.challenge_count !== '1' ? 's' : ''}
                      </span>
                      <span className="text-xs text-text-muted font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <IcArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  )
}
