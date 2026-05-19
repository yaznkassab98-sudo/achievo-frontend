import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  IcAward, IcBarChart, IcUsers, IcQr, IcPlus, IcPencil, IcTrash,
  IcLogOut, IcBell, IcCheck, IcX, IcCopy, IcChevronDown, IcChevronUp,
  IcCamera, IcSave, IcStar, IcClock, IcHash, IcInstagram, IcZap,
} from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'

const ONBOARDING_STEPS = [
  {
    id: 'logo',
    icon: IcCamera,
    title: 'Add your logo',
    desc: 'Help customers recognise your business instantly.',
    tab: 'settings',
    cta: 'Go to Settings',
    check: (biz) => !!biz.logo_url,
  },
  {
    id: 'challenge',
    icon: IcAward,
    title: 'Create your first challenge',
    desc: 'Give customers a reason to keep coming back.',
    tab: 'challenges',
    cta: 'Create challenge',
    check: (_biz, challenges) => challenges.length > 0,
  },
  {
    id: 'staff',
    icon: IcUsers,
    title: 'Invite a staff member',
    desc: 'Staff confirm completions on the spot with a PIN.',
    tab: 'staff',
    cta: 'Add staff',
    check: (_biz, _challenges, staff) => staff.length > 0,
  },
  {
    id: 'qr',
    icon: IcQr,
    title: 'Share your QR code',
    desc: 'Print it, stick it at the counter, or share the link.',
    tab: 'qr',
    cta: 'Get QR code',
    check: (_biz, _challenges, _staff, qrShared) => qrShared,
  },
]

function OnboardingChecklist({ biz, challenges, staff, qrShared, onNavigate, onDismiss }) {
  const done = ONBOARDING_STEPS.map(s => s.check(biz, challenges, staff, qrShared))
  const completedCount = done.filter(Boolean).length
  const allDone = completedCount === ONBOARDING_STEPS.length
  const pct = Math.round((completedCount / ONBOARDING_STEPS.length) * 100)

  if (allDone) return (
    <div className="rounded-2xl border border-green/25 bg-green/5 p-5 flex items-center gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl bg-green/15 flex items-center justify-center flex-shrink-0">
        <IcCheck size={20} className="text-green" />
      </div>
      <div className="flex-1">
        <p className="font-display font-bold text-text">You're all set! 🎉</p>
        <p className="text-xs text-text-muted mt-0.5">Your business is fully set up and ready for customers.</p>
      </div>
      <button onClick={onDismiss} className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors flex-shrink-0">
        <IcX size={14} />
      </button>
    </div>
  )

  return (
    <div className="rounded-2xl border border-blue/20 overflow-hidden mb-8"
      style={{ background: 'linear-gradient(160deg, #0A1B33 0%, #0F2444 100%)' }}>
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Set up your business
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {completedCount} of {ONBOARDING_STEPS.length} steps complete
            </p>
          </div>
          <button onClick={onDismiss} className="p-1.5 rounded-lg flex-shrink-0 transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
            <IcX size={13} />
          </button>
        </div>
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #2767FF, #7BA7FF)' }} />
        </div>
      </div>

      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {ONBOARDING_STEPS.map((step, i) => {
          const isDone = done[i]
          return (
            <div key={step.id} className="flex items-center gap-4 px-5 py-4"
              style={{ background: isDone ? 'rgba(34,197,94,0.04)' : 'transparent' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: isDone ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
                  border: isDone ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                {isDone
                  ? <IcCheck size={16} className="text-green" />
                  : <step.icon size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-display font-bold"
                  style={{ color: isDone ? 'rgba(255,255,255,0.4)' : 'white', textDecoration: isDone ? 'line-through' : 'none' }}>
                  {step.title}
                </p>
                {!isDone && (
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{step.desc}</p>
                )}
              </div>
              {!isDone && (
                <button
                  onClick={() => onNavigate(step.tab)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 transition-all"
                  style={{ background: 'rgba(39,103,255,0.25)', color: '#7BA7FF', border: '1px solid rgba(39,103,255,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(39,103,255,0.4)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(39,103,255,0.25)'; e.currentTarget.style.color = '#7BA7FF' }}>
                  {step.cta} →
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TABS = [
  { id: 'overview',   label: 'Overview',   icon: IcBarChart },
  { id: 'analytics',  label: 'Analytics',  icon: IcStar },
  { id: 'challenges', label: 'Challenges', icon: IcAward },
  { id: 'staff',      label: 'Staff',      icon: IcUsers },
  { id: 'qr',         label: 'QR Code',    icon: IcQr },
  { id: 'settings',   label: 'Settings',   icon: IcPencil },
]

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function WeeklyChart({ weekly }) {
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (7 * (7 - i)))
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay()).toISOString().split('T')[0]
    const found = weekly.find(w => w.week?.split('T')[0] === key || w.week?.startsWith(key))
    return { label: i === 7 ? 'This wk' : i === 6 ? 'Last wk' : `${8-i}w ago`, count: parseInt(found?.count || 0) }
  })
  const max = Math.max(...weeks.map(w => w.count), 1)
  return (
    <div className="flex items-end gap-1.5 h-20 w-full">
      {weeks.map((w, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
          <div className="w-full rounded-t-md transition-all duration-300"
            style={{ height: `${Math.max((w.count / max) * 100, w.count > 0 ? 8 : 3)}%`, background: i === 7 ? '#2767FF' : i === 6 ? '#7BA7FF' : 'rgba(39,103,255,0.18)' }} />
          {w.count > 0 && (
            <div className="absolute bottom-full mb-1 bg-text text-bg rounded-lg px-2 py-1 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">{w.count}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function DayChart({ dayOfWeek }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const found = dayOfWeek.find(d => parseInt(d.dow) === i)
    return { label: DAY_LABELS[i], count: parseInt(found?.count || 0) }
  })
  const max = Math.max(...days.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-2 h-14 w-full">
      {days.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
          <div className="w-full rounded-t-sm"
            style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 10 : 3)}%`, background: d.count === max ? '#F5A623' : 'rgba(245,166,35,0.25)' }} />
          <span className="text-[9px] text-text-faint font-medium">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

function CustomerStatus({ lastSeen }) {
  const days = Math.floor((Date.now() - new Date(lastSeen)) / 86400000)
  if (days <= 14) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green/10 text-green border border-green/20">Active</span>
  if (days <= 30) return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20">Cooling</span>
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-coral/10 text-coral border border-coral/20">At risk</span>
}

const resizeImage = (file, w, h) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      const ctx = canvas.getContext('2d')
      const srcRatio = img.width / img.height
      const dstRatio = w / h
      let sx, sy, sw, sh
      if (srcRatio > dstRatio) {
        sh = img.height; sw = img.height * dstRatio
        sx = (img.width - sw) / 2; sy = 0
      } else {
        sw = img.width; sh = img.width / dstRatio
        sx = 0; sy = (img.height - sh) / 2
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

function TemplatePicker({ templates, onPick, onScratch, onClose }) {
  const byCategory = templates.reduce((acc, t) => {
    const key = t.category || 'general'
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  return (
    <div className="card p-6 flex flex-col gap-5 border-blue/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-text">Start from a template</h3>
          <p className="text-xs text-text-muted mt-0.5">Pick one and customise, or start blank</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors flex-shrink-0">
          <IcX size={14} />
        </button>
      </div>
      {Object.keys(byCategory).length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">No templates available</p>
      ) : (
        <div className="flex flex-col gap-5 max-h-96 overflow-y-auto pr-1">
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-text-faint mb-2">{cat}</p>
              <div className="flex flex-col gap-2">
                {items.map(t => (
                  <button key={t.id} onClick={() => onPick(t)}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-blue/40 hover:bg-blue/5 transition-all text-left group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-surface border border-border group-hover:border-blue/20">
                      {t.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-bold text-text">{t.title}</p>
                      <p className="text-xs text-text-muted truncate">{t.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-bold text-amber">{t.reward_title}</p>
                      <p className="text-[11px] text-text-muted">{t.points_value} pts</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 pt-1 border-t border-border">
        <button onClick={onScratch} className="btn-secondary text-sm flex-1 justify-center">
          Start from scratch
        </button>
      </div>
    </div>
  )
}

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
    <form onSubmit={submit} className="card p-6 flex flex-col gap-4 border-blue/20">
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

function MiniBarChart({ daily }) {
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })

  const dataMap = {}
  daily.forEach(row => { dataMap[row.date] = parseInt(row.count) })

  const counts = last30.map(day => dataMap[day] || 0)
  const maxVal = Math.max(...counts, 1)

  return (
    <div className="flex items-end gap-0.5 h-16 w-full">
      {counts.map((count, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
          <div
            className="w-full rounded-sm transition-all"
            style={{
              height: `${Math.max((count / maxVal) * 100, count > 0 ? 8 : 2)}%`,
              backgroundColor: count > 0 ? '#2767FF' : 'rgba(39,103,255,0.12)',
            }}
          />
          {count > 0 && (
            <div className="absolute bottom-full mb-1 bg-bg border border-border rounded-lg px-2 py-1 text-xs font-mono text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {count}
            </div>
          )}
        </div>
      ))}
    </div>
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
  const [flagged, setFlagged] = useState([])
  const [qrShared, setQrShared] = useState(false)
  const [checklistDismissed, setChecklistDismissed] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [templates, setTemplates] = useState([])
  const [editChallenge, setEditChallenge] = useState(null)
  const [staffForm, setStaffForm] = useState({ name: '', role: 'cashier', pinCode: '' })
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const [qrLoading, setQrLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [customerSort, setCustomerSort] = useState('last_seen')
  const [settingsForm, setSettingsForm] = useState(null)
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [tagInput, setTagInput] = useState('')
  const logoRef = useRef(null)
  const coverRef = useRef(null)

  const DAYS = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' },
  ]

  const addTag = (val) => {
    const tag = val.trim().toLowerCase()
    if (!tag || settingsForm.tags.includes(tag) || settingsForm.tags.length >= 10) return
    setSettingsForm(f => ({ ...f, tags: [...f.tags, tag] }))
    setTagInput('')
  }

  const removeTag = (tag) => setSettingsForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))

  const setHour = (day, field, value) =>
    setSettingsForm(f => ({ ...f, openingHours: { ...f.openingHours, [day]: { ...f.openingHours[day], [field]: value } } }))

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
    if (tab === 'challenges' && templates.length === 0) {
      api.get('/templates').then(r => setTemplates(r.data)).catch(() => {})
    }
  }, [tab])

  useEffect(() => {
    if (tab === 'overview' && biz && !stats) {
      api.get(`/businesses/${biz.id}/stats`)
        .then(r => setStats(r.data))
        .catch(() => {})
    }
    if (tab === 'analytics' && biz && !analytics) {
      setAnalyticsLoading(true)
      api.get(`/businesses/${biz.id}/analytics`)
        .then(r => setAnalytics(r.data))
        .catch(() => {})
        .finally(() => setAnalyticsLoading(false))
    }
  }, [tab, biz])

  useEffect(() => {
    let bizData = null
    api.get('/businesses/mine').then(r => {
      bizData = r.data
      setBiz(r.data)
      if (r.data.qr_code_url) setQrUrl(r.data.qr_code_url)
      setSettingsForm({
        name: r.data.name || '',
        description: r.data.description || '',
        tagline: r.data.tagline || '',
        category: r.data.category || 'other',
        address: r.data.address || '',
        phone: r.data.phone || '',
        website: r.data.website || '',
        instagram: r.data.instagram || '',
        tags: r.data.tags || [],
        openingHours: r.data.opening_hours || {
          mon: { open: '09:00', close: '22:00', closed: false },
          tue: { open: '09:00', close: '22:00', closed: false },
          wed: { open: '09:00', close: '22:00', closed: false },
          thu: { open: '09:00', close: '22:00', closed: false },
          fri: { open: '09:00', close: '22:00', closed: false },
          sat: { open: '10:00', close: '23:00', closed: false },
          sun: { open: '10:00', close: '23:00', closed: false },
        },
        logoUrl: null,
        coverUrl: null,
      })
      setLogoPreview(r.data.logo_url || null)
      setCoverPreview(r.data.cover_url || null)
      return Promise.all([
        api.get(`/challenges/business/${r.data.id}`),
        api.get(`/staff/${r.data.id}`),
        api.get(`/completions/pending/${r.data.id}`),
        api.get(`/completions/flagged/${r.data.id}`).catch(() => ({ data: [] })),
      ])
    }).then(([ch, st, pe, fg]) => {
      setChallenges(ch.data); setStaff(st.data); setPending(pe.data); setFlagged(fg.data); setLoading(false)
      if (bizData) {
        setQrShared(localStorage.getItem(`achievo_qr_shared_${bizData.id}`) === 'true')
        setChecklistDismissed(localStorage.getItem(`achievo_onboarding_dismissed_${bizData.id}`) === 'true')
      }
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
    markQrShared()
  }

  const markQrShared = () => {
    if (biz?.id) {
      localStorage.setItem(`achievo_qr_shared_${biz.id}`, 'true')
      setQrShared(true)
    }
  }

  const dismissChecklist = () => {
    if (biz?.id) localStorage.setItem(`achievo_onboarding_dismissed_${biz.id}`, 'true')
    setChecklistDismissed(true)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const b64 = await resizeImage(file, 200, 200)
    setLogoPreview(b64)
    setSettingsForm(f => ({ ...f, logoUrl: b64 }))
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    const b64 = await resizeImage(file, 1200, 400)
    setCoverPreview(b64)
    setSettingsForm(f => ({ ...f, coverUrl: b64 }))
  }

  const saveSettings = async (e) => {
    e.preventDefault()
    setSettingsSaving(true)
    try {
      const { data } = await api.put(`/businesses/${biz.id}`, {
        name: settingsForm.name,
        description: settingsForm.description || null,
        tagline: settingsForm.tagline || null,
        category: settingsForm.category,
        address: settingsForm.address || null,
        phone: settingsForm.phone || null,
        website: settingsForm.website || null,
        instagram: settingsForm.instagram || null,
        tags: settingsForm.tags,
        openingHours: settingsForm.openingHours,
        logoUrl: settingsForm.logoUrl || null,
        coverUrl: settingsForm.coverUrl || null,
      })
      setBiz(prev => ({ ...prev, ...data }))
      setSettingsForm(f => ({ ...f, logoUrl: null, coverUrl: null }))
      toast('Business updated', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update', 'error')
    } finally {
      setSettingsSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!biz) return null

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-60 flex-col sticky top-0 h-screen" style={{ background: '#0A1B33' }}>
        <div className="p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-1">
              {logoPreview
                ? <img src={logoPreview} className="w-6 h-6 rounded-lg object-cover flex-shrink-0" alt="" />
                : <div className="w-6 h-6 rounded-lg bg-blue/30 flex items-center justify-center text-white text-xs font-black flex-shrink-0">{biz.name?.[0]}</div>
              }
              <p className="font-display font-bold text-white text-sm truncate">{biz.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{biz.slug}</p>
              <span className="badge-blue text-[10px] px-2 py-0.5">{biz.plan}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left"
              style={tab === t.id
                ? { background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', fontWeight: 700 }
                : { color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
              onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
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

        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={logout} className="flex items-center gap-2 text-sm transition-colors w-full px-3 py-2 rounded-xl"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#FF4D3B'; e.currentTarget.style.background = 'rgba(255,77,59,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent' }}>
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
                ${tab === t.id ? 'bg-blue text-white' : 'text-text-muted'}`}>
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>
                Overview
              </h1>
              <p className="text-text-muted text-sm">Welcome back, {user?.full_name?.split(' ')[0]}</p>
            </div>

            {!checklistDismissed && (
              <OnboardingChecklist
                biz={biz}
                challenges={challenges}
                staff={staff}
                qrShared={qrShared}
                onNavigate={(t) => setTab(t)}
                onDismiss={dismissChecklist}
              />
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="stat-card stat-card-blue">
                <p className="stat-num text-blue" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
                  {challenges.filter(c => c.is_active).length}
                </p>
                <p className="text-text-muted text-xs mt-1">Active challenges</p>
              </div>
              <div className="stat-card stat-card-coral">
                <p className="stat-num text-coral" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
                  {pending.length}
                </p>
                <p className="text-text-muted text-xs mt-1">Pending</p>
              </div>
              <div className="stat-card stat-card-amber">
                <p className="stat-num text-amber" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
                  {stats ? parseInt(stats.unique_customers) : '—'}
                </p>
                <p className="text-text-muted text-xs mt-1">Customers</p>
              </div>
              <div className="stat-card stat-card-green">
                <p className="stat-num text-green" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
                  {stats ? parseInt(stats.total_completions) : '—'}
                </p>
                <p className="text-text-muted text-xs mt-1">Completions</p>
              </div>
            </div>

            {/* Activity chart */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display font-bold text-text text-sm">Activity</p>
                  <p className="text-text-muted text-xs mt-0.5">Confirmed completions · last 30 days</p>
                </div>
                {stats && (
                  <div className="text-right">
                    <p className="font-display font-black text-blue text-lg" style={{ letterSpacing: '-0.03em' }}>
                      {stats.daily.reduce((s, d) => s + parseInt(d.count), 0)}
                    </p>
                    <p className="text-text-muted text-xs">this month</p>
                  </div>
                )}
              </div>
              {stats ? (
                <MiniBarChart daily={stats.daily} />
              ) : (
                <div className="h-16 bg-surface-2 rounded-lg animate-pulse" />
              )}
            </div>

            {/* Flagged completions — PRIORITY */}
            {flagged.length > 0 && (
              <div className="rounded-2xl p-5 border-2 border-coral bg-coral/5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-coral/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IcZap size={14} className="text-coral" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-coral text-sm">Flagged for review</p>
                    <p className="text-text-muted text-xs mt-1">{flagged.length} submission{flagged.length === 1 ? '' : 's'} detected as potential spam</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {flagged.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-2/50 border border-coral/20">
                      <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center font-display font-black text-coral text-xs flex-shrink-0">
                        {p.full_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text truncate">{p.full_name}</p>
                        <p className="text-[11px] text-text-muted truncate">{p.challenge_title}</p>
                      </div>
                      <span className="badge text-[10px] bg-coral/15 text-coral border-coral/30 flex-shrink-0">Rapid</span>
                    </div>
                  ))}
                </div>
                {flagged.length > 5 && (
                  <p className="text-text-muted text-xs mt-2">+{flagged.length - 5} more</p>
                )}
              </div>
            )}

            {/* Pending confirmations */}
            {pending.length > 0 && (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-coral/10 flex items-center justify-center">
                    <IcBell size={13} className="text-coral" />
                  </div>
                  <h2 className="font-display font-bold text-text">Pending confirmations</h2>
                  <span className="badge-coral text-xs">{pending.length}</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-coral/15" style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06)' }}>
                  {pending.map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 px-4 py-3.5 bg-surface ${i < pending.length - 1 ? 'border-b border-border' : ''}`}>
                      <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center font-display font-black text-blue text-sm flex-shrink-0">
                        {p.full_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text truncate">{p.full_name}</p>
                        <p className="text-xs text-text-muted truncate">{p.challenge_title}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="badge-amber text-xs hidden sm:inline-flex">{p.reward_title}</span>
                        <span className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-text-muted text-xs mt-3">
                  Staff confirm on the <Link to="/staff" className="text-blue hover:underline font-medium">staff screen</Link> using their PIN.
                </p>
              </div>
            )}

            {pending.length === 0 && (
              <div className="card p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-green/10 flex items-center justify-center mx-auto mb-3">
                  <IcCheck size={20} className="text-green" />
                </div>
                <p className="font-display font-bold text-text mb-1">All caught up</p>
                <p className="text-text-muted text-sm">No pending confirmations</p>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>Analytics</h1>
              <p className="text-text-muted text-sm">Insights your competitors don't have</p>
            </div>

            {analyticsLoading ? (
              <div className="flex flex-col gap-4">
                {[1,2,3].map(i => <div key={i} className="card h-36 animate-pulse" />)}
              </div>
            ) : !analytics ? (
              <div className="card p-12 text-center text-text-muted">
                <p>Could not load analytics</p>
              </div>
            ) : (
              <>
                {/* KPI ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'New customers', value: parseInt(analytics.newVsReturning?.new_customers || 0), sub: 'this month', color: '#2767FF' },
                    { label: 'Returning', value: parseInt(analytics.newVsReturning?.returning_customers || 0), sub: 'this month', color: '#22C55E' },
                    { label: 'This week', value: parseInt(analytics.weekly[analytics.weekly.length - 1]?.count || 0),
                      sub: analytics.weekChange != null ? `${analytics.weekChange >= 0 ? '+' : ''}${analytics.weekChange}% vs last week` : 'completions',
                      color: analytics.weekChange > 0 ? '#22C55E' : analytics.weekChange < 0 ? '#FF4D3B' : '#6B7A99' },
                    { label: 'At risk', value: analytics.atRisk.length, sub: 'customers fading', color: analytics.atRisk.length > 0 ? '#FF8A3D' : '#22C55E' },
                  ].map(s => (
                    <div key={s.label} className="card p-4">
                      <p className="font-display font-black" style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)', letterSpacing: '-0.04em', color: s.color }}>{s.value}</p>
                      <p className="text-text text-xs font-semibold mt-0.5">{s.label}</p>
                      <p className="text-text-muted text-[11px] mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {/* BENCHMARK — the addictive section */}
                {analytics.benchmark && (
                  <div className="rounded-2xl p-6 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0A1B33 0%, #0F2444 100%)', border: '1px solid rgba(39,103,255,0.2)' }}>
                    <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(39,103,255,0.12) 0%, transparent 70%)', transform: 'translate(20%,-20%)' }} />
                    <div className="relative">
                      <p className="text-xs font-display font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(245,166,35,0.8)' }}>Benchmark</p>
                      <p className="font-display font-black text-white mb-5" style={{ fontSize: 'clamp(1.1rem,2.5vw,1.4rem)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                        How do you compare to other {analytics.benchmark.category}s?
                      </p>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: 'You', value: parseFloat(analytics.benchmark.my_avg || 0), color: '#2767FF', highlight: true },
                          { label: `Avg ${analytics.benchmark.category}`, value: parseFloat(analytics.benchmark.category_avg || 0), color: 'rgba(255,255,255,0.4)' },
                          { label: 'Top 20%', value: parseFloat(analytics.benchmark.top_avg || 0), color: '#F5A623' },
                        ].map(row => {
                          const max = Math.max(parseFloat(analytics.benchmark.top_avg || 1), parseFloat(analytics.benchmark.my_avg || 0), 1)
                          const pct = Math.round((row.value / max) * 100)
                          return (
                            <div key={row.label}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold" style={{ color: row.highlight ? 'white' : 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                                <span className="font-display font-black text-sm tabular-nums" style={{ color: row.color }}>{row.value} <span className="text-xs font-normal opacity-60">completions/customer</span></span>
                              </div>
                              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: row.color }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {parseFloat(analytics.benchmark.my_avg) < parseFloat(analytics.benchmark.category_avg) && (
                        <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          💡 Adding more challenges or a visit-based challenge could significantly improve your score.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* CHARTS ROW */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="card p-5">
                    <p className="font-display font-bold text-text text-sm mb-0.5">Weekly trend</p>
                    <p className="text-text-muted text-xs mb-4">Confirmed completions · last 8 weeks</p>
                    <WeeklyChart weekly={analytics.weekly} />
                  </div>
                  <div className="card p-5">
                    <p className="font-display font-bold text-text text-sm mb-0.5">Busiest days</p>
                    <p className="text-text-muted text-xs mb-4">All-time completions by day of week</p>
                    <DayChart dayOfWeek={analytics.dayOfWeek} />
                  </div>
                </div>

                {/* CHALLENGE PERFORMANCE */}
                {analytics.challengePerf.length > 0 && (
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                      <p className="font-display font-bold text-text text-sm">Challenge performance</p>
                      <p className="text-text-muted text-xs mt-0.5">Which challenges are driving loyalty</p>
                    </div>
                    {analytics.challengePerf.map((c, i) => {
                      const total = analytics.challengePerf.reduce((s, x) => s + parseInt(x.total_completions), 0)
                      const pct = total > 0 ? Math.round((parseInt(c.total_completions) / total) * 100) : 0
                      return (
                        <div key={c.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < analytics.challengePerf.length - 1 ? 'border-b border-border' : ''}`}>
                          <div className="w-7 text-center flex-shrink-0">
                            {i === 0 ? <span>🏆</span> : <span className="text-text-faint text-sm font-mono">{i + 1}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{c.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[11px] text-text-muted flex-shrink-0">{pct}%</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-display font-black text-text tabular-nums">{c.total_completions}</p>
                            <p className="text-[10px] text-text-muted">{c.unique_customers} customers</p>
                          </div>
                          {!c.is_active && <span className="badge-coral text-[10px] flex-shrink-0">Paused</span>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* AT-RISK ALERT */}
                {analytics.atRisk.length > 0 && (
                  <div className="rounded-2xl border border-coral/25 overflow-hidden" style={{ background: 'rgba(255,77,59,0.03)' }}>
                    <div className="px-5 py-4 border-b border-coral/15 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-coral/10 flex items-center justify-center flex-shrink-0">
                        <span style={{ fontSize: 16 }}>⚠️</span>
                      </div>
                      <div>
                        <p className="font-display font-bold text-text text-sm">{analytics.atRisk.length} customer{analytics.atRisk.length !== 1 ? 's' : ''} going cold</p>
                        <p className="text-text-muted text-xs">Completed a challenge but haven't been back in 21+ days</p>
                      </div>
                    </div>
                    {analytics.atRisk.slice(0, 5).map((c, i) => (
                      <div key={c.id} className={`flex items-center gap-3 px-5 py-3 ${i < Math.min(analytics.atRisk.length, 5) - 1 ? 'border-b border-coral/10' : ''}`}>
                        <div className="w-9 h-9 rounded-xl bg-coral/10 flex items-center justify-center font-display font-black text-coral text-sm flex-shrink-0 overflow-hidden">
                          {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" alt="" /> : c.full_name?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text truncate">{c.full_name}</p>
                          <p className="text-xs text-text-muted">{c.total_completions} challenge{c.total_completions !== '1' ? 's' : ''} completed</p>
                        </div>
                        <span className="text-xs font-bold text-coral flex-shrink-0">{Math.round(c.days_away)}d ago</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CUSTOMER DIRECTORY */}
                {analytics.customers.length > 0 && (
                  <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                      <div>
                        <p className="font-display font-bold text-text text-sm">Customer directory</p>
                        <p className="text-text-muted text-xs mt-0.5">{analytics.customers.length} total customers</p>
                      </div>
                      <select
                        className="input text-xs h-8 w-36"
                        value={customerSort}
                        onChange={e => setCustomerSort(e.target.value)}>
                        <option value="last_seen">Recent first</option>
                        <option value="total_completions">Most completions</option>
                        <option value="points_earned">Most points</option>
                      </select>
                    </div>
                    <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                      {[...analytics.customers].sort((a, b) => {
                        if (customerSort === 'last_seen') return new Date(b.last_seen) - new Date(a.last_seen)
                        if (customerSort === 'total_completions') return parseInt(b.total_completions) - parseInt(a.total_completions)
                        return parseInt(b.points_earned) - parseInt(a.points_earned)
                      }).map((c, i, arr) => (
                        <div key={c.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-surface/50 transition-colors ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                          <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center font-display font-black text-blue text-sm flex-shrink-0 overflow-hidden">
                            {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" alt="" /> : c.full_name?.[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{c.full_name}</p>
                            <p className="text-xs text-text-muted">Last seen {new Date(c.last_seen).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right hidden sm:block">
                              <p className="font-display font-black text-text text-sm tabular-nums">{c.total_completions}</p>
                              <p className="text-[10px] text-text-muted">challenges</p>
                            </div>
                            <div className="text-right hidden sm:block">
                              <p className="font-display font-black text-amber text-sm tabular-nums">{c.points_earned}</p>
                              <p className="text-[10px] text-text-muted">pts earned</p>
                            </div>
                            <CustomerStatus lastSeen={c.last_seen} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analytics.customers.length === 0 && (
                  <div className="card p-12 text-center">
                    <p className="font-display font-bold text-text mb-1">No data yet</p>
                    <p className="text-text-muted text-sm">Analytics will populate once customers start completing challenges</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* CHALLENGES */}
        {tab === 'challenges' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>Challenges</h1>
              {!showForm && !editChallenge && !showTemplatePicker && (
                <button onClick={() => setShowTemplatePicker(true)} className="btn-primary text-sm px-4 py-2.5">
                  <IcPlus size={14} /> New
                </button>
              )}
            </div>

            {showTemplatePicker && !showForm && !editChallenge && (
              <TemplatePicker
                templates={templates}
                onPick={(t) => {
                  setEditChallenge({
                    title: t.title,
                    description: t.description || '',
                    type: 'visit',
                    rewardTitle: t.reward_title,
                    rewardType: t.reward_type,
                    pointsValue: t.points_value,
                  })
                  setShowTemplatePicker(false)
                  setShowForm(false)
                }}
                onScratch={() => { setShowTemplatePicker(false); setShowForm(true) }}
                onClose={() => setShowTemplatePicker(false)}
              />
            )}

            {(showForm || editChallenge) && (
              <ChallengeForm biz={biz} initial={editChallenge}
                onSave={(data, action) => {
                  if (action === 'add') setChallenges(cs => [data, ...cs])
                  else setChallenges(cs => cs.map(c => c.id === data.id ? data : c))
                  setShowForm(false); setEditChallenge(null)
                }}
                onCancel={() => { setShowForm(false); setEditChallenge(null); setShowTemplatePicker(false) }}
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
                      <button onClick={() => toggleChallenge(c.id, c.is_active)} className={`p-2 transition-colors rounded-lg hover:bg-surface-2 ${c.is_active ? 'text-blue' : 'text-text-muted hover:text-green'}`}>
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
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center font-display font-black text-blue text-sm flex-shrink-0">
                    {s.name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">{s.name}</p>
                    <p className="text-xs text-text-muted capitalize">{s.role}</p>
                  </div>
                  <div className="font-mono text-blue text-sm font-bold tracking-[0.2em] bg-blue/8 border border-blue/20 px-3 py-1 rounded-lg">
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
                <div className="p-3 bg-surface rounded-2xl">
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
                  <button onClick={copyLink} className={`btn-secondary px-3.5 ${copied ? 'text-green border-green/30' : ''}`}>
                    {copied ? <IcCheck size={14} /> : <IcCopy size={14} />}
                  </button>
                </div>
              </div>

              {qrUrl && (
                <a href={qrUrl} download="achievo-qr.png" onClick={markQrShared}
                  className="btn-primary w-full justify-center">
                  Download QR Code
                </a>
              )}
            </div>
            <div className="card p-5 text-sm text-text-muted leading-relaxed">
              <p className="font-display font-bold text-text mb-3 text-sm">Placement tips</p>
              <ul className="flex flex-col gap-2">
                {['Print and laminate near the register', 'Add a table tent in every seating area', 'Put it on your menu or packaging', 'Share the link in your Instagram bio'].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <IcCheck size={12} className="text-blue flex-shrink-0 mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && settingsForm && (
          <div className="flex flex-col gap-8 max-w-xl">
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.03em' }}>Settings</h1>

            {/* Cover photo */}
            <div>
              <p className="text-xs font-semibold text-text-muted mb-3">Cover photo</p>
              <div
                className="relative w-full h-32 rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed border-border hover:border-blue/40 transition-colors group"
                onClick={() => coverRef.current?.click()}
                style={{ background: coverPreview ? 'none' : 'linear-gradient(135deg, #0A1B33, #142D55)' }}
              >
                {coverPreview
                  ? <img src={coverPreview} className="w-full h-full object-cover" alt="" />
                  : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                        <defs><pattern id="cp" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2767FF" strokeWidth="1"/>
                        </pattern></defs>
                        <rect width="100%" height="100%" fill="url(#cp)"/>
                      </svg>
                    </div>
                  )
                }
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 text-white text-sm font-display font-bold">
                    <IcCamera size={16} /> Change cover
                  </div>
                </div>
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </div>

            {/* Logo */}
            <div>
              <p className="text-xs font-semibold text-text-muted mb-3">Logo</p>
              <div className="flex items-center gap-4">
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 border-border hover:border-blue/40 transition-colors group flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1F2340, #111320)' }}
                  onClick={() => logoRef.current?.click()}
                >
                  {logoPreview
                    ? <img src={logoPreview} className="w-full h-full object-cover" alt="" />
                    : <div className="w-full h-full flex items-center justify-center font-display font-black text-2xl text-text-muted">{biz.name?.[0]}</div>
                  }
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <IcCamera size={18} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text mb-1">Business logo</p>
                  <p className="text-xs text-text-muted">Square image, min 200×200px</p>
                  <button type="button" className="btn-secondary text-xs px-3 py-1.5 mt-2" onClick={() => logoRef.current?.click()}>
                    <IcCamera size={12} /> Upload
                  </button>
                </div>
              </div>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>

            {/* Business info */}
            <form onSubmit={saveSettings} className="flex flex-col gap-5">

              {/* Identity */}
              <div className="card p-6 flex flex-col gap-4">
                <h2 className="font-display font-bold text-text text-sm">Identity</h2>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Business name</label>
                  <input className="input" value={settingsForm.name} onChange={e => setSettingsForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">
                    Tagline <span className="font-normal text-text-faint">(optional · 160 chars)</span>
                  </label>
                  <input className="input" maxLength={160} placeholder="Best coffee in the neighbourhood since 2019"
                    value={settingsForm.tagline} onChange={e => setSettingsForm(f => ({ ...f, tagline: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Category</label>
                  <select className="input" value={settingsForm.category} onChange={e => setSettingsForm(f => ({ ...f, category: e.target.value }))}>
                    {['restaurant','cafe','retail','beauty','fitness','health','entertainment','other'].map(c => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Description</label>
                  <textarea className="input min-h-[80px] resize-y text-sm" placeholder="Tell customers about your business..."
                    value={settingsForm.description} onChange={e => setSettingsForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>

              {/* Contact & links */}
              <div className="card p-6 flex flex-col gap-4">
                <h2 className="font-display font-bold text-text text-sm">Contact & links</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Phone</label>
                    <input className="input" type="tel" placeholder="+1 555 000 0000" value={settingsForm.phone} onChange={e => setSettingsForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1.5">Website</label>
                    <input className="input" type="url" placeholder="https://" value={settingsForm.website} onChange={e => setSettingsForm(f => ({ ...f, website: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">
                    Instagram <span className="font-normal text-text-faint">(handle only)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint text-sm select-none">@</span>
                    <input className="input pl-7" placeholder="yourbusiness" value={settingsForm.instagram}
                      onChange={e => setSettingsForm(f => ({ ...f, instagram: e.target.value.replace(/^@/, '') }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Address</label>
                  <input className="input" placeholder="123 Main St, City" value={settingsForm.address} onChange={e => setSettingsForm(f => ({ ...f, address: e.target.value }))} />
                </div>
              </div>

              {/* Tags / amenities */}
              <div className="card p-6 flex flex-col gap-4">
                <div>
                  <h2 className="font-display font-bold text-text text-sm">Tags & amenities</h2>
                  <p className="text-xs text-text-muted mt-0.5">Press Enter or comma to add · max 10</p>
                </div>
                <div>
                  <div className="relative">
                    <IcHash size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
                    <input
                      className="input pl-8 text-sm"
                      placeholder="outdoor seating, vegan, parking, delivery..."
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput) }
                        if (e.key === ',') { e.preventDefault(); addTag(tagInput) }
                      }}
                    />
                  </div>
                  {settingsForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {settingsForm.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs text-text-muted">
                          #{tag}
                          <button type="button" onClick={() => removeTag(tag)} className="text-text-faint hover:text-coral transition-colors">
                            <IcX size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Opening hours */}
              <div className="card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <IcClock size={14} className="text-blue" />
                  <h2 className="font-display font-bold text-text text-sm">Opening hours</h2>
                </div>
                <div className="flex flex-col gap-2">
                  {DAYS.map(({ key, label }) => {
                    const day = settingsForm.openingHours?.[key] || { open: '09:00', close: '22:00', closed: false }
                    return (
                      <div key={key} className="grid items-center gap-2" style={{ gridTemplateColumns: '80px 1fr 1fr 40px' }}>
                        <span className={`text-xs font-medium ${day.closed ? 'text-text-faint' : 'text-text-muted'}`}>{label.slice(0, 3)}</span>
                        <input
                          type="time" className={`input text-xs py-1.5 ${day.closed ? 'opacity-30 pointer-events-none' : ''}`}
                          value={day.open} onChange={e => setHour(key, 'open', e.target.value)} disabled={day.closed}
                        />
                        <input
                          type="time" className={`input text-xs py-1.5 ${day.closed ? 'opacity-30 pointer-events-none' : ''}`}
                          value={day.close} onChange={e => setHour(key, 'close', e.target.value)} disabled={day.closed}
                        />
                        <button
                          type="button"
                          onClick={() => setHour(key, 'closed', !day.closed)}
                          className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${day.closed ? 'bg-surface-2 border border-border' : 'bg-blue'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-surface shadow transition-transform ${day.closed ? 'translate-x-0.5' : 'translate-x-4'}`} />
                        </button>
                      </div>
                    )
                  })}
                </div>
                <p className="text-[11px] text-text-faint">Toggle to mark a day as closed</p>
              </div>

              <button type="submit" disabled={settingsSaving} className="btn-primary justify-center disabled:opacity-40">
                <IcSave size={15} /> {settingsSaving ? 'Saving...' : 'Save changes'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
