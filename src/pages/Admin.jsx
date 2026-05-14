import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import {
  IcAward, IcUsers, IcStore, IcMapPin, IcBarChart, IcSearch,
  IcCheck, IcX, IcPlus, IcPencil, IcArrowRight,
} from '../components/Icons'

const NAV = [
  { id: 'overview',   label: 'Overview',   icon: IcBarChart },
  { id: 'businesses', label: 'Businesses', icon: IcStore },
  { id: 'users',      label: 'Users',      icon: IcUsers },
  { id: 'cities',     label: 'Cities',     icon: IcMapPin },
]

const PLAN_COLORS = { free: '#9CA3AF', starter: '#2767FF', pro: '#A78BFA', agency: '#F59E0B' }

function StatCard({ label, value, sub, color = '#2767FF' }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5" style={{ boxShadow: '0 1px 4px rgba(17,24,39,0.06)' }}>
      <p className="text-xs font-display font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</p>
      <p className="font-display font-black text-text" style={{ fontSize: '2rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-text-muted mt-1.5">{sub}</p>}
    </div>
  )
}

function MiniChart({ data }) {
  if (!data?.length) return null
  const max = Math.max(...data.map(d => parseInt(d.customers) + parseInt(d.owners)), 1)
  return (
    <div className="rounded-2xl border border-border bg-white p-5" style={{ boxShadow: '0 1px 4px rgba(17,24,39,0.06)' }}>
      <p className="text-xs font-display font-bold uppercase tracking-widest text-text-muted mb-4">New signups — last 30 days</p>
      <div className="flex items-end gap-1 h-20">
        {data.map((d, i) => {
          const total = parseInt(d.customers) + parseInt(d.owners)
          const h = max > 0 ? Math.max((total / max) * 100, 4) : 4
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group" title={`${d.label}: ${total} signups`}>
              <div className="w-full rounded-t-sm transition-all duration-200 group-hover:opacity-80"
                style={{ height: `${h}%`, background: 'linear-gradient(to top, #2767FF, #5B8FFF)' }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Badge({ children, color }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: `${color}18`, color }}>
      {children}
    </span>
  )
}

export default function Admin() {
  const { user } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState(null)
  const [chart, setChart] = useState([])

  const [businesses, setBusinesses] = useState([])
  const [bizSearch, setBizSearch] = useState('')
  const [bizLoading, setBizLoading] = useState(false)

  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [userLoading, setUserLoading] = useState(false)

  const [cities, setCities] = useState([])
  const [cityLoading, setCityLoading] = useState(false)
  const [showCityForm, setShowCityForm] = useState(false)
  const [cityForm, setCityForm] = useState({ name: '', country: '', slug: '', latitude: '', longitude: '' })

  useEffect(() => {
    if (user && user.role !== 'admin') { navigate('/'); return }
    if (!user) return
    loadOverview()
  }, [user])

  const loadOverview = async () => {
    try {
      const [s, a, c] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/activity'),
        api.get('/admin/chart'),
      ])
      setStats(s.data); setActivity(a.data); setChart(c.data)
    } catch { toast('Failed to load stats', 'error') }
  }

  const loadBusinesses = useCallback(async () => {
    setBizLoading(true)
    try {
      const { data } = await api.get(`/admin/businesses${bizSearch ? `?search=${bizSearch}` : ''}`)
      setBusinesses(data)
    } catch { toast('Failed to load businesses', 'error') }
    setBizLoading(false)
  }, [bizSearch])

  const loadUsers = useCallback(async () => {
    setUserLoading(true)
    try {
      const { data } = await api.get(`/admin/users${userSearch ? `?search=${userSearch}` : ''}`)
      setUsers(data)
    } catch { toast('Failed to load users', 'error') }
    setUserLoading(false)
  }, [userSearch])

  const loadCities = async () => {
    setCityLoading(true)
    try { const { data } = await api.get('/admin/cities'); setCities(data) } catch {}
    setCityLoading(false)
  }

  useEffect(() => { if (tab === 'businesses') loadBusinesses() }, [tab])
  useEffect(() => { if (tab === 'users') loadUsers() }, [tab])
  useEffect(() => { if (tab === 'cities') loadCities() }, [tab])

  const toggleBiz = async (id, name) => {
    try {
      const { data } = await api.put(`/admin/businesses/${id}/toggle`)
      setBusinesses(bs => bs.map(b => b.id === id ? { ...b, is_active: data.is_active } : b))
      toast(`${name} ${data.is_active ? 'activated' : 'deactivated'}`, 'success')
    } catch { toast('Failed', 'error') }
  }

  const verifyUser = async (id, name) => {
    try {
      await api.put(`/admin/users/${id}/verify`)
      setUsers(us => us.map(u => u.id === id ? { ...u, is_verified: true } : u))
      toast(`${name} verified`, 'success')
    } catch { toast('Failed', 'error') }
  }

  const toggleCityActive = async (id, name) => {
    try {
      const { data } = await api.put(`/admin/cities/${id}/toggle`)
      setCities(cs => cs.map(c => c.id === id ? { ...c, is_active: data.is_active } : c))
      toast(`${name} ${data.is_active ? 'enabled' : 'disabled'}`, 'success')
    } catch { toast('Failed', 'error') }
  }

  const createCity = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/admin/cities', {
        ...cityForm,
        latitude: cityForm.latitude ? parseFloat(cityForm.latitude) : undefined,
        longitude: cityForm.longitude ? parseFloat(cityForm.longitude) : undefined,
      })
      setCities(cs => [...cs, { ...data, business_count: '0' }])
      setCityForm({ name: '', country: '', slug: '', latitude: '', longitude: '' })
      setShowCityForm(false)
      toast(`${data.name} added`, 'success')
    } catch (err) { toast(err.response?.data?.error || 'Failed', 'error') }
  }

  if (!user) return null
  if (user.role !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-text-muted">Not authorised.</p>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#F4F6FB' }}>
      {/* SIDEBAR */}
      <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border hidden md:flex"
        style={{ background: 'linear-gradient(180deg, #0A1B33 0%, #0F2444 100%)', minHeight: '100vh' }}>
        <div className="px-5 py-5 border-b border-white/8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-white text-sm" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </Link>
          <p className="text-[10px] font-display font-bold uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-bold w-full text-left transition-all"
              style={{
                background: tab === n.id ? 'rgba(39,103,255,0.18)' : 'transparent',
                color: tab === n.id ? '#7BA7FF' : 'rgba(255,255,255,0.45)',
              }}>
              <n.icon size={15} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/8">
          <p className="text-[11px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
          <Link to="/" className="text-[11px] mt-1 block hover:text-white transition-colors" style={{ color: 'rgba(255,255,255,0.25)' }}>
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* MOBILE TOP NAV */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center gap-2 px-4 h-12 border-b border-border bg-white">
        <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
          <IcAward size={12} className="text-white" />
        </div>
        <span className="font-display font-black text-text text-sm flex-1">Admin</span>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)}
            className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${tab === n.id ? 'bg-blue/10 text-blue' : 'text-text-muted'}`}>
            {n.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0 mt-12 md:mt-0">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div>
              <h1 className="font-display font-black text-text mb-6" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Overview</h1>
              {stats ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Total users"       value={stats.users.count}         sub={`+${stats.users.new_this_week} this week`} color="#2767FF" />
                    <StatCard label="Businesses"        value={stats.businesses.active}   sub={`${stats.businesses.count} total`}          color="#FF8A3D" />
                    <StatCard label="Completions"       value={stats.completions.confirmed} sub={`${stats.completions.count} submissions`} color="#22C55E" />
                    <StatCard label="Cities"            value={stats.cities.count}        sub="active"                                     color="#A78BFA" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <MiniChart data={chart} />
                    <StatCard label="Total points awarded" value={parseInt(stats.points_awarded).toLocaleString()} sub="across all users" color="#F59E0B" />
                  </div>

                  {activity && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-display font-black uppercase tracking-widest text-text-faint mb-3">Latest businesses</p>
                        <div className="rounded-2xl border border-border bg-white overflow-hidden">
                          {activity.businesses.map(b => (
                            <div key={b.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0"
                                style={{ background: 'linear-gradient(135deg,#1F2340,#111320)', color: '#5B8FFF' }}>
                                {b.name[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-text truncate">{b.name}</p>
                                <p className="text-xs text-text-muted truncate">{b.owner_email} · {b.city_name}</p>
                              </div>
                              <Badge color={PLAN_COLORS[b.plan] || '#9CA3AF'}>{b.plan}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-display font-black uppercase tracking-widest text-text-faint mb-3">Latest users</p>
                        <div className="rounded-2xl border border-border bg-white overflow-hidden">
                          {activity.users.map(u => (
                            <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0 bg-blue/10 text-blue border border-blue/15">
                                {u.full_name[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-text truncate">{u.full_name}</p>
                                <p className="text-xs text-text-muted truncate">{u.email}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <Badge color={u.role === 'business_owner' ? '#FF8A3D' : '#2767FF'}>{u.role === 'business_owner' ? 'Owner' : u.role}</Badge>
                                {!u.is_verified && <p className="text-[10px] text-coral mt-0.5">unverified</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center py-24">
                  <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* ── BUSINESSES ── */}
          {tab === 'businesses' && (
            <div>
              <div className="flex items-center justify-between mb-6 gap-4">
                <h1 className="font-display font-black text-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Businesses</h1>
                <form onSubmit={e => { e.preventDefault(); loadBusinesses() }} className="flex gap-2">
                  <div className="relative">
                    <IcSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input className="input pl-8 h-9 text-sm w-56" placeholder="Search name, email, city..."
                      value={bizSearch} onChange={e => setBizSearch(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-primary text-xs px-3 py-0 h-9">Search</button>
                </form>
              </div>
              <div className="rounded-2xl border border-border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface/50">
                        {['Business', 'Owner', 'City', 'Plan', 'Challenges', 'Completions', 'Status', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-display font-black uppercase tracking-wider text-text-faint whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bizLoading ? (
                        <tr><td colSpan={8} className="px-4 py-12 text-center text-text-muted text-sm">Loading...</td></tr>
                      ) : businesses.length === 0 ? (
                        <tr><td colSpan={8} className="px-4 py-12 text-center text-text-muted text-sm">No businesses found</td></tr>
                      ) : businesses.map(b => (
                        <tr key={b.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-text">{b.name}</p>
                            <p className="text-xs text-text-muted font-mono">{b.slug}</p>
                          </td>
                          <td className="px-4 py-3 text-text-muted text-xs">{b.owner_name}<br />{b.owner_email}</td>
                          <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{b.city_name}<br />{b.country}</td>
                          <td className="px-4 py-3"><Badge color={PLAN_COLORS[b.plan] || '#9CA3AF'}>{b.plan || 'free'}</Badge></td>
                          <td className="px-4 py-3 text-center font-mono text-text-muted">{b.challenge_count}</td>
                          <td className="px-4 py-3 text-center font-mono text-text-muted">{b.completion_count}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold ${b.is_active ? 'text-green-stamp' : 'text-coral'}`}>
                              {b.is_active ? <IcCheck size={11} /> : <IcX size={11} />}
                              {b.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <a href={`/b/${b.slug}`} target="_blank" rel="noreferrer"
                                className="text-xs text-blue hover:underline font-semibold whitespace-nowrap">View</a>
                              <button onClick={() => toggleBiz(b.id, b.name)}
                                className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors whitespace-nowrap ${b.is_active ? 'bg-coral/10 text-coral hover:bg-coral/20' : 'bg-green-stamp/10 text-green-stamp hover:bg-green-stamp/20'}`}>
                                {b.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6 gap-4">
                <h1 className="font-display font-black text-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Users</h1>
                <form onSubmit={e => { e.preventDefault(); loadUsers() }} className="flex gap-2">
                  <div className="relative">
                    <IcSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input className="input pl-8 h-9 text-sm w-56" placeholder="Search name or email..."
                      value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-primary text-xs px-3 py-0 h-9">Search</button>
                </form>
              </div>
              <div className="rounded-2xl border border-border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface/50">
                        {['User', 'Role', 'City', 'Points', 'Completions', 'Verified', 'Joined', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-display font-black uppercase tracking-wider text-text-faint whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userLoading ? (
                        <tr><td colSpan={8} className="px-4 py-12 text-center text-text-muted text-sm">Loading...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan={8} className="px-4 py-12 text-center text-text-muted text-sm">No users found</td></tr>
                      ) : users.map(u => (
                        <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-bold text-text">{u.full_name}</p>
                            <p className="text-xs text-text-muted">{u.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={u.role === 'admin' ? '#F59E0B' : u.role === 'business_owner' ? '#FF8A3D' : '#2767FF'}>
                              {u.role === 'business_owner' ? 'owner' : u.role}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-xs text-text-muted">{u.city_name || '—'}</td>
                          <td className="px-4 py-3 font-mono text-sm font-bold text-amber">{u.total_points}</td>
                          <td className="px-4 py-3 text-center font-mono text-text-muted">{u.completion_count}</td>
                          <td className="px-4 py-3">
                            {u.is_verified
                              ? <span className="text-green-stamp flex items-center gap-1 text-xs font-bold"><IcCheck size={11} /> Yes</span>
                              : <span className="text-coral text-xs font-bold flex items-center gap-1"><IcX size={11} /> No</span>
                            }
                          </td>
                          <td className="px-4 py-3 text-xs text-text-muted whitespace-nowrap">
                            {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">
                            {!u.is_verified && (
                              <button onClick={() => verifyUser(u.id, u.full_name)}
                                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-green-stamp/10 text-green-stamp hover:bg-green-stamp/20 transition-colors whitespace-nowrap">
                                Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── CITIES ── */}
          {tab === 'cities' && (
            <div>
              <div className="flex items-center justify-between mb-6 gap-4">
                <h1 className="font-display font-black text-text" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Cities</h1>
                <button onClick={() => setShowCityForm(s => !s)}
                  className="btn-primary text-sm gap-2">
                  <IcPlus size={14} /> Add city
                </button>
              </div>

              {showCityForm && (
                <form onSubmit={createCity} className="rounded-2xl border border-blue/25 bg-blue/5 p-5 mb-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="col-span-2 md:col-span-3">
                    <p className="text-sm font-display font-bold text-text mb-3">New city</p>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">City name *</label>
                    <input className="input h-9 text-sm" placeholder="Istanbul" required
                      value={cityForm.name} onChange={e => setCityForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Country *</label>
                    <input className="input h-9 text-sm" placeholder="Turkey" required
                      value={cityForm.country} onChange={e => setCityForm(f => ({ ...f, country: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Slug *</label>
                    <input className="input h-9 text-sm font-mono" placeholder="istanbul" required
                      value={cityForm.slug} onChange={e => setCityForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Latitude</label>
                    <input className="input h-9 text-sm" type="number" step="any" placeholder="41.0082"
                      value={cityForm.latitude} onChange={e => setCityForm(f => ({ ...f, latitude: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Longitude</label>
                    <input className="input h-9 text-sm" type="number" step="any" placeholder="28.9784"
                      value={cityForm.longitude} onChange={e => setCityForm(f => ({ ...f, longitude: e.target.value }))} />
                  </div>
                  <div className="col-span-2 md:col-span-3 flex gap-3 pt-1">
                    <button type="submit" className="btn-primary text-sm">Save city</button>
                    <button type="button" onClick={() => setShowCityForm(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              )}

              <div className="rounded-2xl border border-border bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface/50">
                        {['City', 'Country', 'Slug', 'Lat/Lng', 'Businesses', 'Status', ''].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-display font-black uppercase tracking-wider text-text-faint whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cityLoading ? (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-text-muted text-sm">Loading...</td></tr>
                      ) : cities.map(c => (
                        <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/40 transition-colors">
                          <td className="px-4 py-3 font-bold text-text">{c.name}</td>
                          <td className="px-4 py-3 text-text-muted">{c.country}</td>
                          <td className="px-4 py-3 font-mono text-xs text-text-muted">{c.slug}</td>
                          <td className="px-4 py-3 text-xs text-text-muted font-mono">
                            {c.latitude ? `${parseFloat(c.latitude).toFixed(4)}, ${parseFloat(c.longitude).toFixed(4)}` : '—'}
                          </td>
                          <td className="px-4 py-3 text-center font-mono text-text-muted">{c.business_count}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold ${c.is_active ? 'text-green-stamp' : 'text-coral'}`}>
                              {c.is_active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleCityActive(c.id, c.name)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${c.is_active ? 'bg-coral/10 text-coral hover:bg-coral/20' : 'bg-green-stamp/10 text-green-stamp hover:bg-green-stamp/20'}`}>
                              {c.is_active ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
