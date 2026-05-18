import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Html5Qrcode } from 'html5-qrcode'
import {
  IcSearch, IcMapPin, IcCoffee, IcFood, IcScissors, IcBuilding,
  IcDumbbell, IcBag, IcAward, IcZap, IcQr, IcHash, IcX, IcCamera,
  IcArrowRight, IcGlobe, IcGift, IcStar,
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

const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

const createPinIcon = (b, selected = false) => {
  const accent = CAT_ACCENTS[b.category] || '#2767FF'
  const size = selected ? 46 : 36
  const inner = selected ? 18 : 14
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);background:${accent};
      border:2.5px solid white;
      box-shadow:0 4px 14px ${accent}70,0 2px 6px rgba(0,0,0,0.25);
      display:flex;align-items:center;justify-content:center;
      transition:all .15s;
    "><span style="
      transform:rotate(45deg);color:white;font-weight:900;
      font-size:${inner}px;font-family:system-ui,sans-serif;line-height:1;
    ">${b.logo_url
        ? `<img src="${b.logo_url}" style="width:${inner+4}px;height:${inner+4}px;border-radius:50%;object-fit:cover;transform:rotate(45deg)" />`
        : b.name[0].toUpperCase()
      }</span></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size - 4],
  })
}

const createUserIcon = () => L.divIcon({
  html: `<div style="
    width:18px;height:18px;border-radius:50%;background:#2767FF;
    border:3px solid white;box-shadow:0 0 0 4px rgba(39,103,255,0.3),0 3px 10px rgba(39,103,255,0.5);
  "></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function FlyController({ target }) {
  const map = useMap()
  const prev = useRef(null)
  useEffect(() => {
    if (!target) return
    const key = `${target.lat},${target.lng},${target.zoom}`
    if (prev.current === key) return
    prev.current = key
    map.flyTo([target.lat, target.lng], target.zoom || 13, { duration: 1.2 })
  }, [target])
  return null
}

function MapBoundsTracker({ onBoundsChange }) {
  useMapEvents({
    moveend(e) { onBoundsChange(e.target.getBounds()) },
    zoomend(e) { onBoundsChange(e.target.getBounds()) },
  })
  return null
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
    ).then(() => setStarted(true)).catch(() => setError('Camera access denied.'))
    return () => { scanner.stop().catch(() => {}) }
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div><h2 className="font-display font-bold text-text text-lg">Scan QR Code</h2>
            <p className="text-text-muted text-xs mt-0.5">Point at any Achievo QR code</p></div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-surface-2"><IcX size={18} /></button>
        </div>
        {error ? (
          <div className="bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl p-4 text-center">{error}</div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-surface-2">
            <div id="qr-reader" className="w-full" />
            {!started && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-text-muted">
                  <IcCamera size={28} className="animate-pulse" /><p className="text-sm">Starting camera...</p>
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
    try { await api.get(`/businesses/slug/${slug}`); navigate(`/b/${slug}`); onClose() }
    catch { setError('No business found with that code.'); setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="card w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div><h2 className="font-display font-bold text-text text-lg">Enter Business Code</h2>
            <p className="text-text-muted text-xs mt-0.5">From their QR card or loyalty materials</p></div>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text rounded-xl hover:bg-surface-2"><IcX size={18} /></button>
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

function BusinessCard({ b, compact = false }) {
  const accent = CAT_ACCENTS[b.category] || '#2767FF'
  return (
    <Link to={`/b/${b.slug}`}
      className="group flex items-center gap-3 px-4 py-3.5 hover:bg-surface-2 transition-colors border-b border-border last:border-0">
      <div className="w-11 h-11 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center font-display font-black text-lg"
        style={{ background: `linear-gradient(135deg,${accent}28,${accent}12)`, color: accent, border: `1.5px solid ${accent}20` }}>
        {b.logo_url ? <img src={b.logo_url} className="w-full h-full object-cover" alt="" /> : b.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-text text-sm truncate" style={{ letterSpacing: '-0.015em' }}>{b.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {b.distance != null && (
            <span className="text-xs text-blue font-semibold">{b.distance < 1 ? `${Math.round(b.distance*1000)}m` : `${b.distance.toFixed(1)}km`}</span>
          )}
          {b.distance != null && <span className="text-text-faint text-xs">·</span>}
          <span className="text-xs text-text-muted capitalize">{b.category || 'local'}</span>
          {b.city_name && <><span className="text-text-faint text-xs">·</span><span className="text-xs text-text-muted">{b.city_name}</span></>}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {parseInt(b.challenge_count) > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${accent}18`, color: accent }}>
            {b.challenge_count} {parseInt(b.challenge_count) === 1 ? 'challenge' : 'challenges'}
          </span>
        )}
        <IcArrowRight size={12} className="text-text-faint group-hover:text-text-muted transition-colors" />
      </div>
    </Link>
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
  const [country, setCountry] = useState('')
  const [cities, setCities] = useState([])
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [citySearch, setCitySearch] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [sort, setSort] = useState('')
  const [hasChallenge, setHasChallenge] = useState(false)

  const [userLocation, setUserLocation] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)
  const [mapBounds, setMapBounds] = useState(null)
  const [geoSearch, setGeoSearch] = useState('')
  const [geoSearching, setGeoSearching] = useState(false)
  const [selectedBizId, setSelectedBizId] = useState(null)
  const [showCountryPicker, setShowCountryPicker] = useState(false)

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
    if (country) params.set('country', country)
    if (sort) params.set('sort', sort)
    if (hasChallenge) params.set('hasChallenge', '1')
    const url = city ? `/businesses/city/${city}?${params}` : `/businesses?${params}`
    api.get(url).then(r => { setBusinesses(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [city, cat, search, country, sort, hasChallenge])

  useEffect(() => {
    if (city && viewMode === 'map') {
      const found = cities.find(c => c.slug === city)
      if (found?.latitude && found?.longitude) {
        setFlyTarget({ lat: found.latitude, lng: found.longitude, zoom: 12 })
      }
    }
  }, [city, viewMode, cities])

  const selectedCityName = cities.find(c => c.slug === city)?.name || null
  const filteredCities = cities.filter(c =>
    !citySearch || c.name.toLowerCase().includes(citySearch.toLowerCase()) || c.country?.toLowerCase().includes(citySearch.toLowerCase())
  )
  const countriesInResults = [...new Set(filteredCities.map(c => c.country).filter(Boolean))]
  const allCountries = useMemo(() => [...new Set(cities.map(c => c.country).filter(Boolean))].sort(), [cities])

  const selectedCountryName = country || null

  const mappable = useMemo(() =>
    businesses.filter(b => b.latitude && b.longitude),
    [businesses]
  )

  const visibleOnMap = useMemo(() => {
    if (!mapBounds) return mappable
    return mappable.filter(b =>
      mapBounds.contains([b.latitude, b.longitude])
    )
  }, [mappable, mapBounds])

  const bizWithDistance = useMemo(() => {
    if (!userLocation) return businesses
    return businesses.map(b => {
      if (!b.latitude || !b.longitude) return b
      return { ...b, distance: haversine(userLocation.lat, userLocation.lng, b.latitude, b.longitude) }
    }).sort((a, b) => {
      if (a.distance == null && b.distance == null) return 0
      if (a.distance == null) return 1
      if (b.distance == null) return -1
      return a.distance - b.distance
    })
  }, [businesses, userLocation])

  const sidebarBizs = useMemo(() => {
    const base = userLocation ? bizWithDistance : businesses
    if (!mapBounds) return base
    return base.filter(b => !b.latitude || !b.longitude || mapBounds.contains([b.latitude, b.longitude]))
  }, [bizWithDistance, businesses, mapBounds, userLocation])

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

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserLocation(loc)
        setFlyTarget({ ...loc, zoom: 14 })
        setViewMode('nearby')
      },
      () => {}
    )
  }, [])

  const handleGeoSearch = async (e) => {
    e.preventDefault()
    if (!geoSearch.trim()) return
    setGeoSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geoSearch)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        const zoom = data[0].type === 'country' ? 6 : data[0].type === 'city' ? 12 : 14
        setFlyTarget({ lat, lng, zoom })
        setCity('')
      }
    } catch {}
    setGeoSearching(false)
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {showScanner && <QrModal onClose={() => setShowScanner(false)} onResult={handleQrResult} />}
      {showCode && <CodeModal onClose={() => setShowCode(false)} />}

      {/* CITY PICKER MODAL */}
      {showCityPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          onClick={e => { if (e.target === e.currentTarget) { setShowCityPicker(false); setCitySearch('') } }}>
          <div className="card w-full max-w-sm flex flex-col" style={{ maxHeight: '80vh' }}>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-text">Choose a city</h2>
                <button onClick={() => { setShowCityPicker(false); setCitySearch('') }} className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-surface-2 transition-colors"><IcX size={16} /></button>
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
                <div><p className={`text-sm font-display font-bold ${!city ? 'text-blue' : 'text-text'}`}>Everywhere</p>
                  <p className="text-xs text-text-muted">All cities worldwide</p></div>
                {!city && <div className="ml-auto w-2 h-2 rounded-full bg-blue" />}
              </button>
              {countriesInResults.map(cnt => (
                <div key={cnt}>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-display font-black uppercase tracking-[0.1em] text-text-faint">{cnt}</p>
                  {filteredCities.filter(c => c.country === cnt).map(c => (
                    <button key={c.id} onClick={() => { setCity(c.slug); setCountry(''); setShowCityPicker(false); setCitySearch('') }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 transition-colors ${city === c.slug ? 'bg-blue/5' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${city === c.slug ? 'bg-blue/10' : 'bg-surface-2'}`}>
                        <IcMapPin size={13} className={city === c.slug ? 'text-blue' : 'text-text-muted'} />
                      </div>
                      <p className={`text-sm font-medium ${city === c.slug ? 'text-blue font-bold' : 'text-text'}`}>{c.name}</p>
                      {city === c.slug && <div className="ml-auto w-2 h-2 rounded-full bg-blue" />}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {user && !user.city_id && (
        <div className="border-b border-amber/20 bg-amber/5">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
            <span className="text-lg flex-shrink-0">📍</span>
            <p className="text-sm text-text flex-1">
              <span className="font-semibold">Set your city</span>
              <span className="text-text-muted"> — get a personalised feed of businesses near you</span>
            </p>
            <Link to="/profile/edit"
              className="text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 transition-colors"
              style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>
              Pick city →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 w-full">
        {/* HEADER ROW */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowCityPicker(true)}
              className="flex items-center gap-1.5 group hover:opacity-80 transition-opacity">
              <IcMapPin size={14} className="text-blue" />
              <span className="font-display font-black text-blue text-sm" style={{ letterSpacing: '-0.01em' }}>
                {selectedCityName || 'Everywhere'}
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-blue opacity-60">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            {allCountries.length > 0 && (
              <div className="relative">
                <button onClick={() => setShowCountryPicker(s => !s)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${country ? 'bg-blue/10 border-blue/30 text-blue font-bold' : 'border-border text-text-muted hover:text-text hover:border-border-2'}`}>
                  <IcGlobe size={11} /> {country || 'All countries'}
                  {country && <button onClick={e => { e.stopPropagation(); setCountry('') }} className="ml-0.5 hover:text-coral"><IcX size={10} /></button>}
                </button>
                {showCountryPicker && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-border rounded-2xl shadow-lg z-30 min-w-[160px] py-1 overflow-hidden">
                    <button onClick={() => { setCountry(''); setShowCountryPicker(false) }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-2 transition-colors ${!country ? 'text-blue font-bold' : 'text-text'}`}>
                      All countries
                    </button>
                    {allCountries.map(c => (
                      <button key={c} onClick={() => { setCountry(c); setCity(''); setShowCountryPicker(false) }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-2 transition-colors ${country === c ? 'text-blue font-bold' : 'text-text'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={locateMe}
              className="btn-secondary text-xs px-3 py-1.5 gap-1.5"
              title="Find businesses near me">
              <IcMapPin size={13} className="text-blue" /> Near me
            </button>
            <div className="flex bg-surface border border-border rounded-xl p-0.5">
              {[['grid', 'Grid'], ['map', 'Map'], ['nearby', '📍 Nearby']].map(([v, l]) => (
                <button key={v} onClick={() => { setViewMode(v); if (v === 'nearby' && !userLocation) locateMe() }}
                  className={`px-3 py-1.5 rounded-[10px] text-xs font-display font-bold transition-all ${viewMode === v ? 'bg-white text-text shadow-sm' : 'text-text-muted hover:text-text'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-2 sm:hidden">
              <button onClick={() => setShowScanner(true)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted active:scale-95 transition-all"><IcQr size={16} /></button>
              <button onClick={() => setShowCode(true)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted active:scale-95 transition-all"><IcHash size={16} /></button>
            </div>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 hide-scrollbar">
          {CATS.map(c => (
            <button key={c.value} onClick={() => setCat(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-display font-bold whitespace-nowrap transition-all flex-shrink-0
                ${cat === c.value ? 'text-bg' : 'bg-surface border border-border text-text-muted hover:text-text hover:border-border-2'}`}
              style={cat === c.value ? { backgroundColor: CAT_ACCENTS[c.value] || '#F5A623', borderColor: 'transparent' } : {}}>
              <c.icon size={13} className={cat === c.value ? 'text-bg' : ''} />
              {c.label}
            </button>
          ))}
        </div>

        {/* SORT + FILTER ROW */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setHasChallenge(h => !h)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-bold border transition-all flex-shrink-0
              ${hasChallenge ? 'bg-amber/15 border-amber/40 text-amber' : 'bg-surface border-border text-text-muted hover:text-text'}`}>
            <IcAward size={11} className={hasChallenge ? 'text-amber' : ''} />
            Active challenges only
          </button>
          {[['', 'Most popular'], ['trending', '🔥 Trending'], ['newest', 'Newest']].map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-display font-bold border transition-all flex-shrink-0
                ${sort === v ? 'bg-blue/15 border-blue/40 text-blue' : 'bg-surface border-border text-text-muted hover:text-text'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* ── GRID VIEW ── */}
        {viewMode === 'grid' && (
          <>
            <p className="text-text-muted text-xs mb-4">{businesses.length} businesses with active challenges{selectedCityName ? ` in ${selectedCityName}` : ''}{selectedCountryName ? ` · ${selectedCountryName}` : ''}</p>
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
                <p className="text-sm">Try a different category, city, or country</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(userLocation ? bizWithDistance : businesses).map(b => {
                  const accent = CAT_ACCENTS[b.category] || '#2767FF'
                  return (
                    <Link key={b.id} to={`/b/${b.slug}`} className="group block rounded-2xl bg-white border border-border overflow-hidden transition-all duration-300"
                      style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06)' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 16px 48px ${accent}1E, 0 4px 12px rgba(17,24,39,0.08)`; e.currentTarget.style.borderColor = `${accent}30` }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(17,24,39,0.06)'; e.currentTarget.style.borderColor = '' }}>
                      <div className="h-28 relative overflow-hidden flex-shrink-0"
                        style={{ background: `linear-gradient(135deg,${accent}18 0%,${accent}08 100%)` }}>
                        {b.cover_url
                          ? <img src={b.cover_url} className="w-full h-full object-cover" alt="" />
                          : (
                            <>
                              <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
                                <defs><pattern id={`p-${b.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                  <circle cx="1" cy="1" r="1" fill={accent} /></pattern></defs>
                                <rect width="100%" height="100%" fill={`url(#p-${b.id})`} />
                              </svg>
                              <div className="absolute right-4 bottom-2 font-display font-black opacity-[0.07] select-none"
                                style={{ fontSize: '5rem', lineHeight: 1, color: accent, letterSpacing: '-0.05em' }}>
                                {b.name?.[0] || '?'}
                              </div>
                            </>
                          )
                        }
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                          {parseInt(b.weekly_completions) >= 5 && (
                            <span className="text-[11px] font-display font-bold px-2.5 py-1 rounded-full bg-coral/90 text-white">
                              🔥 Trending
                            </span>
                          )}
                          <span className="text-[11px] font-display font-bold px-2.5 py-1 rounded-full"
                            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}35` }}>
                            {b.challenge_count} {parseInt(b.challenge_count) !== 1 ? 'challenges' : 'challenge'}
                          </span>
                        </div>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex items-end justify-between -mt-5 mb-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-xl overflow-hidden flex-shrink-0"
                            style={{ background: `linear-gradient(135deg,${accent}28,${accent}14)`, color: accent, border: '2.5px solid white', boxShadow: `0 2px 10px ${accent}28` }}>
                            {b.logo_url ? <img src={b.logo_url} className="w-full h-full object-cover" alt="" /> : (b.name?.[0] || '?')}
                          </div>
                          <span className="text-xs text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1 transition-all duration-200 flex items-center gap-1 font-semibold pb-1">
                            Explore <IcArrowRight size={10} />
                          </span>
                        </div>
                        <p className="font-display font-black text-text leading-tight mb-1 truncate" style={{ fontSize: '1.05rem', letterSpacing: '-0.025em' }}>{b.name}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                          <p className="text-text-muted text-xs capitalize">{b.category || 'Local Business'}</p>
                          {b.city_name && <span className="text-text-faint text-xs">· {b.city_name}</span>}
                          {b.country && <span className="text-text-faint text-xs">· {b.country}</span>}
                          {b.distance != null && <span className="text-blue text-xs font-semibold">· {b.distance < 1 ? `${Math.round(b.distance*1000)}m` : `${b.distance.toFixed(1)}km`}</span>}
                        </div>
                        {parseInt(b.weekly_completions) > 0 && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-stamp">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-stamp animate-pulse inline-block" />
                              {b.weekly_completions} {parseInt(b.weekly_completions) === 1 ? 'person' : 'people'} completed challenges this week
                            </span>
                          </div>
                        )}
                        {b.description && <p className="text-text-muted text-xs leading-relaxed mt-2.5 line-clamp-2">{b.description}</p>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* ── MAP VIEW ── */}
        {viewMode === 'map' && (
          <div className="flex gap-4 -mx-4 px-0" style={{ height: 'calc(100dvh - 16rem)' }}>

            {/* SIDEBAR — desktop */}
            <div className="hidden md:flex flex-col w-80 flex-shrink-0 border border-border rounded-2xl overflow-hidden bg-white">
              {/* Geo search */}
              <form onSubmit={handleGeoSearch} className="p-3 border-b border-border flex gap-2">
                <div className="relative flex-1">
                  <IcSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input className="input pl-8 h-8 text-xs" placeholder="Zip code, city, country..."
                    value={geoSearch} onChange={e => setGeoSearch(e.target.value)} />
                </div>
                <button type="submit" disabled={!geoSearch.trim() || geoSearching}
                  className="btn-primary text-xs px-3 py-0 h-8 flex-shrink-0 disabled:opacity-40">
                  {geoSearching ? '...' : 'Go'}
                </button>
              </form>

              <div className="px-3 py-2 border-b border-border bg-surface/50">
                <p className="text-[11px] text-text-muted">
                  {loading ? 'Loading...' : `${sidebarBizs.length} businesses${mapBounds ? ' in view' : ''}${userLocation ? ' · sorted by distance' : ''}`}
                </p>
              </div>

              <div className="overflow-y-auto flex-1">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-5 h-5 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : sidebarBizs.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-text-muted text-sm">No businesses in this area</p>
                    <p className="text-text-faint text-xs mt-1">Try zooming out or changing filters</p>
                  </div>
                ) : sidebarBizs.map(b => (
                  <BusinessCard key={b.id} b={b} />
                ))}
              </div>
            </div>

            {/* MAP */}
            <div className="flex-1 relative rounded-2xl overflow-hidden border border-border min-w-0">
              {mappable.length === 0 && !loading && (
                <div className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-6">
                  <div className="bg-bg/95 backdrop-blur border border-border rounded-2xl px-4 py-3 text-sm text-text-muted shadow-lg text-center max-w-xs pointer-events-auto">
                    <p className="font-bold text-text mb-0.5">No pinned locations yet</p>
                    <p className="text-xs">Businesses appear on the map once their address is saved. Try the list view to browse all.</p>
                  </div>
                </div>
              )}

              {/* Geo search — mobile */}
              <form onSubmit={handleGeoSearch} className="md:hidden absolute top-3 left-3 right-3 z-20 flex gap-2">
                <div className="relative flex-1">
                  <IcSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input className="input pl-8 h-10 text-sm shadow-lg" placeholder="Zip code, city, country..."
                    value={geoSearch} onChange={e => setGeoSearch(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.97)' }} />
                </div>
                <button type="submit" disabled={!geoSearch.trim() || geoSearching}
                  className="btn-primary text-sm px-3 h-10 flex-shrink-0 shadow-lg disabled:opacity-40">
                  {geoSearching ? '...' : 'Go'}
                </button>
              </form>

              {/* Near me FAB */}
              <button onClick={locateMe}
                className="absolute bottom-16 md:bottom-4 right-3 z-20 w-11 h-11 rounded-full bg-white border border-border shadow-lg flex items-center justify-center text-blue hover:shadow-xl transition-shadow active:scale-95"
                title="Center on my location">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
                  <path d="M12 2a10 10 0 0 1 0 20A10 10 0 0 1 12 2"/>
                </svg>
              </button>

              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  subdomains="abcd"
                  maxZoom={19}
                />
                <FlyController target={flyTarget} />
                <MapBoundsTracker onBoundsChange={setMapBounds} />

                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
                    <Popup>
                      <div style={{ fontFamily: 'system-ui,sans-serif', fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        📍 You are here
                      </div>
                    </Popup>
                  </Marker>
                )}

                {mappable.map(b => {
                  const accent = CAT_ACCENTS[b.category] || '#2767FF'
                  const isSelected = selectedBizId === b.id
                  const challengeCount = parseInt(b.challenge_count) || 0
                  const totalPoints = parseInt(b.total_points) || 0
                  return (
                    <Marker
                      key={b.id}
                      position={[b.latitude, b.longitude]}
                      icon={createPinIcon(b, isSelected)}
                      eventHandlers={{ click: () => setSelectedBizId(b.id) }}
                    >
                      <Tooltip direction="top" offset={[0, -38]} opacity={1} className="achievo-tooltip">
                        <div style={{ fontFamily: 'system-ui,sans-serif', minWidth: 210, maxWidth: 240 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                            <div style={{
                              width: 42, height: 42, borderRadius: 11, overflow: 'hidden', flexShrink: 0,
                              background: `linear-gradient(135deg,${accent}30,${accent}15)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: accent, fontWeight: 900, fontSize: 18,
                              border: `1.5px solid ${accent}25`,
                            }}>
                              {b.logo_url ? <img src={b.logo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : b.name[0]}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: '#111827', letterSpacing: '-0.015em', lineHeight: 1.2 }}>{b.name}</p>
                              <p style={{ margin: '3px 0 0', fontSize: 11, color: '#6B7A99', textTransform: 'capitalize' }}>{b.category} · {b.city_name}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <div style={{
                              flex: 1, background: `${accent}12`, border: `1px solid ${accent}25`,
                              borderRadius: 8, padding: '6px 8px', textAlign: 'center',
                            }}>
                              <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: accent, lineHeight: 1 }}>{challengeCount}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6B7A99', fontWeight: 600 }}>challenge{challengeCount !== 1 ? 's' : ''}</p>
                            </div>
                            <div style={{
                              flex: 1, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)',
                              borderRadius: 8, padding: '6px 8px', textAlign: 'center',
                            }}>
                              <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: '#F5A623', lineHeight: 1 }}>{totalPoints}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6B7A99', fontWeight: 600 }}>pts to earn</p>
                            </div>
                            {b.distance != null && (
                              <div style={{
                                flex: 1, background: 'rgba(39,103,255,0.08)', border: '1px solid rgba(39,103,255,0.2)',
                                borderRadius: 8, padding: '6px 8px', textAlign: 'center',
                              }}>
                                <p style={{ margin: 0, fontWeight: 900, fontSize: 13, color: '#2767FF', lineHeight: 1 }}>
                                  {b.distance < 1 ? `${Math.round(b.distance * 1000)}m` : `${b.distance.toFixed(1)}km`}
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: 10, color: '#6B7A99', fontWeight: 600 }}>away</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Tooltip>
                      <Popup maxWidth={240} className="achievo-popup">
                        <div style={{ fontFamily: 'system-ui,sans-serif', minWidth: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                              background: `linear-gradient(135deg,${accent}30,${accent}15)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: accent, fontWeight: 900, fontSize: 18,
                            }}>
                              {b.logo_url ? <img src={b.logo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : b.name[0]}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 900, fontSize: 14, color: '#111827', letterSpacing: '-0.015em', lineHeight: 1.2 }}>{b.name}</p>
                              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6B7A99', textTransform: 'capitalize' }}>{b.category} · {b.city_name}</p>
                            </div>
                          </div>
                          {challengeCount > 0 && (
                            <p style={{ margin: '0 0 8px', fontSize: 12, color: accent, fontWeight: 700 }}>
                              🏆 {challengeCount} active {challengeCount === 1 ? 'challenge' : 'challenges'} · {totalPoints} pts to earn
                            </p>
                          )}
                          {b.distance != null && (
                            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#2767FF', fontWeight: 600 }}>
                              📍 {b.distance < 1 ? `${Math.round(b.distance*1000)}m away` : `${b.distance.toFixed(1)}km away`}
                            </p>
                          )}
                          <a href={`/b/${b.slug}`} style={{
                            display: 'block', textAlign: 'center', background: accent, color: 'white',
                            padding: '8px 12px', borderRadius: 10, fontWeight: 800, fontSize: 13,
                            textDecoration: 'none', letterSpacing: '-0.01em',
                          }}>
                            View challenges →
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </div>
        )}

        {/* ── NEARBY FEED ── */}
        {viewMode === 'nearby' && (
          <div>
            {!userLocation ? (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center mx-auto mb-5">
                  <IcMapPin size={28} className="text-blue" />
                </div>
                <p className="font-display font-bold text-text text-lg mb-2">Allow location access</p>
                <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">We need your location to show businesses near you</p>
                <button onClick={locateMe} className="btn-primary px-8 py-3">
                  <IcMapPin size={15} /> Enable location
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="font-display font-bold text-text">Near you</p>
                    <p className="text-text-muted text-xs mt-0.5">{bizWithDistance.filter(b => b.distance != null).length} businesses · sorted by distance</p>
                  </div>
                  <button onClick={locateMe} className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
                    <IcMapPin size={12} className="text-blue" /> Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="flex flex-col gap-3">
                    {Array(5).fill(0).map((_, i) => (
                      <div key={i} className="card p-4 animate-pulse h-24" />
                    ))}
                  </div>
                ) : bizWithDistance.length === 0 ? (
                  <div className="text-center py-16 text-text-muted">
                    <p className="font-display font-bold text-text mb-1">No businesses found nearby</p>
                    <p className="text-sm">Try expanding your search or changing filters</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {bizWithDistance.map((b, idx) => {
                      const accent = CAT_ACCENTS[b.category] || '#2767FF'
                      const challengeCount = parseInt(b.challenge_count) || 0
                      const totalPoints = parseInt(b.total_points) || 0
                      const distLabel = b.distance == null ? null
                        : b.distance < 1 ? `${Math.round(b.distance * 1000)}m`
                        : `${b.distance.toFixed(1)}km`
                      return (
                        <Link key={b.id} to={`/b/${b.slug}`}
                          className="group flex items-center gap-4 bg-white border border-border rounded-2xl px-4 py-4 transition-all hover:border-blue/20 hover:shadow-md"
                          style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.05)' }}>

                          {/* Rank */}
                          <div className="w-7 text-center flex-shrink-0">
                            {idx < 3 ? (
                              <span style={{ fontSize: 18 }}>{['🥇','🥈','🥉'][idx]}</span>
                            ) : (
                              <span className="font-display font-black text-text-faint text-sm">{idx + 1}</span>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center font-display font-black text-xl"
                            style={{ background: `linear-gradient(135deg,${accent}28,${accent}12)`, color: accent, border: `1.5px solid ${accent}20` }}>
                            {b.logo_url ? <img src={b.logo_url} className="w-full h-full object-cover" alt="" /> : b.name[0]}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-text truncate" style={{ letterSpacing: '-0.015em' }}>{b.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                              <span className="text-xs text-text-muted capitalize">{b.category}</span>
                              {b.city_name && <><span className="text-text-faint text-xs">·</span><span className="text-xs text-text-muted">{b.city_name}</span></>}
                            </div>
                            {b.best_reward_title && (
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <IcGift size={11} className="text-amber flex-shrink-0" />
                                <span className="text-xs font-semibold text-amber truncate">{b.best_reward_title}</span>
                              </div>
                            )}
                            {parseInt(b.weekly_completions) > 0 && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-stamp animate-pulse flex-shrink-0" />
                                <span className="text-[11px] font-semibold text-green-stamp">{b.weekly_completions} this week</span>
                              </div>
                            )}
                          </div>

                          {/* Right stats */}
                          <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                            {distLabel && (
                              <span className="font-display font-black text-blue text-sm" style={{ letterSpacing: '-0.02em' }}>
                                {distLabel}
                              </span>
                            )}
                            {challengeCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: `${accent}18`, color: accent }}>
                                {challengeCount} {challengeCount === 1 ? 'challenge' : 'challenges'}
                              </span>
                            )}
                            {totalPoints > 0 && (
                              <div className="flex items-center gap-1">
                                <IcStar size={9} className="text-amber" />
                                <span className="text-[10px] font-bold text-amber">{totalPoints} pts</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* MOBILE BUSINESS LIST — shown below map on mobile */}
        {viewMode === 'map' && (
          <div className="md:hidden mt-4 border border-border rounded-2xl overflow-hidden bg-white">
            <div className="px-4 py-2.5 border-b border-border bg-surface/50 flex items-center justify-between">
              <p className="text-xs text-text-muted font-semibold">
                {loading ? 'Loading...' : `${sidebarBizs.length} businesses${userLocation ? ' · nearest first' : ''}`}
              </p>
              <form onSubmit={handleGeoSearch} className="flex gap-1.5">
                <input className="input h-7 text-xs w-36" placeholder="Zip / city / country..."
                  value={geoSearch} onChange={e => setGeoSearch(e.target.value)} />
                <button type="submit" disabled={!geoSearch.trim()} className="btn-primary text-xs px-2 py-0 h-7 disabled:opacity-40">→</button>
              </form>
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {sidebarBizs.slice(0, 20).map(b => <BusinessCard key={b.id} b={b} />)}
              {sidebarBizs.length > 20 && (
                <p className="text-center text-xs text-text-muted py-3">+ {sidebarBizs.length - 20} more — zoom in to filter</p>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar{display:none}
        .hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
        .leaflet-popup-content-wrapper{border-radius:16px!important;padding:12px!important;box-shadow:0 8px 32px rgba(0,0,0,0.18)!important;border:1px solid rgba(0,0,0,0.06)!important}
        .leaflet-popup-content{margin:0!important}
        .leaflet-popup-tip{display:none!important}
        .leaflet-control-zoom{display:none}
        .achievo-tooltip .leaflet-tooltip{background:white!important;border:1px solid rgba(0,0,0,0.08)!important;border-radius:16px!important;padding:12px!important;box-shadow:0 8px 32px rgba(0,0,0,0.16)!important;font-family:system-ui,sans-serif!important}
        .achievo-tooltip .leaflet-tooltip::before{display:none!important}
      `}</style>
    </div>
  )
}
