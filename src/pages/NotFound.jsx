import { Link } from 'react-router-dom'
import { Award, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mb-6">
        <Award size={28} className="text-amber" />
      </div>
      <p className="font-display font-bold text-7xl text-amber mb-2">404</p>
      <h1 className="font-display font-bold text-2xl text-text mb-3">Page not found</h1>
      <p className="text-text-muted max-w-xs mb-8">
        This page doesn't exist. Maybe the business moved or the link expired.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/browse" className="btn-primary">Browse businesses <ArrowRight size={16} /></Link>
        <Link to="/" className="btn-secondary">Go home</Link>
      </div>
    </div>
  )
}
