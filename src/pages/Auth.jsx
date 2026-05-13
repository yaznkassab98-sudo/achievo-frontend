import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IcAward, IcEye, IcEyeOff, IcArrowRight, IcArrowLeft, IcMapPin, IcCheck } from '../components/Icons'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import api from '../api/client'

export default function Auth() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login, signup, loading } = useAuthStore()
  const { toast } = useToastStore()

  const defaultRole = params.get('role') || 'customer'
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState(defaultRole)
  const [showPw, setShowPw] = useState(false)
  const [cities, setCities] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '', fullName: '', cityId: '' })

  useEffect(() => { api.get('/cities').then(r => setCities(r.data)) }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      let user
      if (mode === 'login') {
        user = await login(form.email, form.password)
      } else {
        user = await signup({ email: form.email, password: form.password, fullName: form.fullName, cityId: form.cityId, role })
      }
      toast(mode === 'login' ? 'Welcome back!' : 'Account created!', 'success')
      navigate(user.role === 'business_owner' ? '/dashboard' : '/browse')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT — brand panel (desktop only) */}
      <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 border-r border-border relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(39,103,255,0.07) 0%, transparent 60%)' }}>

        {/* Decorative SVG city grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        {/* Floating challenge tickets */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-70">
          {[
            { type: 'Review', title: 'Leave a Google Review', reward: 'Free Cortado', pts: 100 },
            { type: 'Visit',  title: 'Visit 5 times',        reward: '20% off',       pts: 200 },
          ].map((t, i) => (
            <div key={i} className="ticket w-52 opacity-90" style={{ transform: `rotate(${i % 2 === 0 ? '-1' : '1'}deg)` }}>
              <div className="ticket-body py-3 px-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-text-muted font-display uppercase tracking-wider">{t.type}</span>
                  <span className="text-[10px] text-amber font-bold">+{t.pts}</span>
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
            City loyalty,<br /><span className="text-blue">simplified.</span>
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-xs">
            Join hundreds of Istanbul businesses turning everyday visits into lasting loyalty.
          </p>

          <div className="flex flex-col gap-2.5 mt-8">
            {['No setup fees', 'First challenge free', 'Staff confirm in seconds'].map(f => (
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
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <Link to="/" className="inline-flex items-center gap-1.5 text-text-muted text-sm hover:text-text mb-10 transition-colors group">
            <IcArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back home
          </Link>

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-text" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </div>

          <h1 className="font-display font-black text-text mb-1" style={{ fontSize: 'clamp(1.75rem,4vw,2.25rem)', letterSpacing: '-0.035em' }}>
            {mode === 'login' ? 'Welcome back' : role === 'customer' ? 'Join Achievo' : 'Add your business'}
          </h1>
          <p className="text-text-muted text-sm mb-8">
            {mode === 'login' ? 'Sign in to your account' : 'Create your free account — no card needed'}
          </p>

          {/* Role toggle — signup only */}
          {mode === 'signup' && (
            <div className="flex gap-1.5 bg-surface-2 p-1 rounded-xl mb-7 border border-border">
              {[['customer', "I'm a customer"], ['business_owner', 'I own a business']].map(([r, l]) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-display font-bold transition-all
                    ${role === r ? 'bg-blue text-white' : 'text-text-muted hover:text-text'}`}>
                  {l}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-coral/10 border border-coral/25 text-coral text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Full name</label>
                <input className="input" placeholder="Your name" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input className="input pr-11" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors">
                  {showPw ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Your city</label>
                <select className="input" value={form.cityId} onChange={e => set('cityId', e.target.value)}>
                  <option value="">Select city...</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary justify-center mt-2 py-3.5">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <IcArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-7">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')} className="text-blue hover:text-blue-dim transition-colors font-semibold">
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
