import { useEffect, useState } from 'react'

const Topbar = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-base/80 backdrop-blur z-10">
      <div className="flex items-center gap-2 text-xs text-muted font-mono">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        All systems operational
      </div>
      <div className="text-xs text-muted font-mono">
        {now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })} ·{' '}
        {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </header>
  )
}

export default Topbar
