import { Link } from 'react-router-dom'
import { IcArrowRight, IcCompass } from '../components/Icons'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-6">
        <p className="font-display font-black text-blue select-none pointer-events-none"
          style={{ fontSize: 'clamp(7rem,20vw,12rem)', letterSpacing: '-0.06em', lineHeight: 1, opacity: 0.08 }}>
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-blue/10 border border-blue/20 flex items-center justify-center">
            <IcCompass size={36} className="text-blue" />
          </div>
        </div>
      </div>

      <h1 className="font-display font-black text-text mb-3" style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', letterSpacing: '-0.03em' }}>
        Page not found
      </h1>
      <p className="text-text-muted max-w-xs mb-8 text-sm leading-relaxed">
        This page doesn't exist or the link has expired. Try browsing for businesses near you.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/browse" className="btn-primary">
          Explore businesses <IcArrowRight size={15} />
        </Link>
        <Link to="/" className="btn-secondary">Go home</Link>
      </div>
    </div>
  )
}
