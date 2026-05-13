import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Award, Star, LogOut, ArrowRight, Check, Clock, Gift, Pencil } from 'lucide-react'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'

const STATUS_CONFIG = {
  available: { label: 'Available', class: 'badge-green', icon: Gift },
  used: { label: 'Used', class: 'badge-muted', icon: Check },
  expired: { label: 'Expired', class: 'badge-coral', icon: Clock },
}

export default function Wallet() {
  const { user, logout } = useAuthStore()
  const { toast } = useToastStore()
  const [rewards, setRewards] = useState([])
  const [completions, setCompletions] = useState([])
  const [tab, setTab] = useState('rewards')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/rewards/mine'),
      api.get('/completions/mine'),
    ]).then(([r, c]) => {
      setRewards(r.data)
      setCompletions(c.data)
      setLoading(false)
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
  const used = rewards.filter(r => r.status !== 'available')

  return (
    <div className="min-h-screen pb-24">
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-xl bg-bg/90">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-text flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-amber flex items-center justify-center">
              <Award size={12} className="text-bg" />
            </div>
            Achievo
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/profile/edit" className="p-2 text-text-muted hover:text-text transition-colors">
              <Pencil size={16} />
            </Link>
            <button onClick={logout} className="p-2 text-text-muted hover:text-text transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* PROFILE */}
        <div className="card p-6 mb-6" style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(245,166,35,0.1) 0%, transparent 60%)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber/20 flex items-center justify-center text-2xl font-display font-bold text-amber">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-xl text-text">{user?.full_name}</p>
              <p className="text-text-muted text-sm">{user?.email}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={14} className="text-amber fill-amber" />
                <span className="font-display font-bold text-2xl text-amber">{user?.total_points || 0}</span>
              </div>
              <p className="text-text-muted text-xs">total points</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border">
            {[
              { label: 'Challenges', value: completions.length },
              { label: 'Rewards earned', value: rewards.length },
              { label: 'Available', value: available.length },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-2xl text-text">{stat.value}</p>
                <p className="text-text-muted text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-1 bg-surface p-1 rounded-xl mb-6">
          {[['rewards', 'My rewards'], ['history', 'History']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all font-display
                ${tab === t ? 'bg-surface-2 text-text font-bold' : 'text-text-muted hover:text-text'}`}>
              {l}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-amber border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'rewards' ? (
          <div className="flex flex-col gap-3">
            {rewards.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-3">🎁</div>
                <p className="font-display font-bold text-text mb-1">No rewards yet</p>
                <p className="text-text-muted text-sm mb-4">Complete challenges to earn rewards</p>
                <Link to="/browse" className="btn-primary text-sm px-4 py-2">
                  Browse businesses <ArrowRight size={14} />
                </Link>
              </div>
            ) : rewards.map(r => {
              const cfg = STATUS_CONFIG[r.status]
              return (
                <div key={r.id} className="card p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-xl flex-shrink-0">
                    🎁
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-text text-sm truncate">{r.reward_title}</p>
                    <p className="text-text-muted text-xs mt-0.5">{r.business_name}</p>
                    <span className={`${cfg.class} mt-2 inline-flex`}>{cfg.label}</span>
                  </div>
                  {r.status === 'available' && (
                    <button onClick={() => useReward(r.id)} className="btn-coral text-xs px-3 py-1.5 flex-shrink-0">
                      Claim
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {completions.length === 0 ? (
              <div className="card p-12 text-center text-text-muted">
                <p>No challenges completed yet</p>
              </div>
            ) : completions.map(c => (
              <div key={c.id} className="card p-4 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  c.status === 'confirmed' || c.status === 'claimed' ? 'bg-green-stamp' :
                  c.status === 'pending' ? 'bg-amber' : 'bg-coral'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text font-medium truncate">{c.challenge_title}</p>
                  <p className="text-xs text-text-muted">{c.business_name}</p>
                </div>
                <span className={`text-xs font-medium ${
                  c.status === 'confirmed' || c.status === 'claimed' ? 'text-green-stamp' :
                  c.status === 'pending' ? 'text-amber' : 'text-coral'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
