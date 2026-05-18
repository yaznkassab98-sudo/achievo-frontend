import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { IcArrowLeft, IcPencil, IcMapPin, IcAward, IcStar, IcGift, IcUsers } from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import BottomNav from '../components/BottomNav'
import { getTier, getNextTier, getTierProgress } from '../utils/tier'

const STAT_LABELS = [
  { key: 'total_points',        label: 'Points',      icon: IcStar,   color: 'text-amber'       },
  { key: 'challenges_completed',label: 'Challenges',  icon: IcAward,  color: 'text-blue'        },
  { key: 'businesses_visited',  label: 'Businesses',  icon: IcUsers,  color: 'text-violet-400'  },
  { key: 'rewards_claimed',     label: 'Rewards',     icon: IcGift,   color: 'text-green-stamp' },
]

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const d = Math.floor(diff / 86400000)
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  if (d < 7)  return `${d} days ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

export default function Profile() {
  const { id: paramId } = useParams()
  const { user: me } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const targetId = paramId || me?.id
  const isOwn = !paramId || paramId === me?.id

  useEffect(() => {
    if (!targetId) return
    setLoading(true)
    api.get(`/users/${targetId}/profile`)
      .then(r => setProfile(r.data))
      .catch(() => setError('Profile not found'))
      .finally(() => setLoading(false))
  }, [targetId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-8 h-8 rounded-full border-2 border-blue border-t-transparent animate-spin" />
    </div>
  )

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-text-muted">
      <span className="text-4xl">👤</span>
      <p className="font-display font-bold text-text">Profile not found</p>
      <Link to="/browse" className="btn-secondary text-sm">Back to browse</Link>
    </div>
  )

  const initials = profile.full_name?.[0]?.toUpperCase() || '?'
  const memberYear = new Date(profile.created_at).getFullYear()
  const earned = profile.achievements.filter(a => a.earned)
  const locked = profile.achievements.filter(a => !a.earned)
  const pts = profile.total_points || 0
  const tier = getTier(pts)
  const next = getNextTier(pts)
  const { pct, remaining } = getTierProgress(pts)

  return (
    <div className="min-h-screen pb-28">
      <nav className="sticky top-0 z-40 border-b border-border/50 backdrop-blur-2xl bg-bg/90">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link to={isOwn ? '/wallet' : '/browse'}
            className="p-2 text-text-muted hover:text-text transition-colors rounded-xl hover:bg-surface-2 group">
            <IcArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <span className="font-display font-bold text-text flex-1">
            {isOwn ? 'My Profile' : profile.full_name}
          </span>
          {isOwn && (
            <Link to="/profile/edit" className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
              <IcPencil size={12} /> Edit
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">

        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0" style={{
            background: profile.avatar_url
              ? `radial-gradient(ellipse at 50% 0%, rgba(39,103,255,0.25) 0%, transparent 70%), linear-gradient(135deg, #0A1B33, #07080F)`
              : `linear-gradient(135deg, #0A1B33 0%, #142D55 50%, #1a0a2e 100%)`,
          }} />
          <div className="relative px-6 pt-8 pb-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-border bg-surface-2 flex items-center justify-center overflow-hidden mb-4 shadow-2xl">
              {profile.avatar_url
                ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                : <span className="font-display font-black text-blue text-3xl">{initials}</span>
              }
            </div>
            <h1 className="font-display font-black text-text text-2xl tracking-tight">{profile.full_name}</h1>
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-black"
              style={{ background: tier.bg, color: tier.color, border: `1px solid ${tier.border}` }}>
              {tier.emoji} {tier.name}
            </span>
            {profile.bio && (
              <p className="text-text-muted text-sm mt-2 leading-relaxed max-w-xs">{profile.bio}</p>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
              {profile.city_name && (
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <IcMapPin size={11} className="text-text-faint" /> {profile.city_name}
                </span>
              )}
              <span className="text-text-faint text-xs">·</span>
              <span className="text-xs text-text-muted">Member since {memberYear}</span>
            </div>
            {next && (
              <div className="mt-3 w-full max-w-xs">
                <div className="flex justify-between text-[10px] text-text-faint mb-1">
                  <span>{tier.emoji} {tier.name}</span>
                  <span style={{ color: next.color }}>{next.emoji} {next.name} · {remaining} pts away</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${tier.color}, ${next.color})` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {STAT_LABELS.map(({ key, label, icon: Icon, color }) => {
            const val = key === 'total_points' ? profile.total_points : profile.stats[key]
            return (
              <div key={key} className="card p-3 flex flex-col items-center gap-1.5">
                <Icon size={16} className={color} />
                <span className="font-display font-black text-text text-lg leading-none">{val ?? 0}</span>
                <span className="text-[10px] text-text-faint text-center leading-tight">{label}</span>
              </div>
            )
          })}
        </div>

        {/* Achievements */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏅</span>
            <h2 className="font-display font-bold text-text">Achievements</h2>
            {earned.length > 0 && (
              <span className="badge-blue text-xs">{earned.length}/{profile.achievements.length}</span>
            )}
          </div>

          {earned.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <p className="font-display font-bold text-text text-sm">No badges yet</p>
              <p className="text-xs text-text-muted mt-1">Complete challenges to earn your first badge</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {earned.map(a => (
                <div key={a.type} className="card p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}30` }}>
                    {a.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-text text-sm">{a.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{a.desc}</p>
                  </div>
                  {a.awarded_at && (
                    <span className="text-[11px] text-text-faint flex-shrink-0">{timeAgo(a.awarded_at)}</span>
                  )}
                </div>
              ))}

              {locked.length > 0 && (
                <div className="mt-1">
                  <p className="text-xs text-text-faint mb-2 px-1">Locked</p>
                  <div className="grid grid-cols-3 gap-2">
                    {locked.map(a => (
                      <div key={a.type} className="card p-3 flex flex-col items-center gap-1.5 opacity-40">
                        <span className="text-xl grayscale">{a.emoji}</span>
                        <p className="text-[10px] text-text-faint text-center leading-tight">{a.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent activity */}
        {profile.recent_activity?.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-text mb-4">Recent activity</h2>
            <div className="flex flex-col gap-2">
              {profile.recent_activity.map((item, i) => (
                <Link key={i} to={`/b/${item.business_slug}`}
                  className="card p-4 flex items-center gap-3 hover:border-border/80 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0 overflow-hidden font-display font-black text-text-muted text-sm"
                    style={{ background: 'linear-gradient(135deg,#1F2340,#111320)' }}>
                    {item.business_logo
                      ? <img src={item.business_logo} className="w-full h-full object-cover" alt="" />
                      : item.business_name?.[0]
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{item.challenge_title}</p>
                    <p className="text-xs text-text-muted truncate">{item.business_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {item.points_value > 0 && (
                      <span className="text-xs font-bold text-amber">+{item.points_value}pt</span>
                    )}
                    <span className="text-[11px] text-text-faint">{timeAgo(item.completed_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  )
}
