import { Component } from 'react'
import { Award } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-coral/10 border border-coral/20 flex items-center justify-center">
            <Award size={28} className="text-coral" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-text mb-2">Something went wrong</h1>
            <p className="text-text-muted text-sm max-w-xs">An unexpected error occurred. Try refreshing the page.</p>
          </div>
          <button onClick={() => window.location.reload()} className="btn-primary">Refresh page</button>
        </div>
      )
    }
    return this.props.children
  }
}
