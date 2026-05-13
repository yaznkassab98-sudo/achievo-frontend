import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IcArrowLeft, IcSave, IcCamera } from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'

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

export default function EditProfile() {
  const { user, fetchMe } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [cities, setCities] = useState([])
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [form, setForm] = useState({ fullName: '', phone: '', cityId: '', avatarUrl: null })
  const avatarInputRef = useRef(null)

  useEffect(() => {
    api.get('/cities').then(r => setCities(r.data))
  }, [])

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.full_name || '',
        phone: user.phone || '',
        cityId: user.city_id || '',
        avatarUrl: null,
      })
      setAvatarPreview(user.avatar_url || null)
    }
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await resizeAvatar(file)
    setAvatarPreview(base64)
    set('avatarUrl', base64)
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile', {
        fullName: form.fullName,
        phone: form.phone || null,
        cityId: form.cityId || null,
        avatarUrl: form.avatarUrl || null,
      })
      await fetchMe()
      toast('Profile updated', 'success')
      navigate('/wallet')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update', 'error')
    } finally {
      setSaving(false)
    }
  }

  const countriesMap = cities.reduce((acc, c) => {
    const country = c.country || 'Other'
    acc[country] = acc[country] || []
    acc[country].push(c)
    return acc
  }, {})

  const initials = user?.full_name?.[0]?.toUpperCase() || '?'

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

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer mb-3" onClick={() => avatarInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-surface-2 flex items-center justify-center transition-all group-hover:border-blue/50">
              {avatarPreview
                ? <img src={avatarPreview} className="w-full h-full object-cover" alt="" />
                : <span className="font-display font-black text-blue text-3xl">{initials}</span>
              }
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform">
              <IcCamera size={13} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-text-muted">Tap to change photo</p>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>

        <form onSubmit={submit} className="card p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Full name</label>
            <input className="input" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-muted mb-1.5">Email</p>
            <div className="input bg-surface-2 text-text-muted cursor-not-allowed select-none">{user?.email}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              Phone <span className="font-normal text-text-faint">(optional)</span>
            </label>
            <input className="input" type="tel" placeholder="+1 555 000 0000"
              value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">City</label>
            <select className="input" value={form.cityId} onChange={e => set('cityId', e.target.value)}>
              <option value="">Select city...</option>
              {Object.entries(countriesMap).map(([country, cs]) => (
                <optgroup key={country} label={country}>
                  {cs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary justify-center mt-2 disabled:opacity-40">
            <IcSave size={15} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}
