import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { admin } = useAdminAuth()
  if (!admin) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
