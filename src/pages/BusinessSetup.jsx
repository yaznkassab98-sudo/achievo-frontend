import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IcAward, IcArrowRight, IcMapPin, IcStore, IcFileText, IcCheck } from '../components/Icons'
import api from '../api/client'
import useToastStore from '../store/useToastStore'

const CATEGORIES = ['cafe', 'restaurant', 'salon', 'hotel', 'gym', 'clinic', 'retail', 'other']
const STEPS = [{ n: 1, label: 'Business' }, { n: 2, label: 'Details' }, { n: 3, label: 'Done' }]

export default function BusinessSetup() {
  const navigate = useNavigate()
  const { toast } = useToastStore()
  const [step, setStep] = useState(1)
  const [cities, setCities] = useState([])
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(null)
  const [form, setForm] = useState({ name: '', cityId: '', category: 'cafe', description: '', address: '', phone: '', website: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => { api.get('/cities').then(r => setCities(r.data)) }, [])

  const submit = async () => {
    setSaving(true)
    try {
      const { data } = await api.post('/businesses', form)
      setCreated(data); setStep(3)
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to create business', 'error')
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center">
            <IcAward size={15} className="text-white" />
          </div>
          <span className="font-display font-black text-text text-lg" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black flex-shrink-0 transition-all
                ${step > s.n ? 'bg-green text-white' : step === s.n ? 'bg-blue text-white' : 'bg-surface-2 text-text-muted border border-border'}`}>
                {step > s.n ? <IcCheck size={12} /> : s.n}
              </div>
              <span className={`text-xs font-display font-bold whitespace-nowrap ${step === s.n ? 'text-text' : 'text-text-muted'}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 transition-colors ${step > s.n ? 'bg-green/40' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="card p-6 flex flex-col gap-5">
            <div>
              <h1 className="font-display font-black text-text mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Set up your business</h1>
              <p className="text-text-muted text-sm">Takes 2 minutes. Edit everything later.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Business name</label>
              <div className="relative">
                <IcStore size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input className="input pl-9" placeholder="e.g. Karaköy Café" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">City</label>
              <div className="relative">
                <IcMapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <select className="input pl-9" value={form.cityId} onChange={e => set('cityId', e.target.value)}>
                  <option value="">Select your city...</option>
                  {Object.entries(
                    cities.reduce((acc, c) => {
                      const country = c.country || 'Other'
                      acc[country] = acc[country] || []
                      acc[country].push(c)
                      return acc
                    }, {})
                  ).map(([country, cs]) => (
                    <optgroup key={country} label={country}>
                      {cs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => set('category', cat)}
                    className={`py-2 px-1 rounded-xl text-xs font-display font-bold capitalize transition-all
                      ${form.category === cat ? 'bg-blue text-white' : 'bg-surface-2 text-text-muted hover:text-text border border-border hover:border-blue/40'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} disabled={!form.name || !form.cityId} className="btn-primary justify-center disabled:opacity-40">
              Next <IcArrowRight size={15} />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="card p-6 flex flex-col gap-5">
            <div>
              <h1 className="font-display font-black text-text mb-1" style={{ fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Add more details</h1>
              <p className="text-text-muted text-sm">Help customers find you. All optional.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Description</label>
              <div className="relative">
                <IcFileText size={15} className="absolute left-3.5 top-3.5 text-text-muted" />
                <textarea className="input pl-9 resize-none" rows={3} placeholder="Tell customers what makes you special..."
                  value={form.description} onChange={e => set('description', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Address</label>
              <input className="input" placeholder="Street, district" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label>
                <input className="input" type="tel" placeholder="+1 555 000..." value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Website</label>
                <input className="input" type="url" placeholder="https://..." value={form.website} onChange={e => set('website', e.target.value)} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
              <button onClick={submit} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Creating...' : 'Create'} {!saving && <IcArrowRight size={15} />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — success */}
        {step === 3 && created && (
          <div className="card p-10 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green/15 flex items-center justify-center animate-stamp">
              <IcCheck size={28} className="text-green" />
            </div>
            <div>
              <h1 className="font-display font-black text-text mb-2" style={{ fontSize: '1.75rem', letterSpacing: '-0.03em' }}>
                You're live!
              </h1>
              <p className="text-text-muted text-sm">
                <span className="text-blue font-bold">{created.name}</span> is now on Achievo.<br />
                Your code: <span className="font-mono text-blue font-bold">{created.slug}</span>
              </p>
            </div>

            <div className="w-full bg-surface-2 rounded-xl p-4 text-left border border-border">
              <p className="text-xs text-text-muted mb-3 font-display uppercase tracking-widest">What's next</p>
              <ul className="flex flex-col gap-2.5">
                {['Create your first challenge', 'Add staff members', 'Download your QR code'].map((item, i) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-text">
                    <span className="w-5 h-5 rounded-full bg-blue/10 text-blue text-xs font-display font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => navigate('/dashboard')} className="btn-primary w-full justify-center">
              Go to dashboard <IcArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
