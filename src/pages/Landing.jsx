import { Link } from 'react-router-dom'
import {
  IcArrowRight, IcCheck, IcZap, IcMapPin, IcAward, IcStar,
  IcBarChart, IcQr, IcShield, IcGlobe, IcUsers, IcGift,
} from '../components/Icons'

function Logo({ size = 24 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.34, lineHeight: 1 }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#2767FF"/>
        <path d="M9 23L16 8L23 23" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.5 18H20.5" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, letterSpacing: '-0.04em', fontSize: size * 0.78, color: '#F0F2FF' }}>
        achievo
      </span>
    </div>
  )
}

function MiniChart() {
  const bars = [40, 55, 48, 65, 60, 72, 80, 70, 85, 92, 88, 100]
  return (
    <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
      {bars.map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(180deg, #2767FF, ${i === 11 ? '#F5A623' : 'rgba(39,103,255,0.3)'})`, borderRadius: 3 }}/>
      ))}
    </div>
  )
}

function BigBarChart() {
  const bars = [42, 58, 48, 67, 60, 74, 80, 70, 88, 92, 88, 100, 96, 110]
  return (
    <div style={{ background: '#07080F', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#F0F2FF' }}>Completions · last 14 days</div>
        <span className="badge badge-green">+24%</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${Math.min(h, 110) / 110 * 100}%`, background: i === bars.length - 1 ? 'linear-gradient(180deg, #F5A623, rgba(245,166,35,0.3))' : 'linear-gradient(180deg, #2767FF, rgba(39,103,255,0.25))', borderRadius: 3, position: 'relative' }}>
            {i === bars.length - 1 && <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#F5A623', fontWeight: 700 }}>110</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function BentoCard({ span, title, desc, color, icon, children }) {
  return (
    <div className="card" style={{ gridColumn: span ? `span ${span}` : 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${color}33, transparent 70%)` }}/>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}22`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 17, color: '#F0F2FF', letterSpacing: '-0.025em' }}>{title}</div>
      <div style={{ fontSize: 12.5, color: '#6B7A99', lineHeight: 1.45 }}>{desc}</div>
      {children}
    </div>
  )
}

function TierPill({ tier }) {
  const map = {
    bronze:   { emoji: '🥉', color: '#CD7F32' },
    silver:   { emoji: '🥈', color: '#A8B8C8' },
  }
  const t = map[tier]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 9999, background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}40`, fontWeight: 700, fontSize: 11 }}>
      {t.emoji} {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const palette = ['#2767FF', '#F5A623', '#FF4D3B', '#22C55E', '#A78BFA', '#F472B6']
  const bg = palette[hash % palette.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${bg}, ${bg}aa)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.38, letterSpacing: '-0.02em', flexShrink: 0, fontFamily: 'Archivo, sans-serif' }}>
      {initials}
    </div>
  )
}

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#07080F', color: '#F0F2FF', fontFamily: 'Archivo, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ padding: '20px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(7,8,15,0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: 10 }}>
        <Logo size={26}/>
        <div style={{ display: 'flex', gap: 28, fontSize: 13.5, fontWeight: 500, color: '#6B7A99' }}>
          <span style={{ cursor: 'pointer' }}>Product</span>
          <span style={{ cursor: 'pointer' }}>For Businesses</span>
          <Link to="/pricing" style={{ color: '#6B7A99', textDecoration: 'none' }}>Pricing</Link>
          <span style={{ cursor: 'pointer' }}>For Customers</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/auth" className="btn-ghost btn-sm">Log in</Link>
          <Link to="/auth" className="btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="mesh-bg" style={{ padding: '90px 60px 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }}/>
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '6px 12px', borderRadius: 999, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: '#F5A623' }}/>
              <span style={{ fontSize: 11.5, color: '#F5A623', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Now in 12 cities</span>
            </div>
            <div className="display" style={{ fontSize: 'clamp(3rem, 6vw, 88px)', color: '#F0F2FF', marginBottom: 22 }}>
              Turn every visit<br/>
              into a loyalty<br/>
              <span style={{ color: '#F5A623' }}>moment.</span>
            </div>
            <div style={{ fontSize: 18, color: '#6B7A99', maxWidth: 540, lineHeight: 1.45, marginBottom: 32 }}>
              Create challenges, reward regulars, and grow your business — with one QR code and zero apps to download.
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth" className="btn-primary btn-lg" style={{ display: 'inline-flex' }}>
                Get started free <IcArrowRight size={16}/>
              </Link>
              <Link to="/browse" className="btn-ghost btn-lg" style={{ display: 'inline-flex' }}>See how it works</Link>
              <div style={{ marginLeft: 12, fontSize: 12, color: '#3A3F5C' }}>
                <div>★★★★★ <span style={{ color: '#6B7A99' }}>4.9 from 412 businesses</span></div>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', transform: 'rotate(2deg)' }}>
            <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.18), transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}/>
            <div style={{ width: 280, height: 560, borderRadius: 36, background: '#07080F', border: '8px solid #14151F', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 80, height: 22, background: '#000', borderRadius: 999, zIndex: 20 }}/>
              <div style={{ padding: '48px 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #F5A623, #FF4D3B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>☕</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#F0F2FF' }}>Karak House</div>
                    <div style={{ fontSize: 9.5, color: '#6B7A99' }}>Café · Dubai</div>
                  </div>
                </div>
                {/* Ticket mockup */}
                <div style={{ background: '#0E0F1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ padding: '12px 12px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(56,189,248,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>◉</div>
                        <span style={{ fontSize: 9, color: '#38BDF8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Visit</span>
                      </div>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#F5A623', fontWeight: 700 }}>★ 50</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: '#F0F2FF', marginBottom: 4 }}>Visit us 3 times this week</div>
                    <div style={{ fontSize: 10, color: '#6B7A99' }}>Stop in for karak any 3 days.</div>
                  </div>
                  <div style={{ borderTop: '1.5px dashed rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.06)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IcGift size={12} style={{ color: '#F5A623' }}/>
                    <span style={{ fontSize: 10, color: '#F5A623', fontWeight: 600 }}>Free Karak on visit 3</span>
                  </div>
                </div>
                <div style={{ background: '#0E0F1A', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 12px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(245,166,35,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>★</div>
                        <span style={{ fontSize: 9, color: '#F5A623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Review</span>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: 9, height: 18 }}>Pending</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 12, color: '#F0F2FF', marginBottom: 4 }}>Leave a Google review</div>
                    <div style={{ fontSize: 10, color: '#6B7A99' }}>Be honest. We read them all.</div>
                  </div>
                  <div style={{ borderTop: '1.5px dashed rgba(245,166,35,0.3)', background: 'rgba(245,166,35,0.06)', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IcGift size={12} style={{ color: '#F5A623' }}/>
                    <span style={{ fontSize: 10, color: '#F5A623', fontWeight: 600 }}>15% off your next order</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF BAR */}
      <div style={{ padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>Trusted by 412 businesses in 12 cities</div>
          <div style={{ display: 'flex', gap: 28, fontSize: 13, color: '#6B7A99' }}>
            <span>☕ Cafés</span>
            <span>🍕 Restaurants</span>
            <span>✂️ Salons</span>
            <span>🏋️ Gyms</span>
            <span>🛍 Retail</span>
            <span>🏨 Hotels</span>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding: '90px 60px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ maxWidth: 720, marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>How it works</div>
          <div className="display" style={{ fontSize: 'clamp(2rem, 4vw, 48px)', color: '#F0F2FF' }}>From sign-up to first reward in <span style={{ color: '#F5A623' }}>five minutes</span>.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 30, left: '15%', right: '15%', height: 2, background: 'linear-gradient(90deg, #2767FF, #F5A623, #22C55E)', opacity: 0.3 }}/>
          {[
            { n: 1, color: '#2767FF', title: 'Create your first challenge', desc: 'Pick from 10 templates or write your own. Set the reward and points.' },
            { n: 2, color: '#F5A623', title: 'Customers scan your QR', desc: 'No app download. They land on your branded profile and start a challenge.' },
            { n: 3, color: '#22C55E', title: 'Staff confirms, rewards unlock', desc: 'A 6-digit PIN at the counter. Done. Reward saved to their wallet.' },
          ].map(s => (
            <div key={s.n} style={{ position: 'relative' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0E0F1A', border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 24, color: s.color, marginBottom: 20, position: 'relative', zIndex: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 22, color: '#F0F2FF', marginBottom: 8, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: '#6B7A99', lineHeight: 1.5, marginBottom: 20, maxWidth: 320 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BENTO FEATURES */}
      <div style={{ padding: '0 60px 90px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Built for local</div>
          <div className="display" style={{ fontSize: 'clamp(2rem, 4vw, 48px)', color: '#F0F2FF', maxWidth: 720 }}>Everything to run loyalty, nothing you don't need.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '180px', gap: 14 }}>
          <BentoCard span="2" title="Analytics dashboard" desc="See what drives repeat visits in real time." color="#2767FF" icon={<IcBarChart size={22}/>}>
            <MiniChart/>
          </BentoCard>
          <BentoCard title="QR codes" desc="Branded, downloadable, one per table or one per venue." color="#F5A623" icon={<IcQr size={22}/>}/>
          <BentoCard title="Tier system" desc="Bronze → Silver → Gold → Platinum." color="#A8B8C8" icon={<IcAward size={22}/>}>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <TierPill tier="bronze"/>
              <TierPill tier="silver"/>
            </div>
          </BentoCard>
          <BentoCard title="Staff PINs" desc="Each staff member has a unique 6-digit PIN. No app needed." color="#22C55E" icon={<IcShield size={22}/>}/>
          <BentoCard title="Anti-fraud" desc="Automatic flagging of suspicious rapid submissions." color="#FF4D3B" icon={<IcZap size={22}/>}/>
          <BentoCard span="2" title="Works anywhere" desc="Web-based. No app download. Customer-friendly from the first scan." color="#F472B6" icon={<IcGlobe size={22}/>}>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, fontSize: 11, color: '#6B7A99' }}>
              <span>iOS</span><span>·</span><span>Android</span><span>·</span><span>Desktop</span><span>·</span><span>PWA</span>
            </div>
          </BentoCard>
        </div>
      </div>

      {/* ANALYTICS TEASER */}
      <div style={{ padding: '0 60px 90px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="card" style={{ padding: 36, background: 'linear-gradient(135deg, #0E0F1A, #1A1B2E)', borderColor: 'rgba(255,255,255,0.14)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="display" style={{ fontSize: 36, color: '#F0F2FF', marginBottom: 14 }}>
              Data that <span style={{ color: '#F5A623' }}>feels alive.</span>
            </div>
            <div style={{ color: '#6B7A99', marginBottom: 22, fontSize: 15, lineHeight: 1.5 }}>Watch challenges complete in real time. Find your best customers. Spot at-risk regulars before they disappear.</div>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div className="display" style={{ fontSize: 32, color: '#F0F2FF' }}>12,847</div>
                <div style={{ fontSize: 11, color: '#6B7A99' }}>Challenges completed</div>
              </div>
              <div>
                <div className="display" style={{ fontSize: 32, color: '#F5A623' }}>4.2x</div>
                <div style={{ fontSize: 11, color: '#6B7A99' }}>Repeat visit rate</div>
              </div>
              <div>
                <div className="display" style={{ fontSize: 32, color: '#22C55E' }}>+38%</div>
                <div style={{ fontSize: 11, color: '#6B7A99' }}>Avg revenue lift</div>
              </div>
            </div>
          </div>
          <BigBarChart/>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: '0 60px 90px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="display" style={{ fontSize: 36, color: '#F0F2FF', marginBottom: 30 }}>Owners are talking.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { quote: 'We went from 20% return rate to 60% in 3 months. Karak House feels like a family now.', name: 'Lena K.', biz: 'Café Owner · Dubai' },
            { quote: 'The ticket cards are addictive. Customers actually ask which challenge they should tackle next.', name: 'Marco R.', biz: 'Restaurant · Berlin' },
            { quote: 'Setup took 10 minutes. By the next day my staff knew the PIN flow and we had 4 redemptions.', name: 'Aisha H.', biz: 'Salon · London' },
          ].map((t, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 32, color: '#F5A623', lineHeight: 0.6, marginBottom: 14, fontFamily: 'Archivo, sans-serif', fontWeight: 900 }}>"</div>
              <div style={{ fontSize: 15, color: '#F0F2FF', lineHeight: 1.5, marginBottom: 20, fontWeight: 500 }}>{t.quote}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={t.name} size={36}/>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#F0F2FF' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#6B7A99' }}>{t.biz}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 60px 90px', maxWidth: 1280, margin: '0 auto' }}>
        <div className="mesh-bg" style={{ padding: '60px', borderRadius: 20, border: '1px solid rgba(39,103,255,0.3)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}/>
          <div style={{ position: 'relative' }}>
            <div className="display" style={{ fontSize: 'clamp(2rem, 4vw, 56px)', color: '#F0F2FF', marginBottom: 16 }}>
              Ready to grow your regulars?
            </div>
            <div style={{ fontSize: 16, color: '#6B7A99', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Free to start. No credit card. Your first challenge live in two minutes.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/auth" className="btn-primary btn-lg" style={{ display: 'inline-flex' }}>
                Get started free <IcArrowRight size={16}/>
              </Link>
              <Link to="/browse" className="btn-secondary btn-lg" style={{ display: 'inline-flex' }}>Browse businesses</Link>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: '50px 60px 40px', borderTop: '1px solid rgba(255,255,255,0.08)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
          <div>
            <Logo size={24}/>
            <div style={{ marginTop: 14, fontSize: 13, color: '#6B7A99', maxWidth: 280, lineHeight: 1.5 }}>Built for local businesses worldwide. From a Dubai karak shop to a Lisbon plant store.</div>
          </div>
          {[
            { title: 'Product', items: ['Features', 'Pricing', 'Templates', 'Changelog'] },
            { title: 'For', items: ['Restaurants', 'Cafés', 'Gyms', 'Customers'] },
            { title: 'Company', items: ['About', 'Blog', 'Careers', 'Press'] },
            { title: 'Legal', items: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, 'Security', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, color: '#F0F2FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>{col.title}</div>
              {col.items.map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: '#6B7A99', marginBottom: 8 }}>
                  {typeof item === 'string' ? item : <Link to={item.href} style={{ color: '#6B7A99', textDecoration: 'none' }}>{item.label}</Link>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11.5, color: '#3A3F5C' }}>
          <span>© 2026 Achievo. Built for local businesses worldwide.</span>
          <span>achievo.app</span>
        </div>
      </div>
    </div>
  )
}
