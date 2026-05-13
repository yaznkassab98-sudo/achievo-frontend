import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  Star, Coffee, Scissors, Hotel, UtensilsCrossed, Dumbbell,
  ArrowRight, Check, Zap, Shield, BarChart3, QrCode, Users,
  ChevronDown, MapPin, Award
} from 'lucide-react'

const PLANS = [
  { name: 'Free', price: 0, challenges: 1, staff: 1, features: ['1 active challenge', '1 staff member', 'QR code included', 'Basic analytics'] },
  { name: 'Starter', price: 29, challenges: 5, staff: 3, features: ['5 active challenges', '3 staff members', 'Email notifications', 'Analytics dashboard'], popular: false },
  { name: 'Pro', price: 79, challenges: '∞', staff: 10, features: ['Unlimited challenges', '10 staff members', 'Priority support', 'Advanced analytics', 'Custom branding'], popular: true },
  { name: 'Agency', price: 199, challenges: '∞', staff: '∞', features: ['Everything in Pro', 'Unlimited staff', 'Multi-location', 'Dedicated support', 'White-label option'] },
]

const CATEGORIES = [
  { icon: Coffee, label: 'Cafés' },
  { icon: UtensilsCrossed, label: 'Restaurants' },
  { icon: Scissors, label: 'Salons' },
  { icon: Hotel, label: 'Hotels' },
  { icon: Dumbbell, label: 'Gyms' },
]

const STEPS = [
  { n: '01', title: 'Create your challenges', desc: 'Set up tasks like "Leave a Google review" or "Visit 3 times" and attach real rewards customers actually want.' },
  { n: '02', title: 'Customers scan & complete', desc: 'They scan your QR code, see your challenges, complete them, and request confirmation from your staff.' },
  { n: '03', title: 'Staff confirms in seconds', desc: 'Your team enters a 6-digit PIN — no login, no app download. Customer gets their reward instantly.' },
]

const TESTIMONIALS = [
  { name: 'Mert Aydın', biz: 'Karaköy Roasters', text: 'We got 47 new Google reviews in the first month. The free coffee reward pays for itself five times over.', stars: 5 },
  { name: 'Selin Öztürk', biz: 'Studio Nişantaşı', text: 'My clients love collecting stamps. Repeat visits are up 40%. Best marketing tool I have ever tried.', stars: 5 },
  { name: 'Can Yılmaz', biz: 'The Bosphorus Hotel', text: 'Guests complete challenges during their stay and leave glowing reviews. Revenue from repeat guests doubled.', stars: 5 },
]

function PriceCard({ plan, annual }) {
  const price = annual ? Math.floor(plan.price * 0.8) : plan.price
  return (
    <div className={`card p-6 flex flex-col gap-4 relative ${plan.popular ? 'border-amber/50 ring-1 ring-amber/20' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="badge-amber text-xs px-3 py-1">Most Popular</span>
        </div>
      )}
      <div>
        <p className="font-display font-bold text-lg text-text">{plan.name}</p>
        <div className="flex items-end gap-1 mt-2">
          <span className="font-display font-bold text-4xl text-text">${price}</span>
          <span className="text-text-muted text-sm mb-1">/mo</span>
        </div>
        {annual && plan.price > 0 && (
          <p className="text-xs text-green-stamp mt-1">Save ${(plan.price - price) * 12}/yr</p>
        )}
      </div>
      <ul className="flex flex-col gap-2 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
            <Check size={14} className="text-amber flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link to="/auth?role=business_owner" className={plan.popular ? 'btn-primary justify-center' : 'btn-secondary justify-center'}>
        Get started {plan.price === 0 ? 'free' : ''}
      </Link>
    </div>
  )
}

export default function Landing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen font-body">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 backdrop-blur-xl bg-bg/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl text-text flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center">
              <Award size={14} className="text-bg" />
            </div>
            Achievo
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-text-muted">
            <a href="#how" className="hover:text-text transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-text transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-text transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-text-muted hover:text-text transition-colors">Sign in</Link>
            <Link to="/auth?role=business_owner" className="btn-primary text-sm px-4 py-2">
              Start free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 badge-amber mb-6 text-sm px-4 py-1.5">
            <MapPin size={12} /> Now live in Istanbul
          </div>
          <h1 className="font-display font-bold text-5xl md:text-7xl text-text leading-[1.05] tracking-tight mb-6">
            Turn every visit into{' '}
            <span className="text-amber relative">
              a loyal customer
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M2 6 Q75 2 150 6 Q225 10 298 6" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
              </svg>
            </span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Businesses create challenges. Customers earn real rewards. One platform for every café, salon, and restaurant in your city.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?role=business_owner" className="btn-primary text-base px-8 py-3.5">
              Add your business free <ArrowRight size={16} />
            </Link>
            <Link to="/browse" className="btn-secondary text-base px-8 py-3.5">
              Browse Istanbul <MapPin size={16} />
            </Link>
          </div>
        </div>

        {/* FLOATING CARDS */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-amber/5 rounded-3xl blur-3xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { biz: 'Karaköy Roasters', cat: 'Café', challenge: 'Leave a Google review', reward: 'Free cortado', emoji: '☕', completions: 143 },
              { biz: 'Studio Nişantaşı', cat: 'Salon', challenge: 'Visit 3 times this month', reward: '30% off next cut', emoji: '✂️', completions: 89 },
              { biz: 'Bosphorus Fit', cat: 'Gym', challenge: 'Refer a friend', reward: 'Free PT session', emoji: '💪', completions: 56 },
            ].map((item, i) => (
              <div key={item.biz} className={`card-hover p-5 ${i === 1 ? 'md:-mt-4' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-display font-bold text-text text-sm">{item.biz}</p>
                    <p className="text-text-muted text-xs mt-0.5">{item.cat}</p>
                  </div>
                  <span className="text-2xl">{item.emoji}</span>
                </div>
                <div className="bg-surface-2 rounded-xl p-3 mb-3">
                  <p className="text-xs text-text-muted mb-1">Challenge</p>
                  <p className="text-sm text-text font-medium">{item.challenge}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge-amber text-xs">{item.reward}</span>
                  <span className="text-xs text-text-muted">{item.completions} completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 border-y border-border overflow-hidden">
        <div className="flex items-center gap-12 animate-[scroll_20s_linear_infinite]" style={{ width: 'max-content' }}>
          {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <div key={i} className="flex items-center gap-3 text-text-muted whitespace-nowrap px-2">
              <cat.icon size={16} className="text-amber" />
              <span className="font-display font-semibold text-sm">{cat.label}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }`}</style>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">How it works</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text">
            Live in 10 minutes
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.n} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%+1rem)] w-8 border-t border-dashed border-border-2 -translate-x-4" />
              )}
              <div className="card p-6">
                <div className="font-display font-bold text-4xl text-amber/20 mb-4">{step.n}</div>
                <h3 className="font-display font-bold text-lg text-text mb-2">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-8 md:col-span-2 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="section-label mb-3">Staff PIN system</p>
              <h3 className="font-display font-bold text-3xl text-text mb-4">No login needed for your team</h3>
              <p className="text-text-muted leading-relaxed">Your staff enter a 6-digit PIN on any phone or tablet. No account, no password, no training. Customer gets confirmed in under 10 seconds.</p>
            </div>
            <div className="bg-surface-2 rounded-2xl p-6 w-full md:w-64 flex-shrink-0">
              <p className="text-xs text-text-muted mb-4 text-center">Staff confirm screen</p>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
                  <button key={i} className={`h-12 rounded-xl font-display font-bold text-lg transition-all
                    ${k === '' ? 'invisible' : 'bg-surface-3 text-text hover:bg-amber hover:text-bg'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {[
            { icon: QrCode, label: 'QR Codes', title: 'One scan, all challenges', desc: 'Printable QR codes link directly to your business page. Customers see everything in seconds.' },
            { icon: BarChart3, label: 'Analytics', title: 'See what\'s working', desc: 'Track completions, reward claims, and top challenges from your dashboard in real time.' },
            { icon: Users, label: 'City passport', title: 'One profile, every business', desc: 'Customers build a city-wide reward wallet. The more businesses they explore, the more they earn.' },
            { icon: Zap, label: 'Instant rewards', title: 'Confirmed in seconds', desc: 'The moment staff confirms, the reward appears in the customer\'s wallet. No delays, no friction.' },
          ].map(f => (
            <div key={f.title} className="card p-6">
              <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-amber" />
              </div>
              <p className="section-label mb-2">{f.label}</p>
              <h3 className="font-display font-bold text-xl text-text mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Testimonials</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text">Businesses love it</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="card p-6">
              <div className="flex gap-0.5 mb-4">
                {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} className="text-amber fill-amber" />)}
              </div>
              <p className="text-text text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold text-sm text-text">{t.name}</p>
                <p className="text-text-muted text-xs">{t.biz}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Pricing</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-text mb-6">Simple, honest pricing</h2>
          <div className="inline-flex items-center gap-3 bg-surface rounded-xl p-1">
            <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? 'bg-amber text-bg' : 'text-text-muted'}`}>Monthly</button>
            <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${annual ? 'bg-amber text-bg' : 'text-text-muted'}`}>
              Annual <span className="text-xs ml-1 text-green-stamp">-20%</span>
            </button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => <PriceCard key={p.name} plan={p} annual={annual} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center card p-12" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.12) 0%, transparent 70%)' }}>
          <p className="section-label mb-4">Get started today</p>
          <h2 className="font-display font-bold text-4xl text-text mb-4">Your first challenge is free</h2>
          <p className="text-text-muted mb-8">No credit card. No setup fees. Start earning loyalty in minutes.</p>
          <Link to="/auth?role=business_owner" className="btn-primary text-base px-8 py-4">
            Add your business <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-text">
            <div className="w-6 h-6 rounded-md bg-amber flex items-center justify-center">
              <Award size={12} className="text-bg" />
            </div>
            Achievo
          </div>
          <p className="text-text-muted text-sm">© 2026 Achievo. City loyalty, simplified.</p>
          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-text transition-colors">Terms</a>
            <a href="#" className="hover:text-text transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
