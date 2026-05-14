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
  cafe: '#FF8A3D', restaurant: '#FF5C3A', salon: '#A78BFA',
  hotel: '#38BDF8', gym: '#22C55E', retail: '#F472B6', '': '#2767FF',
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
                  <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-blue rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-blue rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-blue rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-blue rounded-br-lg" />
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
  const [city, setCity] = useState('')
  const [cities, setCities] = useState([])
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    api.get('/cities').then(r => {
      setCities(r.data)
      if (user?.city_id && !city) {
        const match = r.data.find(c => c.id === user.city_id)
        if (match) setCity(match.slug)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (cat) params.set('category', cat)
    const url = city
      ? `/businesses/city/${city}?${params}`
      : `/businesses?${params}`
    api.get(url).then(r => {
      setBusinesses(r.data); setLoading(false)
    }).catch(() => setLoading(false))
  }, [city, cat, search])

  const selectedCityName = cities.find(c => c.slug === city)?.name || null
  const filteredCities = cities.filter(c =>
    !citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase()) || c.country?.toLowerCase().includes(citySearch.toLowerCase())
  )
  const countriesInResults = [...new Set(filteredCities.map(c => c.country).filter(Boolean))]

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
            <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
              <IcAward size={12} className="text-white" />
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
              ? <Link to="/wallet" className="badge-blue text-xs">Wallet</Link>
              : <Link to="/auth" className="btn-primary text-xs px-3 py-1.5">Sign in</Link>
            }
          </div>
        </div>
      </nav>

      {/* CITY PICKER MODAL */}
      {showCityPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          onClick={e => { if (e.target === e.currentTarget) { setShowCityPicker(false); setCitySearch('') } }}>
          <div className="card w-full max-w-sm flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-text">Choose a city</h2>
                <button onClick={() => { setShowCityPicker(false); setCitySearch('') }} className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-surface-2 transition-colors">
                  <IcX size={16} />
                </button>
              </div>
              <div className="relative">
                <IcSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input className="input pl-9 h-9 text-sm" placeholder="Search cities or countries..."
                  value={citySearch} onChange={e => setCitySearch(e.target.value)} autoFocus />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <button onClick={() => { setCity(''); setShowCityPicker(false); setCitySearch('') }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors border-b border-border ${!city ? 'bg-blue/5' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${!city ? 'bg-blue/10' : 'bg-surface-2'}`}>
                  <IcZap size={14} className={!city ? 'text-blue' : 'text-text-muted'} />
                </div>
                <div>
                  <p className={`text-sm font-display font-bold ${!city ? 'text-blue' : 'text-text'}`}>Everywhere</p>
                  <p className="text-xs text-text-muted">All cities worldwide</p>
                </div>
                {!city && <div className="ml-auto w-2 h-2 rounded-full bg-blue" />}
              </button>
              {countriesInResults.length > 0 ? countriesInResults.map(country => (
                <div key={country}>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-display font-black uppercase tracking-[0.1em] text-text-faint">{country}</p>
                  {filteredCities.filter(c => c.country === country).map(c => (
                    <button key={c.id} onClick={() => { setCity(c.slug); setShowCityPicker(false); setCitySearch('') }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 transition-colors ${city === c.slug ? 'bg-blue/5' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${city === c.slug ? 'bg-blue/10' : 'bg-surface-2'}`}>
                        <IcMapPin size={13} className={city === c.slug ? 'text-blue' : 'text-text-muted'} />
                      </div>
                      <p className={`text-sm font-medium ${city === c.slug ? 'text-blue font-bold' : 'text-text'}`}>{c.name}</p>
                      {city === c.slug && <div className="ml-auto w-2 h-2 rounded-full bg-blue" />}
                    </button>
                  ))}
                </div>
              )) : (
                filteredCities.map(c => (
                  <button key={c.id} onClick={() => { setCity(c.slug); setShowCityPicker(false); setCitySearch('') }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 transition-colors ${city === c.slug ? 'bg-blue/5' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${city === c.slug ? 'bg-blue/10' : 'bg-surface-2'}`}>
                      <IcMapPin size={13} className={city === c.slug ? 'text-blue' : 'text-text-muted'} />
                    </div>
                    <p className={`text-sm font-medium ${city === c.slug ? 'text-blue font-bold' : 'text-text'}`}>{c.name}</p>
                    {city === c.slug && <div className="ml-auto w-2 h-2 rounded-full bg-blue" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <button onClick={() => setShowCityPicker(true)}
              className="flex items-center gap-1.5 mb-2 group hover:opacity-80 transition-opacity">
              <IcMapPin size={14} className="text-blue" />
              <span className="font-display font-black text-blue text-sm" style={{ letterSpacing: '-0.01em' }}>
                {selectedCityName || 'Everywhere'}
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-blue opacity-60">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
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
              const accent = CAT_ACCENTS[b.category] || '#2767FF'
              return (
                <Link key={b.id} to={`/b/${b.slug}`} className="group block rounded-2xl bg-white border border-border overflow-hidden transition-all duration-300"
                  style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${accent}1E, 0 4px 12px rgba(17,24,39,0.08)`; e.currentTarget.style.borderColor = `${accent}30` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(17,24,39,0.06)'; e.currentTarget.style.borderColor = '' }}>

                  {/* Header zone */}
                  <div className="h-28 relative overflow-hidden flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)` }}>
                    {b.cover_url
                      ? <img src={b.cover_url} className="w-full h-full object-cover" alt="" />
                      : (
                        <>
                          <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
                            <defs><pattern id={`p-${b.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                              <circle cx="1" cy="1" r="1" fill={accent} />
                            </pattern></defs>
                            <rect width="100%" height="100%" fill={`url(#p-${b.id})`} />
                          </svg>
                          <div className="absolute right-4 bottom-2 font-display font-black opacity-[0.07] select-none"
                            style={{ fontSize: '5rem', lineHeight: 1, color: accent, letterSpacing: '-0.05em' }}>
                            {b.name?.[0] || '?'}
                          </div>
                        </>
                      )
                    }
                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] font-display font-bold px-2.5 py-1 rounded-full"
                        style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}35` }}>
                        {b.challenge_count} {b.challenge_count !== '1' ? 'challenges' : 'challenge'}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-4 pb-4">
                    <div className="flex items-end justify-between -mt-5 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-xl overflow-hidden flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${accent}28, ${accent}14)`, color: accent, border: '2.5px solid white', boxShadow: `0 2px 10px ${accent}28` }}>
                        {b.logo_url ? <img src={b.logo_url} className="w-full h-full object-cover" alt="" /> : (b.name?.[0] || '?')}
                      </div>
                      <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-200 flex items-center gap-1 font-semibold pb-1">
                        Explore <IcArrowRight size={10} />
                      </span>
                    </div>

                    <p className="font-display font-black text-text leading-tight mb-1 truncate" style={{ fontSize: '1.05rem', letterSpacing: '-0.025em' }}>
                      {b.name}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                      <p className="text-text-muted text-xs capitalize">{b.category || 'Local Business'}</p>
                      {b.city_name && <span className="text-text-faint text-xs">· {b.city_name}</span>}
                    </div>

                    {b.description && (
                      <p className="text-text-muted text-xs leading-relaxed mt-2.5 line-clamp-2">{b.description}</p>
                    )}
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
