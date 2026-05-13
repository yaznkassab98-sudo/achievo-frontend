import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Globe, Phone, Check, Clock, Award } from 'lucide-react'
import api from '../api/client'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import BottomNav from '../components/BottomNav'
import NotFound from './NotFound'

const TYPE_LABELS = { review: '⭐ Review', visit: '📍 Visit', referral: '👥 Referral', purchase: '🛒 Purchase', social: '📱 Social', custom: '✨ Custom' }

function ChallengeCard({ challenge }) {
  const { user } = useAuthStore()
  const { toast } = useToastStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

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
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="badge-muted text-xs">{TYPE_LABELS[challenge.type] || challenge.type}</span>
            {challenge.points_value > 0 && <span className="badge-amber text-xs">+{challenge.points_value} pts</span>}
            {challenge.expires_at && (
              <span className="badge-coral text-xs flex items-center gap-1">
                <Clock size={10} /> Expires {new Date(challenge.expires_at).toLocaleDateString()}
              </span>
            )}
          </div>
          <h3 className="font-display font-bold text-text">{challenge.title}</h3>
          {challenge.description && <p className="text-text-muted text-sm mt-1 leading-relaxed">{challenge.description}</p>}
        </div>
      </div>

      <div className="bg-surface-2 rounded-xl p-4 mb-4">
        <p className="text-xs text-text-muted mb-1">Your reward</p>
        <p className="font-display font-semibold text-amber">{challenge.reward_title}</p>
        {challenge.reward_description && <p className="text-text-muted text-xs mt-1">{challenge.reward_description}</p>}
        {challenge.discount_percent && <p className="text-green-stamp text-xs mt-1 font-medium">{challenge.discount_percent}% off</p>}
      </div>

      {done ? (
        <div className="flex items-center gap-2 bg-green-stamp/10 border border-green-stamp/20 text-green-stamp rounded-xl px-4 py-3 text-sm font-medium">
          <Check size={16} /> Submitted! Waiting for staff confirmation.
        </div>
      ) : (
        <button onClick={complete} disabled={loading} className="btn-primary w-full justify-center">
          {loading ? 'Submitting...' : 'Complete this challenge'}
        </button>
      )}
    </div>
  )
}

export default function BusinessPage() {
  const { slug } = useParams()
  const [biz, setBiz] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/businesses/slug/${slug}`).then(r => {
      setBiz(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-screen pb-24">
      <div className="h-48 bg-surface-2 animate-pulse" />
      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-16">
        <div className="flex items-end gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 animate-pulse flex-shrink-0" />
          <div className="pb-1 flex-1">
            <div className="h-6 bg-surface-2 rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-surface-2 rounded w-32 animate-pulse" />
          </div>
        </div>
        {[1,2].map(i => (
          <div key={i} className="card p-5 mb-4 animate-pulse">
            <div className="h-4 bg-surface-2 rounded w-3/4 mb-3" />
            <div className="h-16 bg-surface-2 rounded mb-3" />
            <div className="h-10 bg-surface-2 rounded" />
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  )

  if (!biz) return (
    <NotFound />
  )

  return (
    <div className="min-h-screen">
      {/* COVER */}
      <div className="h-48 bg-surface-2 relative overflow-hidden">
        {biz.cover_url && <img src={biz.cover_url} className="w-full h-full object-cover" alt="" />}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <Link to="/browse" className="absolute top-4 left-4 bg-bg/70 backdrop-blur-sm border border-border rounded-xl px-3 py-2 flex items-center gap-1.5 text-text-muted text-sm hover:text-text transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-28">
        {/* HEADER */}
        <div className="flex items-end gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl border-2 border-border bg-surface-2 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
            {biz.logo_url ? <img src={biz.logo_url} className="w-full h-full object-cover" alt="" /> : '🏪'}
          </div>
          <div className="pb-1">
            <h1 className="font-display font-bold text-2xl text-text">{biz.name}</h1>
            <p className="text-text-muted text-sm capitalize">{biz.category} · {biz.city_name}</p>
          </div>
        </div>

        {biz.description && (
          <p className="text-text-muted text-sm leading-relaxed mb-6">{biz.description}</p>
        )}

        {/* LINKS */}
        <div className="flex flex-wrap gap-2 mb-8">
          {biz.address && (
            <a href={biz.google_maps_url || '#'} target="_blank" rel="noreferrer" className="badge-muted text-xs flex items-center gap-1">
              <MapPin size={10} /> {biz.address}
            </a>
          )}
          {biz.website && (
            <a href={biz.website} target="_blank" rel="noreferrer" className="badge-muted text-xs flex items-center gap-1">
              <Globe size={10} /> Website
            </a>
          )}
          {biz.phone && (
            <a href={`tel:${biz.phone}`} className="badge-muted text-xs flex items-center gap-1">
              <Phone size={10} /> {biz.phone}
            </a>
          )}
        </div>

        {/* CHALLENGES */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-amber" />
            <h2 className="font-display font-bold text-lg text-text">Active challenges</h2>
            <span className="badge-amber text-xs">{biz.challenges?.length || 0}</span>
          </div>

          {!biz.challenges?.length ? (
            <div className="card p-8 text-center text-text-muted">
              <p className="text-2xl mb-2">🎯</p>
              <p className="text-sm">No active challenges right now</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {biz.challenges.map(c => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
