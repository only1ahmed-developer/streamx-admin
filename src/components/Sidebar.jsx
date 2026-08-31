import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Film, Megaphone, Users, LogOut, Radio } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/content', label: 'Content', icon: Film },
  { to: '/ads', label: 'Ads & Config', icon: Megaphone },
  { to: '/users', label: 'Users', icon: Users },
]

const Sidebar = () => {
  const { admin, logout } = useAdminAuth()

  return (
    <aside className="w-64 shrink-0 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 flex items-center gap-2">
        <Radio className="text-accent" size={22} />
        <span className="font-display font-semibold text-lg tracking-tight">
          Stream<span className="text-accent">X</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-surface2 text-white' : 'text-muted hover:text-white hover:bg-surface2/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gradient-to-b from-cyan to-accent" />
                )}
                <Icon size={18} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6 pt-3 border-t border-border">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium truncate">{admin?.name}</p>
          <p className="text-xs text-muted capitalize">{admin?.role?.replace('_', ' ')}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-accent hover:bg-surface2/60 transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
