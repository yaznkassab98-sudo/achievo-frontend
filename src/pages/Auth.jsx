import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  IcAward, IcEye, IcEyeOff, IcArrowRight, IcArrowLeft,
  IcMapPin, IcCheck, IcCamera, IcPhone, IcShield, IcSearch, IcX, IcZap,
  IcStore, IcStar,
} from '../components/Icons'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import api from '../api/client'

const resizeAvatar = (file) => new Promise((resolve) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 200; canvas.height = 200
      const ctx = canvas.getContext('2d')
      const size = Math.min(img.width, img.height)
      ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 200, 200)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
})

function PwStrengthBar({ password }) {
  const score = (() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++
    if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) s++
    return s
  })()
  if (!password) return null
  const labels = ['Weak', 'Fair', 'Strong']
  const colors = ['bg-coral', 'bg-amber', 'bg-green-stamp']
  const textColors = ['text-coral', 'text-amber', 'text-green-stamp']
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-border'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score - 1] || 'text-text-faint'}`}>
        {labels[score - 1] || 'Too short'}
      </p>
    </div>
  )
}

function CityPickerModal({ cities, selected, onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const filtered = cities.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.country?.toLowerCase().includes(search.toLowerCase())
  )
  const countries = [...new Set(filtered.map(c => c.country).filter(Boolean))]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-bg/90 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-sm flex flex-col" style={{ maxHeight: '75vh' }}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-text">Your city</h3>
            <button onClick={onClose} className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-surface-2 transition-colors">
              <IcX size={16} />
            </button>
          </div>
          <div className="relative">
            <IcSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input className="input pl-9 h-9 text-sm" placeholder="Search cities..."
              value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 py-1">
          {countries.length > 0 ? countries.map(country => (
            <div key={country}>
              <p className="px-4 pt-3 pb-1 text-[10px] font-display font-black uppercase tracking-[0.1em] text-text-faint">{country}</p>
              {filtered.filter(c => c.country === country).map(c => (
                <button key={c.id} onClick={() => onSelect(c)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2 transition-colors ${selected === c.id ? 'bg-blue/5' : ''}`}>
                  <IcMapPin size={13} className={selected === c.id ? 'text-blue' : 'text-text-muted'} />
                  <p className={`text-sm ${selected === c.id ? 'text-blue font-bold' : 'text-text'}`}>{c.name}</p>
                  {selected === c.id && <div className="ml-auto w-2 h-2 rounded-full bg-blue" />}
                </button>
              ))}
            </div>
          )) : (
            <p className="px-4 py-6 text-sm text-text-muted text-center">No cities found</p>
          )}
        </div>
      </div>
    </div>
  )
}

const STEP_LABELS = ['Account', 'Profile', 'Verify']

const ROLE_OPTIONS = [
  {
    value: 'customer',
    title: 'Member',
    subtitle: 'I want to earn rewards',
    description: 'Scan QR codes, complete challenges, and collect rewards at local businesses near you.',
    icon: IcStar,
    accent: '#2767FF',
    bg: 'rgba(39,103,255,0.05)',
    border: 'rgba(39,103,255,0.2)',
    features: ['Earn points on every visit', 'Unlock exclusive rewards', 'Track your progress'],
  },
  {
    value: 'business_owner',
    title: 'Business',
    subtitle: 'I want to grow my business',
    description: 'Create loyalty challenges, retain customers, and grow your business with Achievo.',
    icon: IcStore,
    accent: '#FF8A3D',
    bg: 'rgba(255,138,61,0.05)',
    border: 'rgba(255,138,61,0.2)',
    features: ['Create custom challenges', 'Staff confirmation system', 'Analytics dashboard'],
  },
]

export default function Auth() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login, signup, verifyOtp, loading } = useAuthStore()
  const { toast } = useToastStore()

  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [role, setRole] = useState(params.get('role') || 'customer')
  const [step, setStep] = useState(params.get('mode') === 'signup' ? 0 : 1)
  const [pendingUser, setPendingUser] = useState(null)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showCityPicker, setShowCityPicker] = useState(false)
  const [cities, setCities] = useState([])
  const [resendCooldown, setResendCooldown] = useState(0)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const otpRefs = useRef([])
  const avatarInputRef = useRef(null)

  const [form, setForm] = useState({
    email: '', password: '', fullName: '',
    cityId: '', phone: '',
    avatarPreview: null, avatarBase64: null,
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendCooldown])

  const selectedCity = cities.find(c => c.id === form.cityId)

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await resizeAvatar(file)
    set('avatarBase64', base64)
    set('avatarPreview', base64)
  }

  const handleOtpInput = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    const next = [...text.split(''), ...Array(6).fill('')].slice(0, 6)
    setOtp(next)
    otpRefs.current[Math.min(text.length, 5)]?.focus()
  }

  const submitStep1 = (e) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError('')
    setStep(2)
  }

  const submitStep2 = async (e) => {
    e.preventDefault()
    setError(''); setSubmitting(true)
    try {
      const result = await signup({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role,
        cityId: form.cityId || null,
        phone: form.phone || null,
        avatarUrl: form.avatarBase64 || null,
      })
      setPendingUser({ userId: result.userId, email: result.email })
      setStep(3)
      setResendCooldown(60)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const submitOtp = async () => {
    const code = otp.join('')
    if (code.length !== 6) return
    setError(''); setSubmitting(true)
    try {
      const user = await verifyOtp(pendingUser.userId, code)
      toast('Welcome to Achievo! 🎉', 'success')
      navigate(user.role === 'business_owner' ? '/dashboard' : '/browse')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code. Try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    try {
      await api.post('/auth/resend-otp', { userId: pendingUser.userId })
      toast('New code sent!', 'success')
      setResendCooldown(60)
      setOtp(['', '', '', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 50)
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to resend', 'error')
    }
  }

  const submitLogin = async (e) => {
    e.preventDefault()
    setError(''); setSubmitting(true)
    try {
      const user = await login(form.email, form.password)
      toast('Welcome back!', 'success')
      navigate(user.role === 'business_owner' ? '/dashboard' : '/browse')
    } catch (err) {
      const d = err.response?.data
      if (d?.requiresVerification) {
        setPendingUser({ userId: d.userId, email: d.email })
        setMode('signup')
        setStep(3)
        setResendCooldown(60)
        setError('')
      } else {
        setError(d?.error || 'Invalid credentials')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setStep(newMode === 'signup' ? 0 : 1)
    setError('')
    setOtp(['', '', '', '', '', ''])
  }

  const otpFilled = otp.every(d => d !== '')

  return (
    <div className="min-h-screen flex">
      {showCityPicker && (
        <CityPickerModal
          cities={cities}
          selected={form.cityId}
          onSelect={c => { set('cityId', c.id); setShowCityPicker(false) }}
          onClose={() => setShowCityPicker(false)}
        />
      )}

      {/* LEFT — brand panel */}
      <div className="hidden lg:flex w-[42%] flex-col justify-between p-12 border-r border-border relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(39,103,255,0.06) 0%, transparent 60%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auth-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)"/>
        </svg>

        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-60 pointer-events-none">
          {[
            { type: 'Review', title: 'Leave a Google Review', reward: 'Free Cortado', pts: 100 },
            { type: 'Visit',  title: 'Visit 5 times',        reward: '20% off next visit', pts: 200 },
          ].map((t, i) => (
            <div key={i} className="ticket w-52" style={{ transform: `rotate(${i % 2 === 0 ? '-1.5' : '1'}deg)` }}>
              <div className="ticket-body py-3 px-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-text-muted font-display uppercase tracking-wider">{t.type}</span>
                  <span className="text-[10px] text-amber font-bold">+{t.pts} pts</span>
                </div>
                <p className="font-display font-bold text-text text-sm leading-tight">{t.title}</p>
              </div>
              <div className="ticket-reward py-2 px-4">
                <p className="font-display font-bold text-amber text-xs">{t.reward}</p>
              </div>
            </div>
          ))}
        </div>

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">
            <IcAward size={15} className="text-white" />
          </div>
          <span className="font-display font-black text-text text-lg" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display font-black text-text mb-3" style={{ fontSize: 'clamp(2rem,3.5vw,3rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}>
            Loyalty that<br /><span className="text-blue">travels with you.</span>
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            Earn rewards at your favourite local spots — cafés, gyms, salons and more — in any city, worldwide.
          </p>
          <div className="flex flex-col gap-2.5 mt-8">
            {['No app download needed', 'Scan QR, earn instantly', 'Redeem at any Achievo business'].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
                <div className="w-4 h-4 rounded-full bg-blue/15 flex items-center justify-center flex-shrink-0">
                  <IcCheck size={9} className="text-blue" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-text-faint text-xs relative z-10">© 2026 Achievo</p>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">

          <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted text-sm hover:text-text mb-8 transition-colors group">
            <IcArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back home
          </Link>

          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-text" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </div>

          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <div className="animate-fade-up">
              <h1 className="font-display font-black text-text mb-1" style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)', letterSpacing: '-0.035em' }}>
                Welcome back
              </h1>
              <p className="text-text-muted text-sm mb-8">Sign in to your account</p>

              {error && (
                <div className="bg-coral/10 border border-coral/25 text-coral text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
              )}

              <form onSubmit={submitLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Email address</label>
                  <input className="input" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)} required autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1.5">Password</label>
                  <div className="relative">
                    <input className="input pr-11" type={showPw ? 'text' : 'password'} placeholder="Your password"
                      value={form.password} onChange={e => set('password', e.target.value)} required />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                      {showPw ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={submitting || loading}
                  className="btn-primary justify-center mt-1 py-3.5 disabled:opacity-40">
                  {submitting || loading ? 'Signing in...' : 'Sign in'}
                  {!submitting && !loading && <IcArrowRight size={16} />}
                </button>
              </form>

              <p className="text-center text-text-muted text-sm mt-7">
                Don't have an account?{' '}
                <button onClick={() => switchMode('signup')} className="text-blue hover:underline font-semibold">
                  Sign up free
                </button>
              </p>
            </div>
          )}

          {/* ── SIGNUP WIZARD ── */}
          {mode === 'signup' && (
            <div>

              {/* STEP 0 — Role picker */}
              {step === 0 && (
                <div className="animate-fade-up">
                  <h1 className="font-display font-black text-text mb-1.5" style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)', letterSpacing: '-0.035em' }}>
                    Join Achievo
                  </h1>
                  <p className="text-text-muted text-sm mb-8">What brings you here?</p>

                  <div className="flex flex-col gap-3">
                    {ROLE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setRole(opt.value); setStep(1) }}
                        className="group w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                          background: opt.bg,
                          borderColor: opt.border,
                          boxShadow: '0 1px 3px rgba(17,24,39,0.06)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = opt.accent; e.currentTarget.style.boxShadow = `0 8px 28px ${opt.accent}20` }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = opt.border; e.currentTarget.style.boxShadow = '0 1px 3px rgba(17,24,39,0.06)' }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                            style={{ background: `${opt.accent}18` }}>
                            <opt.icon size={22} style={{ color: opt.accent }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-display font-black text-text text-lg" style={{ letterSpacing: '-0.02em' }}>{opt.title}</p>
                              <span className="text-xs font-medium text-text-muted">{opt.subtitle}</span>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed mb-3">{opt.description}</p>
                            <div className="flex flex-col gap-1">
                              {opt.features.map(f => (
                                <div key={f} className="flex items-center gap-2">
                                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: `${opt.accent}20` }}>
                                    <IcCheck size={8} style={{ color: opt.accent }} />
                                  </div>
                                  <span className="text-xs text-text-muted">{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <IcArrowRight size={18} style={{ color: opt.accent }} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-text-muted text-sm mt-8">
                    Already have an account?{' '}
                    <button onClick={() => switchMode('login')} className="text-blue hover:underline font-semibold">
                      Sign in
                    </button>
                  </p>
                </div>
              )}

              {step > 0 && (
              <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ background: role === 'business_owner' ? 'rgba(255,138,61,0.15)' : 'rgba(39,103,255,0.12)' }}>
                      {role === 'business_owner'
                        ? <IcStore size={11} style={{ color: '#FF8A3D' }} />
                        : <IcStar size={11} style={{ color: '#2767FF' }} />
                      }
                    </div>
                    <span className="text-xs font-display font-bold"
                      style={{ color: role === 'business_owner' ? '#FF8A3D' : '#2767FF' }}>
                      {role === 'business_owner' ? 'Business' : 'Member'}
                    </span>
                    <button onClick={() => setStep(0)} className="text-text-faint hover:text-text-muted transition-colors text-xs underline underline-offset-2 ml-0.5">
                      change
                    </button>
                  </div>
                  <h1 className="font-display font-black text-text mb-0.5" style={{ fontSize: 'clamp(1.6rem,4vw,2.1rem)', letterSpacing: '-0.035em' }}>
                    {step === 1 ? 'Create account' : step === 2 ? 'Your profile' : 'Verify your email'}
                  </h1>
                  <p className="text-text-muted text-sm">
                    {step === 1 ? 'Takes less than 2 minutes' : step === 2 ? 'Personalise your account' : `Code sent to ${pendingUser?.email}`}
                  </p>
                </div>
                {step < 3 && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {STEP_LABELS.map((l, i) => {
                      const n = i + 1
                      const done = step > n
                      const active = step === n
                      return (
                        <div key={l} className="flex items-center gap-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all
                            ${done ? 'bg-green-stamp text-white' : active ? 'bg-blue text-white' : 'bg-surface-2 text-text-faint border border-border'}`}>
                            {done ? <IcCheck size={10} /> : n}
                          </div>
                          {n < 3 && <div className={`w-4 h-px ${step > n ? 'bg-green-stamp/50' : 'bg-border'}`} />}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-coral/10 border border-coral/25 text-coral text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
              )}

              {/* STEP 1 — Account */}
              {step === 1 && (
                <div className="animate-fade-up">
                  <form onSubmit={submitStep1} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5">Full name</label>
                      <input className="input" placeholder="Alex Johnson"
                        value={form.fullName} onChange={e => set('fullName', e.target.value)} required autoFocus />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5">Email address</label>
                      <input className="input" type="email" placeholder="you@example.com"
                        value={form.email} onChange={e => set('email', e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5">Password</label>
                      <div className="relative">
                        <input className="input pr-11" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                          value={form.password} onChange={e => set('password', e.target.value)} required minLength={8} />
                        <button type="button" onClick={() => setShowPw(s => !s)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                          {showPw ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                        </button>
                      </div>
                      <PwStrengthBar password={form.password} />
                    </div>
                    <button type="submit" className="btn-primary justify-center py-3.5 mt-1">
                      Continue <IcArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2 — Profile */}
              {step === 2 && (
                <div className="animate-fade-up">
                  <form onSubmit={submitStep2} className="flex flex-col gap-5">
                    {/* Avatar upload */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-surface-2 flex items-center justify-center transition-all group-hover:border-blue/50">
                          {form.avatarPreview
                            ? <img src={form.avatarPreview} className="w-full h-full object-cover" alt="" />
                            : (
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-blue/10 flex items-center justify-center">
                                  <span className="font-display font-black text-blue text-xl">
                                    {form.fullName?.[0]?.toUpperCase() || '?'}
                                  </span>
                                </div>
                              </div>
                            )
                          }
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                          <IcCamera size={13} className="text-white" />
                        </div>
                      </div>
                      <p className="text-xs text-text-muted">Tap to upload a profile photo <span className="text-text-faint">(optional)</span></p>
                      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5">Your city</label>
                      <button type="button" onClick={() => setShowCityPicker(true)}
                        className="input flex items-center justify-between text-left w-full">
                        <span className={selectedCity ? 'text-text' : 'text-text-faint'}>
                          {selectedCity
                            ? <span className="flex items-center gap-2"><IcMapPin size={13} className="text-blue" />{selectedCity.name}, {selectedCity.country}</span>
                            : 'Select your city...'}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 12 12" className="text-text-muted flex-shrink-0">
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                      </button>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-text-muted mb-1.5">
                        Phone number <span className="text-text-faint font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <IcPhone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input className="input pl-9" type="tel" placeholder="+1 555 000 0000"
                          value={form.phone} onChange={e => set('phone', e.target.value)} />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={() => setStep(1)} className="btn-secondary px-4">
                        <IcArrowLeft size={15} />
                      </button>
                      <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center py-3.5 disabled:opacity-40">
                        {submitting ? 'Creating account...' : 'Create account'}
                        {!submitting && <IcArrowRight size={16} />}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3 — OTP */}
              {step === 3 && (
                <div className="animate-fade-up">
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center mb-4">
                      <IcShield size={28} className="text-blue" />
                    </div>
                    <p className="text-text-muted text-sm text-center max-w-xs leading-relaxed">
                      We sent a 6-digit code to <strong className="text-text">{pendingUser?.email}</strong>. Check your inbox (and spam folder).
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => otpRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpInput(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-display font-black text-text bg-white border-2 rounded-xl transition-all focus:outline-none focus:border-blue"
                        style={{
                          borderColor: digit ? '#2767FF' : undefined,
                          boxShadow: digit ? '0 0 0 3px rgba(39,103,255,0.12)' : undefined,
                        }}
                      />
                    ))}
                  </div>

                  <button onClick={submitOtp} disabled={!otpFilled || submitting}
                    className="btn-primary w-full justify-center py-3.5 mb-4 disabled:opacity-40">
                    {submitting ? 'Verifying...' : 'Verify email'}
                    {!submitting && <IcArrowRight size={16} />}
                  </button>

                  <p className="text-center text-sm text-text-muted">
                    Didn't receive it?{' '}
                    {resendCooldown > 0
                      ? <span className="text-text-faint">Resend in {resendCooldown}s</span>
                      : <button onClick={handleResend} className="text-blue hover:underline font-semibold">Resend code</button>
                    }
                  </p>
                </div>
              )}

              <p className="text-center text-text-muted text-sm mt-8">
                Already have an account?{' '}
                <button onClick={() => switchMode('login')} className="text-blue hover:underline font-semibold">
                  Sign in
                </button>
              </p>
            </div>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
