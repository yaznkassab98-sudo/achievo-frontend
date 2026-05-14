import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IcAward, IcStar, IcLogOut, IcArrowRight, IcCheck, IcClock, IcGift, IcPencil,
} from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'

const STATUS = {
  available: { label: 'Available', class: 'badge-green' },
  used:      { label: 'Used',      class: 'badge-muted'  },
  expired:   { label: 'Expired',   class: 'badge-coral'  },
}

const STATUS_DOT = {
  confirmed: 'bg-green-stamp',
  claimed:   'bg-green-stamp',
  pending:   'bg-amber',
  rejected:  'bg-coral',
}

export default function Wallet() {
  const { user, logout, fetchMe } = useAuthStore()
  const { toast } = useToastStore()
  const [rewards, setRewards] = useState([])
  const [completions, setCompletions] = useState([])
  const [tab, setTab] = useState('rewards')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMe()
    Promise.all([api.get('/rewards/mine'), api.get('/completions/mine')]).then(([r, c]) => {
      setRewards(r.data); setCompletions(c.data); setLoading(false)
    })
  }, [])

  const useReward = async (id) => {
    if (!confirm('Mark this reward as used?')) return
    try {
      await api.put(`/rewards/${id}/use`)
      setRewards(rws => rws.map(r => r.id === id ? { ...r, status: 'used' } : r))
      toast('Reward claimed!', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Failed to claim reward', 'error')
    }
  }

  const available = rewards.filter(r => r.status === 'available')

  return (
    <div className="min-h-screen pb-28">
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-2xl bg-bg/90">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
              <IcAward size={12} className="text-white" />
            </div>
            <span className="font-display font-black text-text" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/profile/edit" className="p-2.5 text-text-muted hover:text-text transition-colors rounded-xl hover:bg-surface-2">
              <IcPencil size={16} />
            </Link>
            <button onClick={logout} className="p-2.5 text-text-muted hover:text-coral transition-colors rounded-xl hover:bg-coral/8">
              <IcLogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* PROFILE CARD */}
        <div className="rounded-2xl p-6 mb-6 relative overflow-hidden border border-border"
          style={{ background: 'linear-gradient(135deg, #0A1B33 0%, #0F2444 100%)' }}>
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #2767FF 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue/20 flex items-center justify-center font-display font-black text-2xl text-white border border-white/20 flex-shrink-0 overflow-hidden">
              {user?.avatar_url
                ? <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                : user?.full_name?.[0]?.toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-black text-text truncate" style={{ fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                {user?.full_name}
              </p>
              <p className="text-text-muted text-xs truncate mt-0.5">{user?.email}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1.5 justify-end">
                <IcStar size={14} className="text-amber" />
                <span className="font-display font-black text-amber" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {user?.total_points || 0}
                </span>
              </div>
              <p className="text-text-muted text-[10px] mt-0.5 font-display uppercase tracking-wider">points</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/8 relative">
            {[
              { label: 'Challenges',     value: completions.length },
              { label: 'Rewards earned', value: rewards.length },
              { label: 'Available now',  value: available.length },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-black text-text" style={{ fontSize: '1.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p className="text-text-muted text-[10px] mt-1 font-display uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-surface border border-border p-1 rounded-xl mb-6">
          {[['rewards', 'My rewards'], ['history', 'History']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-display font-bold transition-all
                ${tab === t ? 'bg-white text-text shadow-sm' : 'text-text-muted hover:text-text'}`}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'rewards' ? (
          <div className="flex flex-col gap-3">
            {rewards.length === 0 ? (
              <div className="card p-14 text-center">
                <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                  <IcGift size={24} className="text-text-faint" />
                </div>
                <p className="font-display font-bold text-text mb-1">No rewards yet</p>
                <p className="text-text-muted text-sm mb-5">Complete challenges to earn rewards</p>
                <Link to="/browse" className="btn-primary text-sm px-5 py-2.5 inline-flex">
                  Browse businesses <IcArrowRight size={14} />
                </Link>
              </div>
            ) : rewards.map(r => {
              const cfg = STATUS[r.status] || STATUS.used
              const isAvail = r.status === 'available'
              return (
                <div key={r.id} className={`rounded-2xl overflow-hidden border transition-all duration-200 ${isAvail ? 'border-amber/25 hover:border-amber/50' : 'border-border'}`}
                  style={{ boxShadow: isAvail ? '0 2px 12px rgba(255,138,61,0.1)' : '0 1px 3px rgba(17,24,39,0.06)', background: 'white' }}>
                  <div className="p-4 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isAvail ? 'bg-amber/12 border border-amber/25' : 'bg-surface-2 border border-border'}`}>
                      <IcGift size={20} className={isAvail ? 'text-amber' : 'text-text-muted'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-text leading-tight">{r.reward_title}</p>
                      <p className="text-text-muted text-xs mt-0.5 truncate">{r.business_name}</p>
                      <span className={`${cfg.class} mt-2.5 inline-flex text-[10px]`}>{cfg.label}</span>
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      {isAvail ? (
                        <button onClick={() => useReward(r.id)} className="btn-coral text-xs px-3.5 py-2 flex-shrink-0">
                          Claim
                        </button>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.status === 'used' ? 'bg-green-stamp/12' : 'bg-surface-2'}`}>
                          {r.status === 'used'
                            ? <IcCheck size={14} className="text-green-stamp" />
                            : <IcClock size={14} className="text-text-faint" />
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  {isAvail && (
                    <div className="px-4 py-2.5 border-t border-amber/15 bg-amber/[0.03] flex items-center gap-1.5">
                      <IcStar size={11} className="text-amber" />
                      <p className="text-xs text-amber font-medium">Show this to staff to redeem your reward</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {completions.length === 0 ? (
              <div className="card p-10 text-center text-text-muted">
                <p className="font-display font-bold text-text mb-1">No challenges completed yet</p>
                <p className="text-sm">Complete your first challenge to see history</p>
              </div>
            ) : completions.map(c => {
              const isConfirmed = c.status === 'confirmed' || c.status === 'claimed'
              const isPending = c.status === 'pending'
              return (
                <div key={c.id} className="bg-white border border-border rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:border-border-2 transition-colors"
                  style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.05)' }}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isConfirmed ? 'bg-green-stamp/10' : isPending ? 'bg-amber/10' : 'bg-coral/10'}`}>
                    {isConfirmed
                      ? <IcCheck size={15} className="text-green-stamp" />
                      : isPending
                        ? <IcClock size={15} className="text-amber" />
                        : <IcAward size={15} className="text-coral" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{c.challenge_title}</p>
                    <p className="text-xs text-text-muted truncate">{c.business_name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {c.points_value > 0 && isConfirmed && (
                      <p className="font-display font-black text-green-stamp text-sm tabular-nums">+{c.points_value} pts</p>
                    )}
                    {c.points_value > 0 && isPending && (
                      <p className="font-display font-black text-amber text-sm tabular-nums opacity-60">+{c.points_value} pts</p>
                    )}
                    <p className={`text-[10px] font-display font-bold capitalize mt-0.5 ${
                      isConfirmed ? 'text-green-stamp' : isPending ? 'text-amber' : 'text-coral'}`}>
                      {c.status}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
