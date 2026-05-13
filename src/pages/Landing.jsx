import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  IcArrowRight, IcCheck, IcZap, IcShield, IcBarChart, IcQr,
  IcUsers, IcMapPin, IcAward, IcStar, IcCoffee, IcScissors,
  IcBuilding, IcFood, IcDumbbell,
} from '../components/Icons'

const PLANS = [
  { name: 'Free',    price: 0,   challenges: 1,   staff: 1,  features: ['1 active challenge', '1 staff member', 'QR code', 'Basic analytics'] },
  { name: 'Starter', price: 29,  challenges: 5,   staff: 3,  features: ['5 active challenges', '3 staff members', 'Email alerts', 'Analytics'] },
  { name: 'Pro',     price: 79,  challenges: '∞', staff: 10, features: ['Unlimited challenges', '10 staff members', 'Priority support', 'Advanced analytics', 'Custom branding'], hot: true },
  { name: 'Agency',  price: 199, challenges: '∞', staff: '∞',features: ['Everything in Pro', 'Unlimited staff', 'Multi-location', 'Dedicated support'] },
]

const CATS = [
  { icon: IcCoffee,   label: 'Cafés' },
  { icon: IcFood,     label: 'Restaurants' },
  { icon: IcScissors, label: 'Salons' },
  { icon: IcBuilding, label: 'Hotels' },
  { icon: IcDumbbell, label: 'Gyms' },
]

const STEPS = [
  { n: '01', title: 'Create challenges', desc: 'Set up tasks — "leave a review", "visit 3 times", "refer a friend" — and attach rewards customers actually want.' },
  { n: '02', title: 'Customers scan & complete', desc: 'They scan your QR code, browse challenges, complete them, and submit for confirmation.' },
  { n: '03', title: 'Staff confirms instantly', desc: 'Your team enters their PIN on any phone. No login. Reward appears in the customer\'s wallet in seconds.' },
]

const REVIEWS = [
  { name: 'Mert Aydın',    biz: 'Karaköy Roasters',    text: '47 new Google reviews in the first month. The free coffee pays for itself five times over.', stars: 5 },
  { name: 'Selin Öztürk',  biz: 'Studio Nişantaşı',    text: 'Clients love collecting stamps. Repeat visits up 40%. Best loyalty tool I\'ve ever tried.', stars: 5 },
  { name: 'Can Yılmaz',    biz: 'The Bosphorus Hotel',  text: 'Guests complete challenges and leave glowing reviews. Revenue from repeat guests doubled.', stars: 5 },
]

function PlanCard({ plan, annual }) {
  const price = annual ? Math.floor(plan.price * 0.8) : plan.price
  return (
    <div className={`card flex flex-col gap-5 p-6 relative transition-all duration-200 hover:-translate-y-1 ${plan.hot ? 'border-blue/40 ring-1 ring-blue/15' : ''}`}
      style={plan.hot ? { boxShadow: '0 0 40px rgba(39,103,255,0.1)' } : {}}>
      {plan.hot && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-display font-black px-3 py-0.5 rounded-full tracking-wide">
          MOST POPULAR
        </div>
      )}
      <div>
        <p className="font-display font-bold text-sm tracking-widest uppercase text-text-muted mb-3">{plan.name}</p>
        <div className="flex items-end gap-1">
          <span className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>${price}</span>
          <span className="text-text-muted text-sm mb-1">/mo</span>
        </div>
        {annual && plan.price > 0 && <p className="text-green-stamp text-xs mt-1 font-medium">Save ${(plan.price - price) * 12}/yr</p>}
      </div>
      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-text-muted">
            <IcCheck size={13} className="text-amber flex-shrink-0" />{f}
          </li>
        ))}
      </ul>
      <Link to="/auth?role=business_owner"
        className={plan.hot ? 'btn-primary justify-center text-sm' : 'btn-secondary justify-center text-sm'}>
        {plan.price === 0 ? 'Start for free' : 'Get started'}
      </Link>
    </div>
  )
}

export default function Landing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen font-body overflow-x-hidden">

      {/* NAV — dark on hero */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl" style={{ background: 'rgba(10,27,51,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-white tracking-tight" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-body" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm hidden sm:block transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.55)' }}>Sign in</Link>
            <Link to="/auth?role=business_owner" className="btn-primary text-sm px-4 py-2.5">
              Start free <IcArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — dark navy */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0A1B33 0%, #0F2444 55%, #142D55 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)"/>
        </svg>
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(39,103,255,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,138,61,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">

            <div>
              <div className="inline-flex items-center gap-2 mb-8 text-xs px-3 py-1.5 font-display font-bold tracking-widest uppercase rounded-full"
                style={{ background: 'rgba(39,103,255,0.2)', color: '#7BA7FF', border: '1px solid rgba(39,103,255,0.35)' }}>
                <IcMapPin size={11} /> Now live · Istanbul
              </div>

              <h1 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', lineHeight: '0.92', letterSpacing: '-0.04em' }}>
                <span className="block">Turn customers</span>
                <span className="block" style={{ color: '#2767FF' }}>into regulars.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Businesses create challenges. Customers earn real rewards. One platform for every café, salon, and restaurant in your city.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth?role=business_owner" className="btn-primary text-base px-8 py-3.5">
                  Start free <IcArrowRight size={16} />
                </Link>
                <Link to="/browse" className="inline-flex items-center gap-2 font-display font-bold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  Browse Istanbul <IcMapPin size={15} />
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[['500+', 'Businesses'], ['12k+', 'Rewards earned'], ['4.9★', 'Rating']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display font-black text-white" style={{ fontSize: '1.5rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — floating ticket cards on dark */}
            <div className="relative hidden lg:flex items-center justify-center h-[480px]">
              {[
                { rotate: '-3deg', translate: '-20px, 20px', delay: '0.2s', title: 'Leave us a Google Review', biz: 'Karaköy Roasters · Café', type: '⭐ Review', pts: '+100 pts', reward: 'Free Cortado' },
                { rotate: '2deg',  translate: '24px, -16px', delay: '0.8s', title: 'Visit 3 times this month',  biz: 'Studio Nişantaşı · Salon', type: '📍 Visit', pts: '+200 pts', reward: '30% off next cut' },
                { rotate: '-1deg', translate: '8px, 60px',   delay: '1.4s', title: 'Refer a friend',            biz: 'Bosphorus Fit · Gym',    type: '👥 Refer', pts: '+300 pts', reward: 'Free PT Session' },
              ].map((t, i) => (
                <div key={i} className="absolute w-72 ticket animate-float"
                  style={{ transform: `rotate(${t.rotate}) translate(${t.translate})`, animationDelay: t.delay }}>
                  <div className="ticket-body">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge-muted text-xs">{t.type}</span>
                      <span className="badge-amber text-xs">{t.pts}</span>
                    </div>
                    <p className="font-display font-bold text-text text-lg leading-tight">{t.title}</p>
                    <p className="text-text-muted text-xs mt-1.5">{t.biz}</p>
                  </div>
                  <div className="ticket-reward">
                    <p className="text-xs text-text-muted font-display uppercase tracking-widest mb-1">Reward</p>
                    <p className="font-display font-bold text-amber">{t.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLING TICKER */}
      <section className="py-10 border-y border-border overflow-hidden">
        <div className="flex items-center gap-14 animate-scroll" style={{ width: 'max-content' }}>
          {[...CATS, ...CATS, ...CATS].map((c, i) => (
            <div key={i} className="flex items-center gap-3 text-text-muted whitespace-nowrap">
              <c.icon size={15} className="text-amber flex-shrink-0" />
              <span className="font-display font-bold text-sm tracking-wide">{c.label}</span>
              <span className="text-text-faint">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 px-6 max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="section-label mb-4">How it works</p>
          <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', letterSpacing: '-0.03em', lineHeight: '1.02' }}>
            Live in 10 minutes.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {STEPS.map((step, i) => (
            <div key={step.n} className="bg-surface p-8 flex flex-col gap-4">
              <div className="font-display font-black text-blue/15" style={{ fontSize: 'clamp(3rem,6vw,5rem)', lineHeight: 1, letterSpacing: '-0.05em' }}>{step.n}</div>
              <h3 className="font-display font-bold text-xl text-text">{step.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-4">
          {/* Staff PIN — wide card */}
          <div className="md:col-span-7 card p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <p className="section-label mb-3">Staff PIN system</p>
              <h3 className="font-display font-bold text-text mb-3" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                No login needed for your team
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">Your staff enter a PIN on any phone. No account, no app, no training. Customer gets confirmed in under 10 seconds.</p>
            </div>
            <div className="bg-surface-2 rounded-2xl p-5 w-full md:w-52 flex-shrink-0 border border-border">
              <p className="text-xs text-text-muted text-center mb-4 font-display tracking-wider uppercase">Staff screen</p>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
                  <button key={i} className={`h-11 rounded-xl font-display font-bold text-base transition-all
                    ${k === '' ? 'invisible' : 'bg-surface-2 text-text hover:bg-blue/8 hover:text-blue border border-border hover:border-blue/30'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="md:col-span-5 card p-7">
            <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
              <IcQr size={18} className="text-blue" />
            </div>
            <p className="section-label mb-2">QR Codes</p>
            <h3 className="font-display font-bold text-xl text-text mb-2">One scan, all challenges</h3>
            <p className="text-text-muted text-sm leading-relaxed">Printable QR codes link directly to your business page. Customers see everything in seconds.</p>
          </div>

          {/* Analytics */}
          <div className="md:col-span-4 card p-7">
            <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
              <IcBarChart size={18} className="text-blue" />
            </div>
            <p className="section-label mb-2">Analytics</p>
            <h3 className="font-display font-bold text-xl text-text mb-2">See what's working</h3>
            <p className="text-text-muted text-sm leading-relaxed">Track completions and top challenges from your dashboard.</p>
          </div>

          {/* City passport */}
          <div className="md:col-span-4 card p-7">
            <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center mb-5">
              <IcUsers size={18} className="text-coral" />
            </div>
            <p className="section-label mb-2" style={{ color: '#FF8C6A' }}>City passport</p>
            <h3 className="font-display font-bold text-xl text-text mb-2">One profile, every business</h3>
            <p className="text-text-muted text-sm leading-relaxed">Customers build a city-wide reward wallet as they explore.</p>
          </div>

          {/* Instant */}
          <div className="md:col-span-4 card p-7">
            <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center mb-5">
              <IcZap size={18} className="text-blue" />
            </div>
            <p className="section-label mb-2">Instant</p>
            <h3 className="font-display font-bold text-xl text-text mb-2">Confirmed in seconds</h3>
            <p className="text-text-muted text-sm leading-relaxed">The moment staff confirms, the reward appears. No delays, no friction.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="section-label mb-4">Testimonials</p>
          <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Businesses love it.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={r.name} className="card p-7 flex flex-col gap-5">
              <div className="flex gap-0.5">
                {Array(r.stars).fill(0).map((_, j) => <IcStar key={j} size={13} className="text-amber" />)}
              </div>
              <p className="text-text text-sm leading-relaxed flex-1">"{r.text}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-display font-bold text-sm text-text">{r.name}</p>
                <p className="text-text-muted text-xs mt-0.5">{r.biz}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="section-label mb-4">Pricing</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Simple,<br />honest pricing.
            </h2>
            <div className="inline-flex items-center gap-2 bg-surface border border-border p-1 rounded-xl self-start sm:self-auto">
              <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${!annual ? 'bg-blue text-white' : 'text-text-muted'}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${annual ? 'bg-blue text-white' : 'text-text-muted'}`}>
                Annual <span className="text-xs ml-1 text-green-stamp">−20%</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => <PlanCard key={p.name} plan={p} annual={annual} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% -20%, rgba(39,103,255,0.08) 0%, transparent 65%)' }} />
            <p className="section-label mb-5 relative">Get started today</p>
            <h2 className="font-display font-black text-text relative mb-5" style={{ fontSize: 'clamp(2.25rem,5vw,3.75rem)', letterSpacing: '-0.04em', lineHeight: '0.95' }}>
              Your first challenge<br />is free.
            </h2>
            <p className="text-text-muted mb-10 relative">No credit card. No setup fees. Start earning loyalty in minutes.</p>
            <Link to="/auth?role=business_owner" className="btn-primary text-base px-10 py-4 relative">
              Add your business <IcArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue flex items-center justify-center">
              <IcAward size={12} className="text-white" />
            </div>
            <span className="font-display font-black text-text tracking-tight" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </div>
          <p className="text-text-faint text-sm">© 2026 Achievo. City loyalty, simplified.</p>
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
