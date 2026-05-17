import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function PublicRoute() {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (session) {
    const from = location.state?.from
    if (typeof from === 'string' && from !== '/login' && from !== '/register') {
      return <Navigate to={from} replace />
    }
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
