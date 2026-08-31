import { createContext, useContext, useState } from 'react'
import api from '../lib/api'

const AdminAuthContext = createContext(null)

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem('streamx_admin_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    const { data } = await api.post('/admin/auth/login', { email, password })
    localStorage.setItem('streamx_admin_token', data.token)
    localStorage.setItem('streamx_admin_user', JSON.stringify(data.admin))
    setAdmin(data.admin)
    return data.admin
  }

  const logout = () => {
    localStorage.removeItem('streamx_admin_token')
    localStorage.removeItem('streamx_admin_user')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>{children}</AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)
