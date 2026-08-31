import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-base">
    <p className="font-display text-2xl font-semibold">404</p>
    <p className="text-muted text-sm">This page doesn't exist.</p>
    <Link to="/" className="btn-secondary mt-2">
      Back to Dashboard
    </Link>
  </div>
)

export default NotFound
