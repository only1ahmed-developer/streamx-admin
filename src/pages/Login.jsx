import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Radio } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Radio className="text-accent" size={26} />
          <span className="font-display font-semibold text-2xl tracking-tight">
            Stream<span className="text-accent">X</span>
          </span>
        </div>
        <div className="card">
          <h1 className="font-display text-lg font-semibold mb-1">Admin sign in</h1>
          <p className="text-sm text-muted mb-6">This dashboard is separate from the StreamX app.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="you@streamx.com"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-accent">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-xs text-muted text-center mt-6">
          No admin account yet? Create one on the backend with the createSuperAdmin script.
        </p>
      </div>
    </div>
  )
}

export default Login
