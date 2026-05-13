import { useState } from 'react'
import { IcCheck, IcX, IcDelete, IcAward, IcSearch } from '../components/Icons'
import api from '../api/client'
import useToastStore from '../store/useToastStore'

export default function StaffPin() {
  const { toast } = useToastStore()
  const [slugInput, setSlugInput] = useState('')
  const [bizId, setBizId] = useState(null)
  const [bizName, setBizName] = useState('')
  const [pending, setPending] = useState([])
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)

  const loadBusiness = async (e) => {
    e.preventDefault()
    const slug = slugInput.trim().toLowerCase()
    if (!slug) return
    setSearching(true)
    try {
      const { data: biz } = await api.get(`/businesses/slug/${slug}`)
      const { data: pendingList } = await api.get(`/completions/staff-pending/${biz.id}`)
      setBizId(biz.id); setBizName(biz.name); setPending(pendingList)
    } catch {
      toast('Business not found. Check the code.', 'error')
    } finally { setSearching(false) }
  }

  const pressKey = (k) => { if (pin.length < 6) setPin(p => p + k) }
  const backspace = () => setPin(p => p.slice(0, -1))

  const confirm = async () => {
    if (pin.length < 4) return
    setLoading(true)
    try {
      await api.put(`/completions/${selected.id}/confirm`, { pin })
      setSuccess(true)
      toast('Reward confirmed!', 'success')
      setTimeout(() => {
        setPending(p => p.filter(x => x.id !== selected.id))
        setSelected(null); setPin(''); setSuccess(false)
      }, 1500)
    } catch {
      setShake(true); setPin('')
      toast('Wrong PIN. Try again.', 'error')
      setTimeout(() => setShake(false), 500)
    } finally { setLoading(false) }
  }

  const reject = async () => {
    if (!selected) return
    await api.put(`/completions/${selected.id}/reject`)
    toast('Completion rejected', 'info')
    setPending(p => p.filter(x => x.id !== selected.id))
    setSelected(null); setPin('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <nav className="border-b border-border bg-surface/80 backdrop-blur-xl px-4 h-14 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
          <IcAward size={12} className="text-white" />
        </div>
        <span className="font-display font-black text-text text-sm" style={{ letterSpacing: '-0.02em' }}>Achievo Staff</span>
        {bizName && (
          <>
            <span className="text-text-faint text-sm">·</span>
            <span className="text-text-muted text-sm truncate">{bizName}</span>
          </>
        )}
      </nav>

      <div className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col gap-4">

        {!bizId ? (
          <div className="flex flex-col gap-8 items-center justify-center flex-1 py-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue/10 border border-blue/20 flex items-center justify-center mx-auto mb-5">
                <IcAward size={28} className="text-blue" />
              </div>
              <h1 className="font-display font-black text-text mb-1" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>
                Staff confirm
              </h1>
              <p className="text-text-muted text-sm">Enter your business code to start</p>
            </div>

            <form onSubmit={loadBusiness} className="w-full flex flex-col gap-3">
              <div className="relative">
                <IcSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input className="input pl-9 font-mono tracking-wider text-base" placeholder="Business code (e.g. karakoy-cafe)"
                  value={slugInput} onChange={e => setSlugInput(e.target.value)} autoCapitalize="off" spellCheck={false} />
              </div>
              <button type="submit" disabled={!slugInput.trim() || searching} className="btn-primary justify-center disabled:opacity-40">
                {searching ? 'Looking up...' : 'Load business'}
              </button>
            </form>
          </div>

        ) : !selected ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-black text-text" style={{ fontSize: '1.25rem', letterSpacing: '-0.025em' }}>
                  Pending confirmations
                </p>
                <p className="text-text-muted text-sm">{bizName}</p>
              </div>
              <button onClick={() => { setBizId(null); setBizName(''); setPending([]) }}
                className="text-xs text-text-muted hover:text-text border border-border px-3 py-1.5 rounded-xl transition-colors hover:border-border-2">
                Change
              </button>
            </div>

            {pending.length === 0 ? (
              <div className="card p-14 text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-green-stamp/10 flex items-center justify-center mx-auto mb-4">
                  <IcCheck size={24} className="text-green-stamp" />
                </div>
                <p className="font-display font-bold text-text mb-1">All clear</p>
                <p className="text-text-muted text-sm">No pending confirmations right now</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {pending.map(p => (
                  <button key={p.id} onClick={() => { setSelected(p); setPin('') }}
                    className="card-hover p-4 flex items-center gap-3 text-left w-full active:scale-[0.99]">
                    <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center font-display font-black text-blue flex-shrink-0">
                      {p.full_name?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text text-sm">{p.full_name}</p>
                      <p className="text-text-muted text-xs truncate">{p.challenge_title}</p>
                    </div>
                    <span className="badge-amber text-xs flex-shrink-0">{p.reward_title}</span>
                  </button>
                ))}
              </div>
            )}
          </>

        ) : (
          <div className="flex flex-col gap-5">
            <button onClick={() => { setSelected(null); setPin('') }}
              className="flex items-center gap-1.5 text-text-muted text-sm hover:text-text transition-colors self-start">
              ← Back to list
            </button>

            <div className="ticket">
              <div className="ticket-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center font-display font-black text-blue flex-shrink-0">
                    {selected.full_name?.[0]}
                  </div>
                  <div>
                    <p className="font-display font-bold text-text">{selected.full_name}</p>
                    <p className="text-text-muted text-sm">{selected.challenge_title}</p>
                  </div>
                </div>
              </div>
              <div className="ticket-reward">
                <p className="section-label text-[10px] mb-1">Reward to confirm</p>
                <p className="font-display font-bold text-amber">{selected.reward_title}</p>
              </div>
            </div>

            {success ? (
              <div className="card p-10 flex flex-col items-center gap-3 border-green-stamp/25 animate-stamp">
                <div className="w-16 h-16 rounded-full bg-green-stamp/15 flex items-center justify-center">
                  <IcCheck size={32} className="text-green-stamp" />
                </div>
                <p className="font-display font-black text-xl text-text" style={{ letterSpacing: '-0.025em' }}>Reward confirmed!</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-text-muted text-sm mb-4">Enter your staff PIN</p>
                  <div className={`flex gap-3 justify-center ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
                    {Array(6).fill(0).map((_, i) => (
                      <div key={i} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-150
                        ${i < pin.length ? 'border-blue bg-blue/15' : 'border-border bg-surface-2'}`}>
                        {i < pin.length && <div className="w-2.5 h-2.5 rounded-full bg-blue" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1,2,3,4,5,6,7,8,9].map(k => (
                    <button key={k} onClick={() => pressKey(String(k))}
                      className="h-14 rounded-2xl bg-surface border border-border font-display font-black text-xl text-text hover:bg-blue/8 hover:border-blue/30 active:scale-95 active:bg-blue/10 transition-all">
                      {k}
                    </button>
                  ))}
                  <button onClick={reject} className="h-14 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center hover:bg-coral/20 active:scale-95 transition-all">
                    <IcX size={18} className="text-coral" />
                  </button>
                  <button onClick={() => pressKey('0')} className="h-14 rounded-2xl bg-surface border border-border font-display font-black text-xl text-text hover:bg-blue/8 hover:border-blue/30 active:scale-95 transition-all">
                    0
                  </button>
                  <button onClick={backspace} className="h-14 rounded-2xl bg-surface border border-border flex items-center justify-center hover:bg-surface-2 active:scale-95 transition-all">
                    <IcDelete size={18} className="text-text-muted" />
                  </button>
                </div>

                <button onClick={confirm} disabled={pin.length < 4 || loading}
                  className="btn-primary justify-center py-4 text-base disabled:opacity-40">
                  {loading ? 'Confirming...' : 'Confirm reward'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
    </div>
  )
}
