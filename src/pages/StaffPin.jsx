import { useState, useEffect } from 'react'
import { IcCheck, IcX, IcDelete, IcAward, IcSearch, IcQr, IcRefresh, IcArrowRight, IcStar } from '../components/Icons'
import api from '../api/client'
import useToastStore from '../store/useToastStore'

function formatWait(isoString, now) {
  if (!isoString) return '–'
  const diff = Math.floor((now - new Date(isoString).getTime()) / 1000)
  if (diff < 0) return '0s'
  const m = Math.floor(diff / 60)
  const s = diff % 60
  return `${m}m ${s.toString().padStart(2, '0')}s`
}

const CONFETTI = Array(28).fill(0).map((_, i) => ({
  color: ['#2767FF','#FF8A3D','#22C55E','#F472B6','#A78BFA','#FF4D3B','#FFF7F0'][i % 7],
  left: `${(i * 3.6) % 100}%`,
  delay: `${((i * 0.07) % 0.6).toFixed(2)}s`,
  size: i % 3 === 0 ? 8 : 5,
  rot: i * 37,
}))

export default function StaffPin() {
  const { toast } = useToastStore()
  const [slugInput, setSlugInput] = useState('')
  const [bizId, setBizId] = useState(null)
  const [bizName, setBizName] = useState('')
  const [pending, setPending] = useState([])
  const [approved, setApproved] = useState([])
  const [tab, setTab] = useState('pending')
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const loadBusiness = async (e) => {
    if (e) e.preventDefault()
    const slug = slugInput.trim().toLowerCase()
    if (!slug) return
    setSearching(true)
    try {
      const { data: biz } = await api.get(`/businesses/slug/${slug}`)
      const { data: list } = await api.get(`/completions/staff-pending/${biz.id}`)
      setBizId(biz.id); setBizName(biz.name); setPending(list); setApproved([])
    } catch {
      toast('Business not found. Check the code.', 'error')
    } finally { setSearching(false) }
  }

  const refresh = async () => {
    if (!bizId) return
    try {
      const { data } = await api.get(`/completions/staff-pending/${bizId}`)
      setPending(data)
      toast('Refreshed', 'success')
    } catch { toast('Failed to refresh', 'error') }
  }

  const pressKey = (k) => { if (pin.length < 6) setPin(p => p + k) }
  const backspace = () => setPin(p => p.slice(0, -1))

  const confirm = async () => {
    if (pin.length < 4 || !selected) return
    setLoading(true)
    try {
      await api.put(`/completions/${selected.id}/confirm`, { pin })
      const done = { ...selected, approvedAt: new Date().toISOString() }
      setApproved(a => [done, ...a])
      const remaining = pending.filter(x => x.id !== selected.id)
      setPending(remaining)
      setSuccess({ name: selected.full_name, pts: selected.points_value, reward: selected.reward_title, next: remaining[0] || null })
      setPin('')
    } catch {
      setShake(true); setPin('')
      toast('Wrong PIN. Try again.', 'error')
      setTimeout(() => setShake(false), 500)
    } finally { setLoading(false) }
  }

  const reject = async () => {
    if (!selected) return
    try {
      await api.put(`/completions/${selected.id}/reject`, { pin: pin || undefined })
      toast('Completion rejected', 'info')
      setPending(p => p.filter(x => x.id !== selected.id))
      setSelected(null); setPin('')
    } catch {
      toast('Failed to reject', 'error')
    }
  }

  if (!bizId) return (
    <div className="min-h-screen flex flex-col bg-bg">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-xl px-4 h-14 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
          <IcAward size={12} className="text-white" />
        </div>
        <span className="font-display font-black text-text text-sm" style={{ letterSpacing: '-0.02em' }}>Achievo Staff</span>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center mx-auto mb-5">
            <IcAward size={28} className="text-blue" />
          </div>
          <h1 className="font-display font-black text-text mb-1" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>Staff confirm</h1>
          <p className="text-text-muted text-sm">Enter your business code to start</p>
        </div>
        <form onSubmit={loadBusiness} className="w-full max-w-sm flex flex-col gap-3">
          <div className="relative">
            <IcSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input className="input pl-9 font-mono tracking-wider text-base" placeholder="Business code (e.g. karakoy-cafe)"
              value={slugInput} onChange={e => setSlugInput(e.target.value)} autoCapitalize="off" spellCheck={false} />
          </div>
          <button type="submit" disabled={!slugInput.trim() || searching} className="btn-primary justify-center disabled:opacity-40">
            {searching ? 'Loading...' : 'Load business'}
          </button>
        </form>
      </div>
    </div>
  )

  if (success) return (
    <div className="min-h-screen bg-bg flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((c, i) => (
          <div key={i} className="absolute rounded-sm"
            style={{ backgroundColor: c.color, left: c.left, top: '-10px', width: c.size, height: c.size,
              animation: `confetti-fall 1.4s ease-in ${c.delay} forwards`, transform: `rotate(${c.rot}deg)` }} />
        ))}
      </div>
      <nav className="border-b border-border bg-surface/80 backdrop-blur-xl px-4 h-14 flex items-center gap-2.5 relative z-10">
        <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
          <IcAward size={12} className="text-white" />
        </div>
        <span className="font-display font-black text-text text-sm" style={{ letterSpacing: '-0.02em' }}>Achievo Staff</span>
        <span className="text-text-faint text-sm">·</span>
        <span className="text-text-muted text-sm truncate">{bizName}</span>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 relative z-10">
        <div className="w-20 h-20 rounded-full bg-green-stamp/15 border-2 border-green-stamp/30 flex items-center justify-center animate-stamp">
          <IcCheck size={36} className="text-green-stamp" />
        </div>
        <div className="text-center">
          <h1 className="font-display font-black text-text mb-2" style={{ fontSize: 'clamp(1.75rem,5vw,2.5rem)', letterSpacing: '-0.03em' }}>
            Reward Approved!
          </h1>
          <p className="text-text-muted text-sm">
            <span className="font-semibold text-text">{success.name}</span> has been awarded
          </p>
          {success.pts > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-amber/20 flex items-center justify-center">
                <IcStar size={11} className="text-amber" />
              </div>
              <span className="font-display font-black text-amber" style={{ fontSize: '1.75rem', letterSpacing: '-0.04em' }}>
                +{success.pts} pts
              </span>
            </div>
          )}
        </div>
        <div className="w-full max-w-sm flex flex-col gap-2">
          {success.next && (
            <button onClick={() => { setSelected(success.next); setSuccess(null) }}
              className="w-full py-4 rounded-2xl font-display font-black text-base text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: '#22C55E', boxShadow: '0 4px 16px rgba(34,197,94,0.3)' }}>
              Next in Queue <IcArrowRight size={16} />
            </button>
          )}
          <button onClick={() => { setSelected(null); setSuccess(null); setTab('pending') }}
            className="btn-secondary justify-center py-3.5 w-full">
            {success.next ? 'Back to list' : 'Done'}
          </button>
        </div>
        <p className="text-text-faint text-xs">{pending.length} remaining in queue</p>
      </div>
      <style>{`@keyframes confetti-fall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(105vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-xl px-4 h-14 flex items-center gap-2.5 flex-shrink-0">
        <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
          <IcAward size={12} className="text-white" />
        </div>
        <span className="font-display font-black text-text text-sm" style={{ letterSpacing: '-0.02em' }}>Achievo Staff</span>
        <span className="text-text-faint text-sm">·</span>
        <span className="text-text-muted text-sm truncate flex-1">{bizName}</span>
        <button onClick={() => { setBizId(null); setBizName(''); setPending([]); setApproved([]) }}
          className="text-xs text-text-muted hover:text-text border border-border px-2.5 py-1 rounded-lg transition-colors hover:border-border-2 flex-shrink-0">
          Change
        </button>
      </nav>

      <div className="flex bg-surface border-b border-border flex-shrink-0">
        {[['pending', pending.length], ['approved', approved.length]].map(([t, count]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-display font-black transition-all relative capitalize ${tab === t ? 'text-text' : 'text-text-muted'}`}>
            {t}
            {count > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black
                ${tab === t ? 'bg-green-stamp text-white' : 'bg-surface-2 text-text-muted border border-border'}`}>
                {count}
              </span>
            )}
            {tab === t && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-green-stamp" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'pending' ? (
          pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-stamp/10 flex items-center justify-center mx-auto mb-4">
                <IcCheck size={24} className="text-green-stamp" />
              </div>
              <p className="font-display font-bold text-text mb-1">All clear!</p>
              <p className="text-text-muted text-sm">No pending confirmations</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {pending.map(p => (
                <button key={p.id} onClick={() => { setSelected(p); setPin('') }}
                  className="flex items-center gap-4 px-4 py-4 text-left hover:bg-surface-2 active:bg-surface-2 transition-colors w-full">
                  <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center font-display font-black text-blue text-lg flex-shrink-0 border border-blue/15">
                    {p.full_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-display font-bold text-text text-sm truncate">{p.full_name}</p>
                      <span className="text-[10px] font-black text-coral bg-coral/8 px-1.5 py-0.5 rounded font-display tracking-wide flex-shrink-0">PENDING</span>
                    </div>
                    <p className="text-text-muted text-xs truncate">{p.challenge_title}</p>
                    <p className="text-amber text-xs font-semibold truncate mt-0.5">{p.reward_title}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-mono text-coral font-bold tabular-nums">{formatWait(p.created_at, now)}</p>
                    <p className="text-[10px] text-text-faint mt-0.5">waiting</p>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : (
          approved.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
              <p className="font-display font-bold text-text mb-1">No approvals yet</p>
              <p className="text-text-muted text-sm">Approved rewards will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {approved.map(a => (
                <div key={a.id} className="flex items-center gap-4 px-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-green-stamp/10 flex items-center justify-center font-display font-black text-green-stamp text-lg flex-shrink-0 border border-green-stamp/20">
                    {a.full_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-display font-bold text-text text-sm truncate">{a.full_name}</p>
                      <span className="text-[10px] font-black text-green-stamp bg-green-stamp/10 px-1.5 py-0.5 rounded font-display tracking-wide flex-shrink-0">APPROVED</span>
                    </div>
                    <p className="text-text-muted text-xs truncate">{a.challenge_title}</p>
                    <p className="text-amber text-xs font-semibold truncate mt-0.5">{a.reward_title}</p>
                  </div>
                  <IcCheck size={18} className="text-green-stamp flex-shrink-0" />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <div className="border-t border-border bg-surface p-4 flex gap-3 flex-shrink-0"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button onClick={() => toast('Use the QR scanner on the Browse page', 'info')}
          className="flex-1 btn-secondary justify-center py-3 gap-2">
          <IcQr size={16} /> Scan QR
        </button>
        <button onClick={refresh}
          className="flex-1 btn-secondary justify-center py-3 gap-2">
          <IcRefresh size={16} /> Refresh
        </button>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm px-4 pb-0 sm:pb-6"
          style={{ background: 'rgba(10,27,51,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) { setSelected(null); setPin('') } }}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden"
            style={{ boxShadow: '0 -8px 48px rgba(0,0,0,0.18)' }}>

            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
              <div>
                <h2 className="font-display font-black text-text" style={{ letterSpacing: '-0.02em' }}>Enter Staff PIN</h2>
                <p className="text-text-muted text-xs mt-0.5">Confirm {selected.full_name?.split(' ')[0]}'s reward</p>
              </div>
              <button onClick={() => { setSelected(null); setPin('') }}
                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors">
                <IcX size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3 px-5 py-3 bg-green-stamp/5 border-b border-green-stamp/15">
              <div className="w-9 h-9 rounded-full bg-green-stamp/15 flex items-center justify-center font-display font-black text-green-stamp flex-shrink-0">
                {selected.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-text truncate">{selected.full_name}</p>
                <p className="text-xs text-amber font-medium truncate">{selected.reward_title}</p>
              </div>
              {selected.points_value > 0 && (
                <span className="badge-amber text-xs flex-shrink-0">+{selected.points_value} pts</span>
              )}
            </div>

            <div className="px-5 pt-5 pb-3">
              <div className={`flex gap-3 justify-center ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-150
                    ${i < pin.length ? 'border-green-stamp bg-green-stamp/15' : 'border-border bg-surface-2'}`}>
                    {i < pin.length && <div className="w-2.5 h-2.5 rounded-full bg-green-stamp" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pb-2">
              {[1,2,3,4,5,6,7,8,9].map(k => (
                <button key={k} onClick={() => pressKey(String(k))}
                  className="h-14 rounded-2xl bg-surface-2 border border-border font-display font-black text-xl text-text hover:bg-surface-3 hover:border-blue/20 active:scale-95 transition-all">
                  {k}
                </button>
              ))}
              <button onClick={reject} className="h-14 rounded-2xl bg-coral/8 border border-coral/20 flex items-center justify-center hover:bg-coral/15 active:scale-95 transition-all">
                <IcX size={18} className="text-coral" />
              </button>
              <button onClick={() => pressKey('0')} className="h-14 rounded-2xl bg-surface-2 border border-border font-display font-black text-xl text-text hover:bg-surface-3 active:scale-95 transition-all">
                0
              </button>
              <button onClick={backspace} className="h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center hover:bg-surface-3 active:scale-95 transition-all">
                <IcDelete size={18} className="text-text-muted" />
              </button>
            </div>

            <div className="px-4 pb-5 pt-1">
              <button onClick={confirm} disabled={pin.length < 4 || loading}
                className="w-full py-4 rounded-2xl font-display font-black text-base text-white transition-all active:scale-[0.98] disabled:opacity-40"
                style={{
                  background: pin.length >= 4 && !loading ? '#22C55E' : '#9CA3AF',
                  boxShadow: pin.length >= 4 ? '0 4px 18px rgba(34,197,94,0.35)' : 'none',
                }}>
                {loading ? 'Confirming...' : 'Approve Reward'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  )
}
