import { useEffect, useState } from 'react'
import api from '../lib/api'
import StatCard from '../components/StatCard.jsx'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics/summary').then(({ data }) => {
      setSummary(data.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <p className="text-muted text-sm">Loading dashboard…</p>
  if (!summary) return null

  const categoryChartData = Object.entries(summary.contentByCategory).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">Overview of StreamX right now.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value={summary.totalUsers} />
        <StatCard label="Free tier" value={summary.usersByTier.free || 0} />
        <StatCard label="Streamer" value={summary.usersByTier.streamer || 0} />
        <StatCard label="Super Streamer" value={summary.usersByTier.super_streamer || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <h2 className="font-display font-semibold mb-4">Content by category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryChartData}>
              <CartesianGrid stroke="#262A35" vertical={false} />
              <XAxis dataKey="name" stroke="#8B90A0" fontSize={12} />
              <YAxis stroke="#8B90A0" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#1B1E27', border: '1px solid #262A35', borderRadius: 8 }}
                labelStyle={{ color: '#F5F6F8' }}
              />
              <Bar dataKey="count" fill="#2DD4E8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold mb-4">Live now</h2>
          <p className="font-display text-4xl font-semibold text-accent">{summary.liveNow}</p>
          <p className="text-xs text-muted mt-1">events currently streaming</p>
          <p className="font-display text-2xl font-semibold mt-6">{summary.totalContent}</p>
          <p className="text-xs text-muted mt-1">total titles in the catalogue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-display font-semibold mb-4">Most viewed</h2>
          <div className="space-y-2">
            {summary.topViewed.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
              >
                <span className="truncate">{item.title}</span>
                <span className="text-muted font-mono text-xs">{item.viewCount} views</span>
              </div>
            ))}
            {summary.topViewed.length === 0 && <p className="text-sm text-muted">No views yet.</p>}
          </div>
        </div>

        <div className="card">
          <h2 className="font-display font-semibold mb-4">Recent sign-ups</h2>
          <div className="space-y-2">
            {summary.recentUsers.map((u) => (
              <div
                key={u._id}
                className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
              >
                <span className="truncate">{u.name}</span>
                <span className="text-muted text-xs capitalize">{u.subscriptionType}</span>
              </div>
            ))}
            {summary.recentUsers.length === 0 && <p className="text-sm text-muted">No users yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
