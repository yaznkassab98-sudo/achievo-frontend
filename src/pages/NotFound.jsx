import { Link } from 'react-router-dom'
import { IcAward, IcArrowRight } from '../components/Icons'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mb-6">
        <IcAward size={28} className="text-amber" />
      </div>
      <p className="font-display font-black text-amber mb-2" style={{ fontSize: 'clamp(4rem,15vw,8rem)', letterSpacing: '-0.06em', lineHeight: 1 }}>
        404
      </p>
      <h1 className="font-display font-bold text-2xl text-text mb-3">Page not found</h1>
      <p className="text-text-muted max-w-xs mb-8 text-sm leading-relaxed">
        This page doesn't exist. Maybe the business moved or the link expired.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/browse" className="btn-primary">Browse businesses <IcArrowRight size={16} /></Link>
        <Link to="/" className="btn-secondary">Go home</Link>
      </div>
    </div>
  )
}
