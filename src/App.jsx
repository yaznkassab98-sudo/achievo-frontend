import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/useAuthStore'
import Toast from './components/Toast'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Browse from './pages/Browse'
import BusinessPage from './pages/BusinessPage'
import Wallet from './pages/Wallet'
import Dashboard from './pages/Dashboard'
import BusinessSetup from './pages/BusinessSetup'
import StaffPin from './pages/StaffPin'
import EditProfile from './pages/EditProfile'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children, role }) {
  const { user, token } = useAuthStore()
  if (!token) return <Navigate to="/auth" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/b/:slug" element={<BusinessPage />} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="business_owner"><Dashboard /></ProtectedRoute>} />
        <Route path="/setup" element={<ProtectedRoute role="business_owner"><BusinessSetup /></ProtectedRoute>} />
        <Route path="/staff" element={<StaffPin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
