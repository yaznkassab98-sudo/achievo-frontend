import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IcArrowLeft, IcSave, IcCamera, IcCheck } from '../components/Icons'
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
  const [saved, setSaved] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [form, setForm] = useState({
    fullName: '', phone: '', cityId: '', bio: '', dateOfBirth: '', avatarUrl: null,
  })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })
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
        bio: user.bio || '',
        dateOfBirth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
        avatarUrl: null,
      })
      setAvatarPreview(user.avatar_url || null)
    }
  }, [user])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setPw = (k, v) => setPwForm(f => ({ ...f, [k]: v }))

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await resizeAvatar(file)
    setAvatarPreview(base64)
    set('avatarUrl', base64)
  }

  const submitProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile', {
        fullName: form.fullName,
        phone: form.phone || null,
        cityId: form.cityId || null,
        avatarUrl: form.avatarUrl || null,
        dateOfBirth: form.dateOfBirth || null,
        bio: form.bio || null,
      })
      await fetchMe()
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      toast('Profile updated', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to update', 'error')
    } finally {
      setSaving(false)
    }
  }

  const submitPassword = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword)
      return toast('New passwords do not match', 'error')
    if (pwForm.newPassword.length < 8)
      return toast('Password must be at least 8 characters', 'error')
    setPwSaving(true)
    try {
      await api.put('/auth/profile', {
        fullName: form.fullName,
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast('Password changed', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to change password', 'error')
    } finally {
      setPwSaving(false)
    }
  }

  const countriesMap = cities.reduce((acc, c) => {
    const country = c.country || 'Other'
    acc[country] = acc[country] || []
    acc[country].push(c)
    return acc
  }, {})

  const initials = user?.full_name?.[0]?.toUpperCase() || '?'

  const PwToggle = ({ field }) => (
    <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text transition-colors font-medium">
      {showPw[field] ? 'Hide' : 'Show'}
    </button>
  )

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

      <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer mb-2" onClick={() => avatarInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border bg-surface-2 flex items-center justify-center transition-all group-hover:border-blue/50">
              {avatarPreview
                ? <img src={avatarPreview} className="w-full h-full object-cover" alt="" />
                : <span className="font-display font-black text-blue text-3xl">{initials}</span>}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue rounded-full flex items-center justify-center border-2 border-bg shadow-md group-hover:scale-110 transition-transform">
              <IcCamera size={13} className="text-white" />
            </div>
          </div>
          <p className="text-xs text-text-muted">Tap to change photo</p>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>

        {/* Profile info */}
        <form onSubmit={submitProfile} className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-text text-sm">Personal info</h2>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Full name</label>
            <input className="input" value={form.fullName}
              onChange={e => set('fullName', e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Email</label>
            <div className="input bg-surface-2 text-text-muted cursor-not-allowed select-none">{user?.email}</div>
            <p className="text-[11px] text-text-faint mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">
              Bio <span className="font-normal text-text-faint">(optional · 160 chars)</span>
            </label>
            <textarea className="input resize-none text-sm" rows={2} maxLength={160}
              placeholder="A short line about yourself..."
              value={form.bio} onChange={e => set('bio', e.target.value)} />
            <p className="text-[11px] text-text-faint mt-1 text-right">{form.bio.length}/160</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Date of birth <span className="font-normal text-text-faint">(optional)</span>
              </label>
              <input className="input text-sm" type="date"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5">
                Phone <span className="font-normal text-text-faint">(optional)</span>
              </label>
              <input className="input text-sm" type="tel" placeholder="+1 555 000 0000"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">City</label>
            <select className="input" value={form.cityId} onChange={e => set('cityId', e.target.value)}>
              <option value="">Select your city...</option>
              {Object.entries(countriesMap).map(([country, cs]) => (
                <optgroup key={country} label={country}>
                  {cs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <button type="submit" disabled={saving}
            className={`btn-primary justify-center mt-1 disabled:opacity-40 transition-all ${saved ? 'bg-green-stamp border-green-stamp' : ''}`}>
            {saved ? <><IcCheck size={15} /> Saved!</> : <><IcSave size={15} /> {saving ? 'Saving...' : 'Save changes'}</>}
          </button>
        </form>

        {/* Password change */}
        <form onSubmit={submitPassword} className="card p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-display font-bold text-text text-sm">Change password</h2>
            <p className="text-xs text-text-muted mt-0.5">Leave blank if you don't want to change it</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Current password</label>
            <div className="relative">
              <input className="input pr-16" type={showPw.current ? 'text' : 'password'}
                placeholder="••••••••" value={pwForm.currentPassword}
                onChange={e => setPw('currentPassword', e.target.value)} />
              <PwToggle field="current" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">New password</label>
            <div className="relative">
              <input className="input pr-16" type={showPw.new ? 'text' : 'password'}
                placeholder="Min. 8 characters" value={pwForm.newPassword}
                onChange={e => setPw('newPassword', e.target.value)} />
              <PwToggle field="new" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5">Confirm new password</label>
            <div className="relative">
              <input className="input pr-16" type={showPw.confirm ? 'text' : 'password'}
                placeholder="Repeat new password" value={pwForm.confirmPassword}
                onChange={e => setPw('confirmPassword', e.target.value)} />
              <PwToggle field="confirm" />
              {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                <p className="text-xs text-coral mt-1.5">Passwords don't match</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={pwSaving || !pwForm.currentPassword || !pwForm.newPassword}
            className="btn-secondary justify-center disabled:opacity-40">
            {pwSaving ? 'Updating...' : 'Update password'}
          </button>
        </form>

      </div>
      <BottomNav />
    </div>
  )
}
