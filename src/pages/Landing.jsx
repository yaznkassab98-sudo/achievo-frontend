import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  IcArrowRight, IcCheck, IcZap, IcBarChart, IcQr,
  IcUsers, IcMapPin, IcAward, IcStar, IcCoffee, IcScissors,
  IcBuilding, IcFood, IcDumbbell,
} from '../components/Icons'

const PLANS = [
  { name: 'Free',    price: 0,   features: ['1 active challenge', '1 staff member', 'QR code', 'Basic analytics'] },
  { name: 'Starter', price: 29,  features: ['5 active challenges', '3 staff members', 'Email alerts', 'Analytics'] },
  { name: 'Pro',     price: 79,  features: ['Unlimited challenges', '10 staff members', 'Priority support', 'Advanced analytics', 'Custom branding'], hot: true },
  { name: 'Agency',  price: 199, features: ['Everything in Pro', 'Unlimited staff', 'Multi-location', 'Dedicated support'] },
]

const CATS = [
  { icon: IcCoffee,   label: 'Cafés' },
  { icon: IcFood,     label: 'Restaurants' },
  { icon: IcScissors, label: 'Salons' },
  { icon: IcBuilding, label: 'Hotels' },
  { icon: IcDumbbell, label: 'Gyms' },
]

const REVIEWS = [
  { name: 'Mert Aydın',   biz: 'Karaköy Roasters',   text: '47 new Google reviews in the first month. The free coffee pays for itself five times over.', stars: 5, init: 'M' },
  { name: 'Selin Öztürk', biz: 'Studio Nişantaşı',   text: 'Clients love collecting stamps. Repeat visits up 40%. Best loyalty tool I\'ve ever tried.', stars: 5, init: 'S' },
  { name: 'Can Yılmaz',   biz: 'The Bosphorus Hotel', text: 'Guests complete challenges and leave glowing reviews. Revenue from repeat guests doubled.', stars: 5, init: 'C' },
]

const LOGOS = ['CAFÉ 71', 'LUNA', 'URBAN CUTS', 'FIT CITY', 'the rooftop', 'BREW LAB', 'NOIR SPA', 'GRAND INN']

function PlanCard({ plan, annual }) {
  const price = annual ? Math.floor(plan.price * 0.8) : plan.price
  if (plan.hot) return (
    <div className="flex flex-col gap-5 p-6 relative rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0A1B33 0%, #142D55 100%)', border: '1px solid rgba(39,103,255,0.4)', boxShadow: '0 0 48px rgba(39,103,255,0.18)' }}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-display font-black px-4 py-1 rounded-full tracking-widest uppercase">Most popular</div>
      <div>
        <p className="font-display font-bold text-sm tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{plan.name}</p>
        <div className="flex items-end gap-1">
          <span className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>${price}</span>
          <span className="mb-1 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo</span>
        </div>
        {annual && <p className="text-green-stamp text-xs mt-1 font-medium">Save ${(plan.price - price) * 12}/yr</p>}
      </div>
      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <div className="w-4 h-4 rounded-full bg-blue/30 flex items-center justify-center flex-shrink-0">
              <IcCheck size={9} className="text-blue" style={{ color: '#7BA7FF' }} />
            </div>
            {f}
          </li>
        ))}
      </ul>
      <Link to="/auth?mode=signup" className="btn-primary justify-center text-sm">Get started</Link>
    </div>
  )
  return (
    <div className="card flex flex-col gap-5 p-6 relative transition-all duration-200 hover:-translate-y-1 hover:border-blue/20"
      style={{ boxShadow: '0 1px 3px rgba(17,24,39,0.06)' }}>
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
            <IcCheck size={13} className="text-blue flex-shrink-0" />{f}
          </li>
        ))}
      </ul>
      <Link to="/auth?mode=signup" className="btn-secondary justify-center text-sm">
        {plan.price === 0 ? 'Start for free' : 'Get started'}
      </Link>
    </div>
  )
}

export default function Landing() {
  const [annual, setAnnual] = useState(false)

  return (
    <div className="min-h-screen font-body overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl" style={{ background: 'rgba(10,27,51,0.9)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-body" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm hidden sm:block transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>Sign in</Link>
            <Link to="/auth?mode=signup" className="btn-primary text-sm px-4 py-2.5">
              Start free <IcArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0A1B33 0%, #0F2444 55%, #142D55 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)"/>
        </svg>
        <div className="absolute pointer-events-none" style={{ top: '20%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(39,103,255,0.12) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,138,61,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-8 text-xs px-3 py-1.5 font-display font-bold tracking-widest uppercase rounded-full"
                style={{ background: 'rgba(39,103,255,0.18)', color: '#7BA7FF', border: '1px solid rgba(39,103,255,0.3)' }}>
                <IcZap size={11} /> Now live worldwide
              </div>

              <h1 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(3rem, 7.5vw, 6rem)', lineHeight: '0.93', letterSpacing: '-0.04em' }}>
                <span className="block">Turn customers</span>
                <span className="block" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #2767FF, #5B9BFF)' }}>into regulars.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Businesses create challenges. Customers earn real rewards. One platform for every café, salon, and restaurant in your city.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/auth?mode=signup" className="btn-primary text-base px-8 py-3.5">
                  Start free — no card needed <IcArrowRight size={16} />
                </Link>
                <Link to="/browse"
                  className="inline-flex items-center gap-2 font-display font-bold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95 text-base"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Browse businesses <IcMapPin size={15} />
                </Link>
              </div>

              <div className="flex items-center gap-10 mt-12 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[['500+', 'Businesses'], ['12k+', 'Rewards earned'], ['4.9★', 'Avg rating']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display font-black text-white" style={{ fontSize: '1.6rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:flex items-center justify-center h-[500px]">
              {[
                { rot: '-4deg', tx: '-28px', ty: '24px', delay: '0.1s', type: '⭐ Review', pts: '+100 pts', title: 'Leave us a Google Review', biz: 'Karaköy Roasters · Café', reward: 'Free Cortado' },
                { rot: '3deg',  tx: '28px',  ty: '-20px', delay: '0.7s', type: '📍 Visit',  pts: '+200 pts', title: 'Visit 3 times this month',  biz: 'Studio Nişantaşı · Salon', reward: '30% off next cut' },
                { rot: '-1.5deg', tx: '8px', ty: '64px',  delay: '1.3s', type: '👥 Refer',  pts: '+300 pts', title: 'Refer a friend',            biz: 'Bosphorus Fit · Gym',    reward: 'Free PT Session' },
              ].map((t, i) => (
                <div key={i} className="absolute w-72 ticket animate-float"
                  style={{ transform: `rotate(${t.rot}) translate(${t.tx}, ${t.ty})`, animationDelay: t.delay }}>
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

      {/* TRUSTED BY */}
      <div className="border-y border-border bg-white py-5 overflow-hidden">
        <div className="flex items-center gap-16 animate-scroll" style={{ width: 'max-content' }}>
          {[...LOGOS, ...LOGOS, ...LOGOS].map((l, i) => (
            <span key={i} className="font-display font-black text-text-faint text-sm tracking-[0.1em] uppercase whitespace-nowrap">{l}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how">
        {[
          {
            n: '01', dark: false,
            title: 'Create challenges in minutes.',
            desc: 'Set up tasks — "leave a review", "visit 3 times", "refer a friend". Attach rewards customers actually want. Go live immediately.',
            visual: (
              <div className="relative w-full max-w-xs mx-auto">
                <div className="ticket">
                  <div className="ticket-body">
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge-blue text-xs">Review</span>
                      <span className="badge-amber text-xs">+150 pts</span>
                    </div>
                    <p className="font-display font-black text-text text-xl leading-tight mb-1">Leave a Google Review</p>
                    <p className="text-text-muted text-xs">Karaköy Roasters · Café</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
                        <span>Progress</span><span>0/1</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{ width: '0%' }} /></div>
                    </div>
                  </div>
                  <div className="ticket-reward">
                    <p className="text-[10px] text-text-muted font-display uppercase tracking-widest mb-1">Your reward</p>
                    <p className="font-display font-bold text-amber text-lg">Free Cortado ☕</p>
                  </div>
                </div>
              </div>
            )
          },
          {
            n: '02', dark: true,
            title: 'Customers scan & complete.',
            desc: 'They scan your QR code, see all your challenges, complete them, and submit for confirmation. Works on any phone — no app install.',
            visual: (
              <div className="relative w-full max-w-xs mx-auto">
                <div className="rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <p className="text-xs font-display font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Scan to earn rewards</p>
                  <div className="bg-white rounded-2xl p-4 flex items-center justify-center mb-4">
                    <div className="grid grid-cols-7 gap-0.5">
                      {Array(49).fill(0).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-sm"
                          style={{ background: [0,1,2,3,4,5,6,7,13,14,20,21,22,23,24,25,26,27,28,35,41,42,43,44,45,46,47,48,30,36,37,38,39,10,11,16,17].includes(i) ? '#0A1B33' : '#F4F6FB' }} />
                      ))}
                    </div>
                  </div>
                  <p className="text-center text-xs font-mono" style={{ color: 'rgba(255,255,255,0.4)' }}>achievo.app/b/karakoy</p>
                </div>
              </div>
            )
          },
          {
            n: '03', dark: false,
            title: 'Staff confirms in seconds.',
            desc: 'Your team enters their PIN on any phone — no account, no app, no training. The reward lands in the customer wallet instantly.',
            visual: (
              <div className="relative w-full max-w-xs mx-auto">
                <div className="card p-5">
                  <p className="text-xs text-text-muted text-center mb-4 font-display uppercase tracking-widest">Staff PIN</p>
                  <div className="flex gap-3 justify-center mb-5">
                    {[1,1,1,1,0,0].map((filled, i) => (
                      <div key={i} className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all
                        ${filled ? 'border-green-stamp bg-green-stamp/15' : 'border-border bg-surface-2'}`}>
                        {filled ? <div className="w-2.5 h-2.5 rounded-full bg-green-stamp" /> : null}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
                      <div key={i} className={`h-10 rounded-xl flex items-center justify-center font-display font-bold text-base
                        ${k === '' ? 'invisible' : 'bg-surface-2 border border-border text-text'}`}>{k}</div>
                    ))}
                  </div>
                  <div className="py-3 rounded-2xl text-white text-sm font-display font-black text-center"
                    style={{ background: '#22C55E', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }}>
                    ✓ Approved
                  </div>
                </div>
              </div>
            )
          },
        ].map((step, i) => (
          <div key={step.n} className="relative overflow-hidden py-24 px-6"
            style={{ background: step.dark ? 'linear-gradient(160deg, #0A1B33 0%, #0F2444 100%)' : i === 2 ? '#FFFFFF' : '#F4F6FB' }}>
            {step.dark && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id={`g${i}`} width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/></pattern></defs>
                <rect width="100%" height="100%" fill={`url(#g${i})`}/>
              </svg>
            )}
            <div className="absolute select-none pointer-events-none font-display font-black"
              style={{ fontSize: 'clamp(8rem,20vw,16rem)', lineHeight: 1, letterSpacing: '-0.06em', top: '-0.1em', right: '-0.05em',
                color: step.dark ? 'rgba(255,255,255,0.03)' : 'rgba(39,103,255,0.05)' }}>
              {step.n}
            </div>
            <div className={`max-w-6xl mx-auto flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center relative z-10`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center font-display font-black text-white text-sm flex-shrink-0">{i + 1}</div>
                  <span className="text-xs font-display font-bold tracking-[0.12em] uppercase text-blue">Step {step.n}</span>
                </div>
                <h3 className={`font-display font-black mb-5 ${step.dark ? 'text-white' : 'text-text'}`}
                  style={{ fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                  {step.title}
                </h3>
                <p className={`text-base leading-relaxed max-w-sm ${step.dark ? '' : 'text-text-muted'}`}
                  style={step.dark ? { color: 'rgba(255,255,255,0.55)' } : {}}>
                  {step.desc}
                </p>
              </div>
              <div className="flex-1 w-full">{step.visual}</div>
            </div>
          </div>
        ))}
      </section>

      {/* FEATURES BENTO */}
      <section className="py-24 px-6 bg-bg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="section-label mb-4">Everything you need</p>
            <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Built for real<br />businesses.
            </h2>
          </div>

          <div className="grid md:grid-cols-12 gap-4">
            <div className="md:col-span-7 bento p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="w-11 h-11 rounded-2xl bg-blue/10 flex items-center justify-center mb-5">
                  <span className="font-display font-black text-blue text-lg">✦</span>
                </div>
                <p className="section-label mb-2">Zero-login staff tools</p>
                <h3 className="font-display font-bold text-text mb-3" style={{ fontSize: 'clamp(1.4rem,2.5vw,1.85rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  Confirm rewards in under 10 seconds
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">PIN on any phone. No account. No app. No training. Your cashier is ready in 30 seconds flat.</p>
              </div>
              <div className="rounded-2xl p-5 w-full md:w-52 flex-shrink-0 border border-border bg-surface-2">
                <div className="flex gap-2 mb-4 justify-center">
                  {[1,1,1,0,0,0].map((f,i) => (
                    <div key={i} className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center
                      ${f ? 'border-green-stamp bg-green-stamp/15' : 'border-border bg-white'}`}>
                      {f ? <div className="w-2 h-2 rounded-full bg-green-stamp" /> : null}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k,i) => (
                    <div key={i} className={`h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm
                      ${k === '' ? 'invisible' : 'bg-white border border-border text-text'}`}>{k}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 bento p-7 relative overflow-hidden">
              <div className="absolute right-4 bottom-4 opacity-[0.07] pointer-events-none">
                <IcQr size={120} className="text-blue" />
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue/10 flex items-center justify-center mb-5">
                <IcQr size={20} className="text-blue" />
              </div>
              <p className="section-label mb-2">Instant QR codes</p>
              <h3 className="font-display font-bold text-xl text-text mb-2">One scan, all your challenges</h3>
              <p className="text-text-muted text-sm leading-relaxed">Printable. Shareable. Customers scan and see every active challenge immediately — no app download needed.</p>
            </div>

            <div className="md:col-span-4 bento p-7 relative overflow-hidden">
              <div className="flex items-end gap-1 mb-5 h-14">
                {[30,55,40,70,50,85,65].map((h,i) => (
                  <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: i === 5 ? '#2767FF' : i === 6 ? '#2767FF' : '#E8ECF4' }} />
                ))}
              </div>
              <p className="section-label mb-2">Analytics</p>
              <h3 className="font-display font-bold text-xl text-text mb-2">See what drives loyalty</h3>
              <p className="text-text-muted text-sm leading-relaxed">Track completions, top challenges, and repeat customers from your dashboard.</p>
            </div>

            <div className="md:col-span-4 bento p-7">
              <div className="w-11 h-11 rounded-2xl bg-coral/10 flex items-center justify-center mb-5">
                <IcUsers size={20} className="text-coral" />
              </div>
              <p className="section-label mb-2" style={{ color: '#FF8A3D' }}>City passport</p>
              <h3 className="font-display font-bold text-xl text-text mb-2">One wallet, every business</h3>
              <p className="text-text-muted text-sm leading-relaxed">Customers build a city-wide reward profile as they discover cafés, salons, hotels, and more.</p>
            </div>

            <div className="md:col-span-4 bento p-7">
              <div className="w-11 h-11 rounded-2xl bg-green-stamp/10 flex items-center justify-center mb-5">
                <IcZap size={20} className="text-green-stamp" />
              </div>
              <p className="section-label mb-2" style={{ color: '#22C55E' }}>Instant delivery</p>
              <h3 className="font-display font-bold text-xl text-text mb-2">Reward appears immediately</h3>
              <p className="text-text-muted text-sm leading-relaxed">The moment staff taps confirm, the reward lands in the customer's wallet. Zero delay, zero friction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="relative overflow-hidden py-32 px-6" style={{ background: '#FFFFFF' }}>
        <div className="absolute left-0 top-0 font-display font-black pointer-events-none select-none"
          style={{ fontSize: '28rem', lineHeight: 0.85, color: 'rgba(39,103,255,0.03)', letterSpacing: '-0.05em' }}>"</div>
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="section-label mb-4 text-center">Testimonials</p>

          <div className="text-center mb-16 max-w-4xl mx-auto">
            <p className="font-display font-black text-text" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.6rem)', letterSpacing: '-0.025em', lineHeight: 1.25 }}>
              "47 new Google reviews in the first month. The free coffee pays for itself five times over."
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-11 h-11 rounded-full bg-amber/20 border border-amber/25 flex items-center justify-center font-display font-black text-amber text-lg">M</div>
              <div className="text-left">
                <p className="font-display font-bold text-text text-sm">Mert Aydın</p>
                <p className="text-text-muted text-xs">Karaköy Roasters, Istanbul</p>
              </div>
              <div className="flex gap-0.5 ml-2">
                {Array(5).fill(0).map((_, j) => <IcStar key={j} size={12} className="text-amber" />)}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {REVIEWS.slice(1).map((r) => (
              <div key={r.name} className="card p-7 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array(r.stars).fill(0).map((_, j) => <IcStar key={j} size={12} className="text-amber" />)}
                </div>
                <p className="text-text text-sm leading-relaxed flex-1">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-blue/10 flex items-center justify-center font-display font-black text-blue flex-shrink-0">{r.init}</div>
                  <div>
                    <p className="font-display font-bold text-sm text-text">{r.name}</p>
                    <p className="text-text-muted text-xs mt-0.5">{r.biz}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-bg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="section-label mb-4">Pricing</p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                Simple,<br />honest pricing.
              </h2>
              <div className="inline-flex items-center gap-1 bg-surface border border-border p-1 rounded-xl self-start sm:self-auto">
                <button onClick={() => setAnnual(false)} className={`px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${!annual ? 'bg-blue text-white' : 'text-text-muted'}`}>Monthly</button>
                <button onClick={() => setAnnual(true)} className={`px-4 py-2 rounded-lg text-sm font-display font-bold transition-all ${annual ? 'bg-blue text-white' : 'text-text-muted'}`}>
                  Annual <span className="text-xs ml-1 text-green-stamp">−20%</span>
                </button>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {PLANS.map(p => <PlanCard key={p.name} plan={p} annual={annual} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-32 px-6" style={{ background: 'linear-gradient(160deg, #07111F 0%, #0A1B33 50%, #0F2444 100%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)"/>
        </svg>
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(39,103,255,0.1) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-display font-bold text-xs tracking-[0.15em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>Get started today</p>
          <h2 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(2.75rem,7vw,5.5rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            Your first challenge<br />
            <span style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #2767FF, #5B9BFF)' }}>
              is free.
            </span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>No credit card. No setup fees. Start in minutes.</p>
          <Link to="/auth?mode=signup" className="btn-primary text-base px-12 py-4 inline-flex">
            Add your business <IcArrowRight size={16} />
          </Link>
          <p className="mt-8 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Trusted by 500+ businesses in 29 cities worldwide</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#07111F', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-10 mb-14">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
                  <IcAward size={13} className="text-white" />
                </div>
                <span className="font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>Loyalty that travels with you. Built for cafés, restaurants, salons, and hotels worldwide.</p>
            </div>
            {[
              { title: 'Product', links: ['Browse businesses', 'For business owners', 'Pricing', 'How it works'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy policy', 'Terms of service', 'Cookie policy'] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-display font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{col.title}</p>
                {col.links.map(l => (
                  <a key={l} href="#" className="block text-sm mb-2.5 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 Achievo. All rights reserved.</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>Built for businesses everywhere 🌍</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
