import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Award, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'
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

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data))
  }, [])

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
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>

        <div className="card p-8">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-text mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <Award size={16} className="text-bg" />
            </div>
            Achievo
          </div>

          {/* Role toggle (signup only) */}
          {mode === 'signup' && (
            <div className="flex gap-2 mb-6 bg-surface-2 p-1 rounded-xl">
              {['customer', 'business_owner'].map(r => (
                <button key={r} onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all font-display
                    ${role === r ? 'bg-amber text-bg font-bold' : 'text-text-muted hover:text-text'}`}>
                  {r === 'customer' ? 'I\'m a customer' : 'I own a business'}
                </button>
              ))}
            </div>
          )}

          <h1 className="font-display font-bold text-2xl text-text mb-1">
            {mode === 'login' ? 'Welcome back' : role === 'customer' ? 'Join Achievo' : 'Add your business'}
          </h1>
          <p className="text-text-muted text-sm mb-6">
            {mode === 'login' ? 'Sign in to your account' : 'Create your free account — no card needed'}
          </p>

          {error && (
            <div className="bg-coral/10 border border-coral/20 text-coral text-sm rounded-xl px-4 py-3 mb-4">
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
                <input className="input pr-10" type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} required />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
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

            <button type="submit" disabled={loading} className="btn-primary justify-center mt-2">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')} className="text-amber hover:text-amber-light transition-colors font-medium">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
