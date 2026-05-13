import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { IcArrowLeft, IcMapPin, IcGlobe, IcPhone, IcCheck, IcClock, IcAward } from '../components/Icons'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'
import NotFound from './NotFound'

const TYPE_META = {
  review:   { label: 'Review',   color: '#F5A623' },
  visit:    { label: 'Visit',    color: '#38BDF8' },
  referral: { label: 'Referral', color: '#A78BFA' },
  purchase: { label: 'Purchase', color: '#22C55E' },
  social:   { label: 'Social',   color: '#F472B6' },
  custom:   { label: 'Custom',   color: '#FB923C' },
}

function ChallengeTicket({ challenge }) {
  const { user } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const meta = TYPE_META[challenge.type] || TYPE_META.custom

  const complete = async () => {
    if (!user) { navigate('/auth'); return }
    setLoading(true)
    try {
      await api.post('/completions', { challengeId: challenge.id })
      setDone(true)
      toast('Challenge submitted! Waiting for staff confirmation.', 'success')
    } catch (err) {
      toast(err.response?.data?.error || 'Error submitting', 'error')
    } finally {
      setLoading(false)
    }
  }

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
          {done ? (
            <div className="flex items-center gap-2.5 bg-green-stamp/10 border border-green-stamp/25 text-green-stamp rounded-xl px-4 py-3 text-sm font-display font-bold animate-stamp">
              <IcCheck size={16} /> Submitted — waiting for staff
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
  const [biz, setBiz] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/businesses/slug/${slug}`).then(r => {
      setBiz(r.data); setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

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

  return (
    <div className="min-h-screen">
      {/* COVER */}
      <div className="h-52 bg-surface-2 relative overflow-hidden">
        {biz.cover_url
          ? <img src={biz.cover_url} className="w-full h-full object-cover" alt="" />
          : (
            <div className="w-full h-full flex items-center justify-center" style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(245,166,35,0.15) 0%, transparent 60%)',
            }}>
              <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="cg" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F5A623" strokeWidth="1"/>
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
          <div className="pb-1">
            <h1 className="font-display font-black text-text" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {biz.name}
            </h1>
            <p className="text-text-muted text-sm mt-1 capitalize">{biz.category} · {biz.city_name}</p>
          </div>
        </div>

        {biz.description && (
          <p className="text-text-muted text-sm leading-relaxed mb-6">{biz.description}</p>
        )}

        {/* LINKS */}
        <div className="flex flex-wrap gap-2 mb-10">
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
          {biz.phone && (
            <a href={`tel:${biz.phone}`} className="badge-muted text-xs flex items-center gap-1.5 hover:border-blue/40 hover:text-text transition-colors">
              <IcPhone size={10} /> {biz.phone}
            </a>
          )}
        </div>

        {/* CHALLENGES */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <IcAward size={16} className="text-amber" />
            <h2 className="font-display font-bold text-lg text-text">Active challenges</h2>
            <span className="badge-amber text-xs">{biz.challenges?.length || 0}</span>
          </div>

          {!biz.challenges?.length ? (
            <div className="card p-10 text-center text-text-muted">
              <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <IcAward size={24} className="text-text-faint" />
              </div>
              <p className="font-display font-bold text-text mb-1">No active challenges</p>
              <p className="text-sm">Check back soon</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {biz.challenges.map(c => <ChallengeTicket key={c.id} challenge={c} />)}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
