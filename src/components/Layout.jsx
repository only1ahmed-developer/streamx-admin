import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="p-6 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
