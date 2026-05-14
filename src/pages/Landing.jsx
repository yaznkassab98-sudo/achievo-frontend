import { Link } from 'react-router-dom'
import {
  IcArrowRight, IcCheck, IcZap, IcMapPin, IcAward, IcStar,
  IcCoffee, IcScissors, IcBuilding, IcFood, IcDumbbell, IcGift,
} from '../components/Icons'

const CATS = [
  { icon: IcCoffee,   label: 'Cafés',       color: '#F5A623', bg: '#FEF3DC' },
  { icon: IcFood,     label: 'Restaurants', color: '#EF4444', bg: '#FEE2E2' },
  { icon: IcScissors, label: 'Salons',      color: '#A78BFA', bg: '#EDE9FE' },
  { icon: IcBuilding, label: 'Hotels',      color: '#38BDF8', bg: '#E0F2FE' },
  { icon: IcDumbbell, label: 'Gyms',        color: '#22C55E', bg: '#DCFCE7' },
]

const REWARDS = [
  { emoji: '☕', label: 'Free cortado',       biz: 'Karaköy Roasters',   pts: '150 pts', color: '#F5A623' },
  { emoji: '✂️', label: '30% off next cut',   biz: 'Studio Nişantaşı',  pts: '200 pts', color: '#A78BFA' },
  { emoji: '🏋️', label: 'Free PT session',    biz: 'Bosphorus Fit',      pts: '300 pts', color: '#22C55E' },
  { emoji: '🍕', label: 'Free starter',        biz: 'Trattoria Roma',    pts: '120 pts', color: '#EF4444' },
  { emoji: '🛎️', label: 'Late checkout',       biz: 'The Grand Hotel',   pts: '500 pts', color: '#38BDF8' },
  { emoji: '🧖', label: 'Free face mask',      biz: 'Noir Spa',          pts: '180 pts', color: '#F472B6' },
]

const STORIES = [
  { name: 'Yasmin K.',  init: 'Y', city: 'Istanbul', text: 'Got 3 free coffees last month. I just go to my usual café and leave reviews. It actually works.', reward: 'Free cortado ×3' },
  { name: 'Marco R.',   init: 'M', city: 'Milan',    text: 'Found this cute little gym through the map. Completed their challenge and got a free session. 10/10.', reward: 'Free PT session' },
  { name: 'Sofia L.',   init: 'S', city: 'Dubai',    text: 'My wallet has like 8 rewards right now. I love opening it to see what I\'ve earned.', reward: '8 rewards earned' },
]

const LOGOS = ['CAFÉ 71', 'LUNA', 'URBAN CUTS', 'FIT CITY', 'the rooftop', 'BREW LAB', 'NOIR SPA', 'GRAND INN']

export default function Landing() {
  return (
    <div className="min-h-screen font-body overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl" style={{ background: 'rgba(10,27,51,0.92)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center">
              <IcAward size={13} className="text-white" />
            </div>
            <span className="font-display font-black text-white" style={{ letterSpacing: '-0.02em' }}>Achievo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#rewards" className="hover:text-white transition-colors">Rewards</a>
            <a href="#stories" className="hover:text-white transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm hidden sm:block transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>Sign in</Link>
            <Link to="/browse" className="btn-primary text-sm px-4 py-2.5">
              Explore <IcMapPin size={13} />
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
        <div className="absolute pointer-events-none" style={{ bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-8 text-xs px-3 py-1.5 font-display font-bold tracking-widest uppercase rounded-full"
                style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
                <IcGift size={11} /> Free rewards, no catch
              </div>

              <h1 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(3rem, 7.5vw, 5.5rem)', lineHeight: '0.93', letterSpacing: '-0.04em' }}>
                <span className="block">Your city is full</span>
                <span className="block">of</span>
                <span className="block" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #F5A623, #FFD166)' }}>free stuff.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Earn real rewards at cafés, restaurants, salons, and gyms near you — just for being a regular. No punch cards. No apps to download.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/browse" className="btn-primary text-base px-8 py-3.5" style={{ background: 'linear-gradient(135deg, #F5A623, #FF8A3D)', boxShadow: '0 4px 20px rgba(245,166,35,0.35)' }}>
                  Explore your city <IcMapPin size={16} />
                </Link>
                <Link to="/auth?mode=signup"
                  className="inline-flex items-center gap-2 font-display font-bold px-8 py-3.5 rounded-xl transition-all duration-200 active:scale-95 text-base"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  Sign up free <IcArrowRight size={15} />
                </Link>
              </div>

              <div className="flex items-center gap-10 mt-12 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                {[['12k+', 'Rewards claimed'], ['500+', 'Spots to explore'], ['Free', 'Always free for you']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display font-black text-white" style={{ fontSize: '1.6rem', letterSpacing: '-0.04em', lineHeight: 1 }}>{n}</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating reward cards */}
            <div className="relative hidden lg:flex items-center justify-center h-[500px]">
              {[
                { rot: '-4deg', tx: '-28px', ty: '24px', delay: '0s',   emoji: '☕', title: 'Leave us a Google Review', biz: 'Karaköy Roasters · Café', reward: 'Free Cortado', pts: '+150 pts', color: '#F5A623' },
                { rot: '3deg',  tx: '28px',  ty: '-20px', delay: '0.6s', emoji: '✂️', title: 'Visit 3 times this month',  biz: 'Studio Nişantaşı · Salon', reward: '30% off next cut', pts: '+200 pts', color: '#A78BFA' },
                { rot: '-1.5deg', tx: '8px', ty: '64px',  delay: '1.2s', emoji: '🏋️', title: 'Refer a friend',           biz: 'Bosphorus Fit · Gym',    reward: 'Free PT Session', pts: '+300 pts', color: '#22C55E' },
              ].map((t, i) => (
                <div key={i} className="absolute w-72 ticket animate-float"
                  style={{ transform: `rotate(${t.rot}) translate(${t.tx}, ${t.ty})`, animationDelay: t.delay }}>
                  <div className="ticket-body">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{t.emoji}</span>
                      <span className="badge-amber text-xs">{t.pts}</span>
                    </div>
                    <p className="font-display font-bold text-text text-lg leading-tight">{t.title}</p>
                    <p className="text-text-muted text-xs mt-1.5">{t.biz}</p>
                  </div>
                  <div className="ticket-reward">
                    <p className="text-[10px] text-text-muted font-display uppercase tracking-widest mb-1">Your reward</p>
                    <p className="font-display font-bold text-lg" style={{ color: t.color }}>{t.reward}</p>
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

      {/* CATEGORIES */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-display font-bold tracking-widest uppercase text-text-faint mb-8">Explore by category</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATS.map(({ icon: Icon, label, color, bg }) => (
              <Link key={label} to={`/browse?category=${label.toLowerCase()}`}
                className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background: bg, color, border: `1px solid ${color}25` }}>
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — customer POV */}
      <section id="how" className="py-24 px-6" style={{ background: '#F4F6FB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-4">How it works</p>
            <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Three steps to<br />free stuff.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01', emoji: '🗺️', color: '#38BDF8', bg: '#E0F2FE',
                title: 'Discover spots near you',
                desc: 'Browse the map or search by city. Every café, salon, gym, and restaurant with active rewards shows up on your screen.',
              },
              {
                step: '02', emoji: '⚡', color: '#F5A623', bg: '#FEF3DC',
                title: 'Complete a challenge',
                desc: 'Leave a review, visit a few times, refer a friend — challenges are quick and built around things you already do.',
              },
              {
                step: '03', emoji: '🎁', color: '#22C55E', bg: '#DCFCE7',
                title: 'Claim your reward',
                desc: 'Your reward lands in your wallet instantly. Show it to staff and enjoy — free coffee, discounts, VIP treatment.',
              },
            ].map((s, i) => (
              <div key={s.step} className="card p-7 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-200">
                <div className="absolute -top-3 -right-3 font-display font-black pointer-events-none select-none"
                  style={{ fontSize: '6rem', lineHeight: 1, color: 'rgba(39,103,255,0.04)', letterSpacing: '-0.05em' }}>{s.step}</div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                  style={{ background: s.bg }}>
                  {s.emoji}
                </div>
                <h3 className="font-display font-black text-text mb-3" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                  {s.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/browse" className="btn-primary px-8 py-3.5">
              Start exploring <IcMapPin size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* REWARD WALL */}
      <section id="rewards" className="relative overflow-hidden py-24 px-6" style={{ background: 'linear-gradient(160deg, #07111F 0%, #0A1B33 50%, #0F2444 100%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.03 }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="rw-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#2767FF" strokeWidth="1"/>
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#rw-grid)"/>
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-display font-bold text-xs tracking-[0.15em] uppercase mb-4" style={{ color: 'rgba(245,166,35,0.7)' }}>Real rewards</p>
            <h2 className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              This is what's<br />waiting for you.
            </h2>
            <p className="mt-4 text-base max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Rewards from hundreds of local spots. All free. All real.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {REWARDS.map((r, i) => (
              <div key={i}
                className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-xl cursor-default"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '2rem', lineHeight: 1 }}>{r.emoji}</span>
                <div>
                  <p className="font-display font-black text-white text-base leading-tight">{r.label}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.biz}</p>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1 text-xs font-display font-bold px-2.5 py-1 rounded-full"
                    style={{ background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}30` }}>
                    <IcStar size={9} /> {r.pts}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            + hundreds more across your city
          </p>
        </div>
      </section>

      {/* ACHIEVEMENT PREVIEW */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-4">Your wallet</p>
              <h2 className="font-display font-black text-text mb-5" style={{ fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                One wallet.<br />Every reward.<br />Every city.
              </h2>
              <p className="text-text-muted text-base leading-relaxed mb-8 max-w-sm">
                Your rewards, points, and achievements all live in one place. Take it anywhere — Istanbul, Dubai, Milan, wherever you go.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Earn points at every participating business',
                  'Unlock badges as you explore more spots',
                  'Rewards never expire until you use them',
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-text-muted">
                    <div className="w-5 h-5 rounded-full bg-amber/15 flex items-center justify-center flex-shrink-0">
                      <IcCheck size={9} className="text-amber" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Wallet mockup */}
            <div className="relative">
              <div className="rounded-3xl p-6 shadow-2xl max-w-sm mx-auto"
                style={{ background: 'linear-gradient(135deg, #0A1B33 0%, #0F2444 100%)', border: '1px solid rgba(39,103,255,0.2)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue/20 flex items-center justify-center font-display font-black text-2xl text-white border border-white/10">Y</div>
                  <div>
                    <p className="font-display font-black text-white text-sm">Yasmin K.</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Istanbul</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-display font-black text-amber" style={{ fontSize: '1.5rem', letterSpacing: '-0.04em' }}>1,240</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>points</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {[['8', 'Challenges'], ['5', 'Rewards'], ['3', 'Available']].map(([n, l]) => (
                    <div key={l} className="text-center">
                      <p className="font-display font-black text-white text-xl" style={{ letterSpacing: '-0.03em' }}>{n}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{l}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {[['🏅','First win'],['🔥','Regular'],['🌍','Explorer']].map(([e, l]) => (
                    <div key={l} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-display font-bold"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <span>{e}</span> {l}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Free Cortado', biz: 'Karaköy Roasters', status: 'available' },
                    { name: '30% off cut', biz: 'Studio Nişantaşı', status: 'available' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
                      <IcGift size={14} className="text-amber flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-display font-bold text-white truncate">{r.name}</p>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.biz}</p>
                      </div>
                      <span className="text-[10px] font-display font-bold text-amber bg-amber/10 px-2 py-0.5 rounded-full flex-shrink-0">Use</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* floating glow */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(39,103,255,0.12) 0%, transparent 70%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section id="stories" className="py-24 px-6" style={{ background: '#F4F6FB' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-4">Real people, real rewards</p>
            <h2 className="font-display font-black text-text" style={{ fontSize: 'clamp(2rem,5vw,3rem)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              They're already earning.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {STORIES.map((s) => (
              <div key={s.name} className="card p-6 flex flex-col gap-5">
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, j) => <IcStar key={j} size={12} className="text-amber" />)}
                </div>
                <p className="text-text text-sm leading-relaxed flex-1">"{s.text}"</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: '1px solid #F0F2F7' }}>
                  <div className="w-9 h-9 rounded-full bg-amber/15 flex items-center justify-center font-display font-black text-amber text-sm flex-shrink-0">{s.init}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-text">{s.name}</p>
                    <p className="text-text-muted text-xs">{s.city}</p>
                  </div>
                  <span className="text-xs font-display font-bold text-green-stamp bg-green-stamp/10 px-2.5 py-1 rounded-full flex-shrink-0 border border-green-stamp/20">
                    {s.reward}
                  </span>
                </div>
              </div>
            ))}
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
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="font-display font-bold text-xs tracking-[0.15em] uppercase mb-6" style={{ color: 'rgba(245,166,35,0.6)' }}>Free to use, always</p>
          <h2 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(2.75rem,7vw,5rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
            Start earning<br />
            <span style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text', backgroundImage: 'linear-gradient(90deg, #F5A623, #FFD166)' }}>
              right now.
            </span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>No credit card. No app download. Just real rewards from places you'll love.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/browse" className="btn-primary text-base px-10 py-4 inline-flex justify-center" style={{ background: 'linear-gradient(135deg, #F5A623, #FF8A3D)', boxShadow: '0 4px 24px rgba(245,166,35,0.4)' }}>
              Explore your city <IcMapPin size={16} />
            </Link>
            <Link to="/auth?mode=signup"
              className="inline-flex items-center justify-center gap-2 font-display font-bold text-base px-10 py-4 rounded-xl transition-all duration-200 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
              Create free account <IcArrowRight size={15} />
            </Link>
          </div>
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
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>Earn rewards at cafés, restaurants, salons, and more. Your loyalty, rewarded everywhere.</p>
            </div>
            {[
              { title: 'Explore', links: [
                { label: 'Browse businesses', href: '/browse' },
                { label: 'How it works', href: '#how' },
                { label: 'Sign up free', href: '/auth?mode=signup' },
              ]},
              { title: 'Company', links: [
                { label: 'Contact us', href: 'mailto:hello@achievo.app' },
              ]},
              { title: 'Legal', links: [
                { label: 'Privacy policy', href: '/privacy' },
                { label: 'Terms of service', href: '/terms' },
              ]},
            ].map(col => (
              <div key={col.title}>
                <p className="font-display font-bold text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{col.title}</p>
                {col.links.map(l => (
                  <a key={l.label} href={l.href} className="block text-sm mb-2.5 transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.3)' }}>{l.label}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 Achievo. All rights reserved.</p>
            <a href="/auth?mode=signup&role=business_owner" className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Own a business? List it here →
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
