export const TIERS = [
  { name: 'Bronze',   min: 0,    max: 99,   emoji: '🥉', color: '#CD7F32', bg: 'rgba(205,127,50,0.12)',  border: 'rgba(205,127,50,0.3)'  },
  { name: 'Silver',   min: 100,  max: 499,  emoji: '🥈', color: '#A8B8C8', bg: 'rgba(168,184,200,0.12)', border: 'rgba(168,184,200,0.3)' },
  { name: 'Gold',     min: 500,  max: 999,  emoji: '🥇', color: '#F5A623', bg: 'rgba(245,166,35,0.12)',  border: 'rgba(245,166,35,0.3)'  },
  { name: 'Platinum', min: 1000, max: Infinity, emoji: '💎', color: '#38BDF8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)' },
]

export function getTier(points = 0) {
  return TIERS.findLast(t => points >= t.min) || TIERS[0]
}

export function getNextTier(points = 0) {
  return TIERS.find(t => points < t.min) || null
}

export function getTierProgress(points = 0) {
  const current = getTier(points)
  const next = getNextTier(points)
  if (!next) return { pct: 100, remaining: 0 }
  const pct = Math.round(((points - current.min) / (next.min - current.min)) * 100)
  return { pct, remaining: next.min - points }
}
