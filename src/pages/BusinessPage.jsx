import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { IcArrowLeft, IcMapPin, IcGlobe, IcPhone, IcCheck, IcClock, IcAward, IcStar, IcInstagram, IcHash } from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'
import NotFound from './NotFound'
import { getTier } from '../utils/tier'

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function TodayHours({ hours }) {
  const todayKey = DAY_KEYS[new Date().getDay()]
  const today = hours?.[todayKey]
  if (!today) return null
  if (today.closed) return (
    <span className="badge-muted text-xs flex items-center gap-1.5 text-coral border-coral/20">
      <IcClock size={10} /> Closed today
    </span>
  )
  return (
    <span className="badge-muted text-xs flex items-center gap-1.5 text-green-stamp border-green-stamp/20">
      <IcClock size={10} /> {today.open} – {today.close}
    </span>
  )
}

const TYPE_META = {
  review:   { label: 'Review',   color: '#F5A623' },
  visit:    { label: 'Visit',    color: '#38BDF8' },
  referral: { label: 'Referral', color: '#A78BFA' },
  purchase: { label: 'Purchase', color: '#22C55E' },
  social:   { label: 'Social',   color: '#F472B6' },
  custom:   { label: 'Custom',   color: '#FB923C' },
}

function ChallengeTicket({ challenge, status }) {
  const { user } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [localStatus, setLocalStatus] = useState(status || null)

  const meta = TYPE_META[challenge.type] || TYPE_META.custom

  const complete = async () => {
    if (!user) { navigate('/auth'); return }
    setLoading(true)
    try {
      await api.post('/completions', { challengeId: challenge.id })
      setLocalStatus('pending')
      toast('Challenge submitted! Waiting for staff confirmation.', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Error submitting', 'error')
    } finally {
      setLoading(false)
    }
  }

  const isPending = localStatus === 'pending'
  const isDone = localStatus === 'confirmed' || localStatus === 'claimed'

  return (
    <div className="ticket">
      <div className="ticket-body">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge text-xs font-display font-bold px-2.5 py-1"
              style={{ backgroundColor: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
              {meta.label}
            </span>
            {challenge.points_value > 0 && (
              <span className="badge-amber text-xs">+{challenge.points_value} pts</span>
            )}
            {challenge.expires_at && (
              <span className="badge-coral text-xs flex items-center gap-1">
                <IcClock size={10} /> Expires {new Date(challenge.expires_at).toLocaleDateString()}
              </span>
            )}
          </div>
          {isDone && (
            <div className="w-7 h-7 rounded-full bg-green-stamp/15 flex items-center justify-center flex-shrink-0">
              <IcCheck size={13} className="text-green-stamp" />
            </div>
          )}
        </div>

        <h3 className="font-display font-black text-text mb-2" style={{ fontSize: 'clamp(1.1rem,3vw,1.4rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {challenge.title}
        </h3>
        {challenge.description && (
          <p className="text-text-muted text-sm leading-relaxed">{challenge.description}</p>
        )}
      </div>

      <div className="ticket-reward">
        <p className="section-label text-[10px] mb-1.5">Your reward</p>
        <p className="font-display font-black text-amber" style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', letterSpacing: '-0.02em' }}>
          {challenge.reward_title}
        </p>
        {challenge.reward_description && (
          <p className="text-text-muted text-xs mt-1">{challenge.reward_description}</p>
        )}
        {challenge.discount_percent && (
          <p className="text-green-stamp text-xs mt-1 font-bold">{challenge.discount_percent}% off</p>
        )}

        <div className="mt-4">
          {isDone ? (
            <div className="flex items-center gap-2.5 bg-green-stamp/10 border border-green-stamp/25 text-green-stamp rounded-xl px-4 py-3 text-sm font-display font-bold">
              <IcCheck size={16} /> Completed — reward unlocked
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-2.5 bg-amber/10 border border-amber/25 text-amber rounded-xl px-4 py-3 text-sm font-display font-bold">
              <IcClock size={16} /> Waiting for staff confirmation
            </div>
          ) : (
            <button onClick={complete} disabled={loading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-40">
              {loading ? 'Submitting...' : 'Complete this challenge'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BusinessPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [biz, setBiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progressMap, setProgressMap] = useState({})
  const [leaderboard, setLeaderboard] = useState([])
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    api.get(`/businesses/slug/${slug}`).then(r => {
      setBiz(r.data); setLoading(false)
      api.get(`/businesses/${r.data.id}/leaderboard`).then(lb => setLeaderboard(lb.data)).catch(() => {})
    }).catch(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (user && biz?.id) {
      api.get(`/follows/${biz.id}/check`)
        .then(r => setFollowing(r.data.following))
        .catch(() => {})
    }
  }, [user, biz?.id])

  useEffect(() => {
    if (user && biz?.id) {
      api.get(`/completions/progress/${biz.id}`)
        .then(r => {
          const map = {}
          r.data.forEach(row => { map[row.challenge_id] = row.status })
          setProgressMap(map)
        })
        .catch(() => {})
    }
  }, [user, biz?.id])

  if (loading) return (
    <div className="min-h-screen pb-28">
      <div className="h-52 bg-surface-2 animate-pulse" />
      <div className="max-w-2xl mx-auto px-4 -mt-14 pb-16">
        <div className="flex items-end gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 animate-pulse flex-shrink-0" />
          <div className="pb-1 flex-1">
            <div className="h-6 bg-surface-2 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-surface-2 rounded w-32 animate-pulse" />
          </div>
        </div>
        {[1,2].map(i => <div key={i} className="ticket mb-4 animate-pulse"><div className="ticket-body h-28" /><div className="ticket-reward h-20" /></div>)}
      </div>
      <BottomNav />
    </div>
  )

  if (!biz) return <NotFound />

  const completed = biz.challenges?.filter(c => ['confirmed','claimed'].includes(progressMap[c.id])).length || 0
  const total = biz.challenges?.length || 0

  const toggleFollow = async () => {
    if (!user) { navigate('/auth'); return }
    setFollowLoading(true)
    try {
      if (following) {
        await api.delete(`/follows/${biz.id}`)
        setFollowing(false)
      } else {
        await api.post('/follows', { businessId: biz.id })
        setFollowing(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* COVER */}
      <div className="h-52 bg-surface-2 relative overflow-hidden">
        {biz.cover_url
          ? <img src={biz.cover_url} className="w-full h-full object-cover" alt="" />
          : (
            <div className="w-full h-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #0A1B33 0%, #142D55 100%)',
            }}>
              <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="cg" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2767FF" strokeWidth="1"/>
                </pattern></defs>
                <rect width="100%" height="100%" fill="url(#cg)"/>
              </svg>
            </div>
          )
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #07080F 0%, rgba(7,8,15,0.5) 50%, transparent 100%)' }} />
        <Link to="/browse" className="absolute top-4 left-4 bg-bg/70 backdrop-blur-md border border-border/60 rounded-xl px-3 py-2 flex items-center gap-1.5 text-text-muted text-sm hover:text-text transition-colors group">
          <IcArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> Browse
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-14 pb-32">
        {/* HEADER */}
        <div className="flex items-end gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl border-2 border-border bg-surface-2 flex items-center justify-center font-display font-black text-3xl flex-shrink-0 overflow-hidden text-text-muted"
            style={{ background: 'linear-gradient(135deg, #1F2340, #111320)' }}>
            {biz.logo_url ? <img src={biz.logo_url} className="w-full h-full object-cover" alt="" /> : (biz.name?.[0] || '?')}
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {biz.name}
            </h1>
            {biz.tagline
              ? <p className="text-text-muted text-sm mt-1 leading-snug">{biz.tagline}</p>
              : <p className="text-text-muted text-sm mt-1 capitalize">{biz.category} · {biz.city_name}</p>
            }
            {biz.tagline && <p className="text-text-faint text-xs mt-0.5 capitalize">{biz.category} · {biz.city_name}</p>}
          </div>
          {user && (
            <button onClick={toggleFollow} disabled={followLoading}
              className={`btn-secondary text-sm px-4 py-2 flex-shrink-0 disabled:opacity-40 ${following ? 'border-blue/40 text-blue' : ''}`}>
              {followLoading ? '...' : following ? '✓ Following' : 'Follow'}
            </button>
          )}
        </div>

        {(parseInt(biz.weekly_completions) > 0 || parseInt(biz.total_completions) > 0) && (
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {parseInt(biz.weekly_completions) > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-stamp animate-pulse flex-shrink-0" />
                <span className="text-sm font-semibold text-green-stamp">
                  {biz.weekly_completions} {parseInt(biz.weekly_completions) === 1 ? 'person' : 'people'} active this week
                </span>
              </div>
            )}
            {parseInt(biz.total_completions) > 0 && (
              <span className="text-xs text-text-muted">
                · {biz.total_completions} challenges completed all-time
              </span>
            )}
          </div>
        )}

        {biz.description && (
          <p className="text-text-muted text-sm leading-relaxed mb-4">{biz.description}</p>
        )}

        {/* LINKS */}
        <div className="flex flex-wrap gap-2 mb-4">
          {biz.address && (
            <a href={biz.google_maps_url || '#'} target="_blank" rel="noreferrer"
              className="badge-muted text-xs flex items-center gap-1.5 hover:border-blue/40 hover:text-text transition-colors">
              <IcMapPin size={10} /> {biz.address}
            </a>
          )}
          {biz.website && (
            <a href={biz.website} target="_blank" rel="noreferrer"
              className="badge-muted text-xs flex items-center gap-1.5 hover:border-blue/40 hover:text-text transition-colors">
              <IcGlobe size={10} /> Website
            </a>
          )}
          {biz.instagram && (
            <a href={`https://instagram.com/${biz.instagram}`} target="_blank" rel="noreferrer"
              className="badge-muted text-xs flex items-center gap-1.5 hover:border-blue/40 hover:text-text transition-colors">
              <IcInstagram size={10} /> @{biz.instagram}
            </a>
          )}
          {biz.phone && (
            <a href={`tel:${biz.phone}`} className="badge-muted text-xs flex items-center gap-1.5 hover:border-blue/40 hover:text-text transition-colors">
              <IcPhone size={10} /> {biz.phone}
            </a>
          )}
          {biz.opening_hours && <TodayHours hours={biz.opening_hours} />}
        </div>

        {/* TAGS */}
        {biz.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {biz.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-2 border border-border/60 text-[11px] text-text-faint">
                <IcHash size={8} />#{tag}
              </span>
            ))}
          </div>
        )}

        {/* PROGRESS SUMMARY — only if user is logged in and there are challenges */}
        {user && total > 0 && (
          <div className="card p-4 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center flex-shrink-0">
              <IcStar size={18} className="text-amber" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-bold text-text">Your progress</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full rounded-full bg-amber transition-all duration-500"
                    style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%' }} />
                </div>
                <span className="text-xs text-text-muted font-mono flex-shrink-0">{completed}/{total}</span>
              </div>
            </div>
          </div>
        )}

        {/* CHALLENGES */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <IcAward size={16} className="text-amber" />
            <h2 className="font-display font-bold text-lg text-text">Active challenges</h2>
            <span className="badge-amber text-xs">{total}</span>
          </div>

          {!total ? (
            <div className="card p-10 text-center text-text-muted">
              <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <IcAward size={24} className="text-text-faint" />
              </div>
              <p className="font-display font-bold text-text mb-1">No active challenges</p>
              <p className="text-sm">Check back soon</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {biz.challenges.map(c => (
                <ChallengeTicket key={c.id} challenge={c} status={progressMap[c.id] || null} />
              ))}
            </div>
          )}
        </div>

        {/* LEADERBOARD */}
        {leaderboard.length > 0 && (() => {
          const userRank = user ? leaderboard.findIndex(e => e.id === user.id) : -1
          const medals = ['🥇', '🥈', '🥉']
          const rankColors = ['#F5A623', '#9CA3AF', '#CD7F32']

          return (
            <div className="mt-10">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0A1B33 0%, #0F2444 100%)', border: '1px solid rgba(39,103,255,0.15)' }}>
                {/* Header */}
                <div className="px-5 pt-5 pb-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.2)' }}>
                    <IcStar size={15} className="text-amber" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>Leaderboard</h2>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Top regulars at {biz.name}</p>
                  </div>
                  <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.2)' }}>
                    Top {leaderboard.length}
                  </span>
                </div>

                {/* Top 3 podium */}
                {leaderboard.length >= 2 && (
                  <div className="flex items-end justify-center gap-3 px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {[1, 0, 2].filter(i => leaderboard[i]).map((i) => {
                      const e = leaderboard[i]
                      const isMe = user?.id === e.id
                      const heights = ['h-20', 'h-28', 'h-16']
                      const podiumHeight = heights[i]
                      return (
                        <div key={e.id} className="flex flex-col items-center gap-2 flex-1">
                          <div className="relative">
                            {i === 0 && (
                              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg">👑</span>
                            )}
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-lg overflow-hidden border-2 mx-auto"
                              style={{ borderColor: rankColors[i], background: 'rgba(255,255,255,0.07)', color: rankColors[i] }}>
                              {e.avatar_url
                                ? <img src={e.avatar_url} className="w-full h-full object-cover" alt="" />
                                : e.full_name?.[0]?.toUpperCase()}
                            </div>
                            {isMe && (
                              <span className="absolute -bottom-1 -right-1 text-[9px] font-black px-1 py-0.5 rounded-full"
                                style={{ background: '#2767FF', color: 'white' }}>You</span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-center truncate w-full px-1 max-w-[80px]"
                            style={{ color: isMe ? '#7BA7FF' : 'rgba(255,255,255,0.8)' }}>
                            {e.full_name?.split(' ')[0]}
                            <span className="ml-1">{getTier(e.total_points).emoji}</span>
                          </p>
                          <div className={`w-full ${podiumHeight} rounded-t-xl flex flex-col items-center justify-center gap-0.5`}
                            style={{ background: i === 0 ? 'rgba(245,166,35,0.2)' : i === 1 ? 'rgba(156,163,175,0.12)' : 'rgba(205,127,50,0.12)', border: `1px solid ${rankColors[i]}25` }}>
                            <span className="text-lg">{medals[i]}</span>
                            <p className="font-display font-black tabular-nums" style={{ color: rankColors[i], fontSize: '0.85rem', letterSpacing: '-0.03em' }}>
                              {e.total_points}
                            </p>
                            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>pts</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Rest of list (4+) */}
                {leaderboard.slice(3).map((entry, idx) => {
                  const i = idx + 3
                  const isMe = user?.id === entry.id
                  return (
                    <div key={entry.id}
                      className="flex items-center gap-3 px-5 py-3"
                      style={{
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        background: isMe ? 'rgba(39,103,255,0.08)' : 'transparent',
                      }}>
                      <span className="w-5 text-center font-mono text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {i + 1}
                      </span>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0 overflow-hidden"
                        style={{ background: isMe ? 'rgba(39,103,255,0.25)' : 'rgba(255,255,255,0.07)', color: isMe ? '#7BA7FF' : 'rgba(255,255,255,0.6)', border: isMe ? '1px solid rgba(39,103,255,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                        {entry.avatar_url
                          ? <img src={entry.avatar_url} className="w-full h-full object-cover" alt="" />
                          : entry.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: isMe ? '#7BA7FF' : 'rgba(255,255,255,0.75)' }}>
                          {entry.full_name}{isMe ? ' (you)' : ''}
                          <span className="ml-1 text-xs opacity-70">{getTier(entry.total_points).emoji}</span>
                        </p>
                        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {entry.completions} challenge{entry.completions !== '1' ? 's' : ''}
                        </p>
                      </div>
                      <p className="font-display font-black tabular-nums text-sm flex-shrink-0" style={{ color: '#F5A623', letterSpacing: '-0.03em' }}>
                        {entry.total_points} <span className="text-[10px] font-normal" style={{ color: 'rgba(255,255,255,0.25)' }}>pts</span>
                      </p>
                    </div>
                  )
                })}

                {/* Current user not on board */}
                {user && userRank === -1 && (
                  <div className="px-5 py-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(39,103,255,0.05)' }}>
                    <span className="w-5 text-center text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm flex-shrink-0"
                      style={{ background: 'rgba(39,103,255,0.2)', color: '#7BA7FF', border: '1px solid rgba(39,103,255,0.3)' }}>
                      {user.full_name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: '#7BA7FF' }}>You</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Complete a challenge to join the board</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

      </div>
      <BottomNav />
    </div>
  )
}
