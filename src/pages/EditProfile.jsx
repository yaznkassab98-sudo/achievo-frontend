import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IcArrowLeft, IcSave } from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'

export default function EditProfile() {
  const { user, fetchMe } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [cities, setCities] = useState([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', cityId: '' })

  useEffect(() => { api.get('/cities').then(r => setCities(r.data)) }, [])
  useEffect(() => {
    if (user) setForm({ fullName: user.full_name || '', phone: user.phone || '', cityId: user.city_id || '' })
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await api.put('/auth/profile', form)
      await fetchMe()
      toast('Profile updated', 'success')
      navigate('/wallet')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update', 'error')
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen pb-28">
      <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-2xl bg-bg/90">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/wallet" className="p-2 text-text-muted hover:text-text transition-colors rounded-xl hover:bg-surface-2 group">
            <IcArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <span className="font-display font-bold text-text">Edit Profile</span>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue/15 border border-blue/20 flex items-center justify-center font-display font-black text-2xl text-blue">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="font-display font-black text-text" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>{user?.full_name}</p>
            <p className="text-text-muted text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={submit} className="card p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Full name</label>
            <input className="input" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label>
            <input className="input" type="tel" placeholder="+90 5XX XXX XX XX" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">City</label>
            <select className="input" value={form.cityId} onChange={e => set('cityId', e.target.value)}>
              <option value="">Select city...</option>
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary justify-center mt-2">
            <IcSave size={15} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}
