import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IcAward, IcBarChart, IcUsers, IcQr, IcPlus, IcPencil, IcTrash,
  IcLogOut, IcBell, IcCheck, IcX, IcCopy, IcChevronDown, IcChevronUp,
} from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'

const TABS = [
  { id: 'overview',    label: 'Overview',    icon: IcBarChart },
  { id: 'challenges',  label: 'Challenges',  icon: IcAward },
  { id: 'staff',       label: 'Staff',       icon: IcUsers },
  { id: 'qr',          label: 'QR Code',     icon: IcQr },
]

function ChallengeForm({ biz, onSave, initial, onCancel }) {
  const [f, setF] = useState(initial || { title: '', description: '', type: 'review', rewardTitle: '', rewardType: 'free_item', pointsValue: 100 })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (initial?.id) {
        const { data } = await api.put(`/challenges/${initial.id}`, f)
        onSave(data, 'edit')
      } else {
        const { data } = await api.post('/challenges', { ...f, businessId: biz.id })
        onSave(data, 'add')
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving')
    } finally { setSaving(false) }
  }

  return (
    <form onSubmit={submit} className="card p-6 flex flex-col gap-4 border-amber/20">
      <h3 className="font-display font-bold text-text">{initial ? 'Edit challenge' : 'New challenge'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-text-muted mb-1.5">Challenge title</label>
          <input className="input" placeholder="e.g. Leave us a Google review" value={f.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Type</label>
          <select className="input" value={f.type} onChange={e => set('type', e.target.value)}>
            {['review','visit','referral','purchase','social','custom'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Points value</label>
          <input className="input" type="number" min="0" value={f.pointsValue} onChange={e => set('pointsValue', +e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-text-muted mb-1.5">Reward title</label>
          <input className="input" placeholder="e.g. Free coffee" value={f.rewardTitle} onChange={e => set('rewardTitle', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Reward type</label>
          <select className="input" value={f.rewardType} onChange={e => set('rewardType', e.target.value)}>
            {['free_item','discount','experience','points'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-muted mb-1.5">Max completions</label>
          <input className="input" type="number" min="0" placeholder="Unlimited"
            value={f.maxCompletions || ''} onChange={e => set('maxCompletions', e.target.value ? +e.target.value : null)} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : 'Save challenge'}</button>
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
      </div>
    </form>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [biz, setBiz] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [staff, setStaff] = useState([])
  const [pending, setPending] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editChallenge, setEditChallenge] = useState(null)
  const [staffForm, setStaffForm] = useState({ name: '', role: 'cashier', pinCode: '' })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)

  useEffect(() => {
    if (tab === 'qr' && biz && !qrUrl) {
      setQrLoading(true)
      api.get(`/businesses/${biz.id}/qr`)
        .then(r => setQrUrl(r.data.qrCodeUrl))
        .catch(() => toast('Could not load QR code', 'error'))
        .finally(() => setQrLoading(false))
    }
  }, [tab, biz])

  useEffect(() => {
    let bizData = null
    api.get('/businesses/mine').then(r => {
      bizData = r.data
      setBiz(r.data)
      if (r.data.qr_code_url) setQrUrl(r.data.qr_code_url)
      return Promise.all([
        api.get(`/challenges/business/${r.data.id}`),
        api.get(`/staff/${r.data.id}`),
        api.get(`/completions/pending/${r.data.id}`),
      ])
    }).then(([ch, st, pe]) => {
      setChallenges(ch.data); setStaff(st.data); setPending(pe.data); setLoading(false)
    }).catch(err => {
      if (err.response?.status === 404) navigate('/setup')
      else setLoading(false)
    })
  }, [])

  const toggleChallenge = async (id, isActive) => {
    const { data } = await api.put(`/challenges/${id}`, { isActive: !isActive })
    setChallenges(cs => cs.map(c => c.id === id ? data : c))
  }
  const deleteChallenge = async (id) => {
    if (!confirm('Delete this challenge?')) return
    await api.delete(`/challenges/${id}`)
    setChallenges(cs => cs.filter(c => c.id !== id))
  }
  const addStaff = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/staff', { ...staffForm, businessId: biz.id })
      setStaff(s => [...s, data])
      setStaffForm({ name: '', role: 'cashier', pinCode: '' })
      toast('Staff member added', 'success')
    } catch (err) { toast(err.response?.data?.error || 'Error', 'error') }
  }
  const removeStaff = async (id) => {
    if (!confirm('Remove this staff member?')) return
    await api.delete(`/staff/${id}`)
    setStaff(s => s.filter(x => x.id !== id))
    toast('Staff member removed', 'info')
  }
  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/b/${biz?.slug}`)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!biz) return null

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-surface sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center">
              <IcAward size={13} className="text-bg" />
            </div>
            <span className="font-display font-black text-text" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </div>
          <div className="bg-surface-2 rounded-xl p-3 border border-border">
            <p className="font-display font-bold text-text text-sm truncate">{biz.name}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-text-faint text-xs font-mono truncate">{biz.slug}</p>
              <span className={`badge text-[10px] px-2 py-0.5 ${biz.plan === 'free' ? 'badge-muted' : 'badge-amber'}`}>{biz.plan}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left
                ${tab === t.id ? 'bg-amber/12 text-amber font-bold' : 'text-text-muted hover:text-text hover:bg-surface-2'}`}>
              <t.icon size={15} />
              {t.label}
              {t.id === 'overview' && pending.length > 0 && (
                <span className="ml-auto bg-coral text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={logout} className="flex items-center gap-2 text-text-muted text-sm hover:text-coral transition-colors w-full px-3 py-2 rounded-xl hover:bg-coral/8">
            <IcLogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Mobile tabs */}
        <div className="flex md:hidden gap-1 bg-surface p-1 rounded-xl mb-6 overflow-x-auto border border-border">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-display font-bold whitespace-nowrap transition-all flex-shrink-0
                ${tab === t.id ? 'bg-amber text-bg' : 'text-text-muted'}`}>
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>
                  Overview
                </h1>
                <p className="text-text-muted text-sm">Welcome back, {user?.full_name?.split(' ')[0]}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Active challenges', value: challenges.filter(c => c.is_active).length, color: 'text-amber' },
                { label: 'Pending',           value: pending.length,                             color: 'text-coral'   },
                { label: 'Staff members',     value: staff.length,                               color: 'text-text'    },
                { label: 'Plan',              value: biz.plan,                                   color: 'text-green-stamp' },
              ].map(s => (
                <div key={s.label} className="card p-5">
                  <p className={`font-display font-black mb-1 ${s.color}`} style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p className="text-text-muted text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Pending */}
            {pending.length > 0 && (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <IcBell size={14} className="text-coral" />
                  <h2 className="font-display font-bold text-text">Pending confirmations</h2>
                  <span className="badge-coral text-xs">{pending.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {pending.map(p => (
                    <div key={p.id} className="card p-4 flex items-center gap-3 border-coral/15">
                      <div className="w-9 h-9 rounded-xl bg-amber/15 flex items-center justify-center font-display font-black text-amber text-sm flex-shrink-0">
                        {p.full_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{p.full_name}</p>
                        <p className="text-xs text-text-muted truncate">{p.challenge_title}</p>
                      </div>
                      <span className="badge-amber text-xs truncate hidden sm:inline-flex">{p.reward_title}</span>
                    </div>
                  ))}
                </div>
                <p className="text-text-muted text-xs mt-3">
                  Staff confirm on the <Link to="/staff" className="text-amber hover:underline">staff screen</Link> using their PIN.
                </p>
              </div>
            )}

            {pending.length === 0 && (
              <div className="card p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-green-stamp/10 flex items-center justify-center mx-auto mb-3">
                  <IcCheck size={20} className="text-green-stamp" />
                </div>
                <p className="font-display font-bold text-text mb-1">All caught up</p>
                <p className="text-text-muted text-sm">No pending confirmations</p>
              </div>
            )}
          </div>
        )}

        {/* CHALLENGES */}
        {tab === 'challenges' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>Challenges</h1>
              {!showForm && !editChallenge && (
                <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2.5">
                  <IcPlus size={14} /> New
                </button>
              )}
            </div>

            {(showForm || editChallenge) && (
              <ChallengeForm biz={biz} initial={editChallenge}
                onSave={(data, action) => {
                  if (action === 'add') setChallenges(cs => [data, ...cs])
                  else setChallenges(cs => cs.map(c => c.id === data.id ? data : c))
                  setShowForm(false); setEditChallenge(null)
                }}
                onCancel={() => { setShowForm(false); setEditChallenge(null) }}
              />
            )}

            <div className="flex flex-col gap-3">
              {challenges.length === 0 ? (
                <div className="card p-14 text-center text-text-muted">
                  <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                    <IcAward size={24} className="text-text-faint" />
                  </div>
                  <p className="font-display font-bold text-text mb-1">No challenges yet</p>
                  <p className="text-sm">Create your first challenge above</p>
                </div>
              ) : challenges.map(c => (
                <div key={c.id} className={`card p-5 transition-all ${!c.is_active ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="badge-amber text-xs">{c.reward_title}</span>
                        <span className="badge-muted text-xs capitalize">{c.type}</span>
                        {c.points_value > 0 && <span className="badge-green text-xs">+{c.points_value} pts</span>}
                        {!c.is_active && <span className="badge-coral text-xs">Paused</span>}
                      </div>
                      <p className="font-display font-bold text-text">{c.title}</p>
                      <p className="text-text-muted text-xs mt-1">{c.confirmed_count || 0} completions</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => { setEditChallenge(c); setShowForm(false) }} className="p-2 text-text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-2">
                        <IcPencil size={14} />
                      </button>
                      <button onClick={() => toggleChallenge(c.id, c.is_active)} className={`p-2 transition-colors rounded-lg hover:bg-surface-2 ${c.is_active ? 'text-amber' : 'text-text-muted hover:text-green-stamp'}`}>
                        {c.is_active ? <IcChevronDown size={14} /> : <IcChevronUp size={14} />}
                      </button>
                      <button onClick={() => deleteChallenge(c.id)} className="p-2 text-text-muted hover:text-coral transition-colors rounded-lg hover:bg-coral/8">
                        <IcTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STAFF */}
        {tab === 'staff' && (
          <div className="flex flex-col gap-6">
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>Staff</h1>

            <form onSubmit={addStaff} className="card p-5 flex flex-col sm:flex-row gap-3">
              <input className="input flex-1" placeholder="Staff name" value={staffForm.name} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} required />
              <select className="input sm:w-36" value={staffForm.role} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))}>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
                <option value="receptionist">Receptionist</option>
              </select>
              <input className="input sm:w-32" placeholder="PIN (4–6 digits)" value={staffForm.pinCode}
                onChange={e => setStaffForm(f => ({ ...f, pinCode: e.target.value }))} pattern="\d{4,6}" required />
              <button type="submit" className="btn-primary whitespace-nowrap"><IcPlus size={14} /> Add</button>
            </form>

            <div className="flex flex-col gap-2">
              {staff.length === 0 ? (
                <div className="card p-10 text-center text-text-muted">
                  <IcUsers size={28} className="mx-auto mb-3 text-text-faint" />
                  <p>No staff members yet</p>
                </div>
              ) : staff.map(s => (
                <div key={s.id} className="card p-4 flex items-center gap-3 hover:border-border-2 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber/15 flex items-center justify-center font-display font-black text-amber text-sm flex-shrink-0">
                    {s.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{s.name}</p>
                    <p className="text-xs text-text-muted capitalize">{s.role}</p>
                  </div>
                  <div className="font-mono text-amber text-sm font-bold tracking-[0.2em] bg-amber/8 border border-amber/20 px-3 py-1 rounded-lg">
                    {s.pin_code}
                  </div>
                  <button onClick={() => removeStaff(s.id)} className="p-2 text-text-muted hover:text-coral transition-colors rounded-lg hover:bg-coral/8">
                    <IcX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR */}
        {tab === 'qr' && (
          <div className="flex flex-col gap-6 max-w-md">
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>QR Code</h1>
            <div className="card p-8 flex flex-col items-center gap-6">
              {qrLoading ? (
                <div className="w-48 h-48 bg-surface-2 rounded-2xl flex items-center justify-center animate-pulse">
                  <IcQr size={48} className="text-text-faint" />
                </div>
              ) : qrUrl ? (
                <div className="p-3 bg-white rounded-2xl">
                  <img src={qrUrl} alt="QR Code" className="w-44 h-44 rounded-xl" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-surface-2 rounded-2xl flex items-center justify-center border border-border">
                  <IcQr size={48} className="text-text-faint" />
                </div>
              )}

              <div className="w-full">
                <p className="text-xs text-text-muted mb-2">Your business link</p>
                <div className="flex gap-2">
                  <code className="input text-xs text-text-muted flex-1 overflow-hidden text-ellipsis">
                    {window.location.origin}/b/{biz.slug}
                  </code>
                  <button onClick={copyLink} className={`btn-secondary px-3.5 ${copied ? 'text-green-stamp border-green-stamp/30' : ''}`}>
                    {copied ? <IcCheck size={14} /> : <IcCopy size={14} />}
                  </button>
                </div>
              </div>

              {qrUrl && (
                <a href={qrUrl} download="achievo-qr.png" className="btn-primary w-full justify-center">
                  Download QR Code
                </a>
              )}
            </div>
            <div className="card p-5 text-sm text-text-muted leading-relaxed">
              <p className="font-display font-bold text-text mb-3 text-sm">Placement tips</p>
              <ul className="flex flex-col gap-2">
                {['Print and laminate near the register', 'Add a table tent in every seating area', 'Put it on your menu or packaging', 'Share the link in your Instagram bio'].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <IcCheck size={12} className="text-amber flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
