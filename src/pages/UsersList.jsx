import { useEffect, useState } from 'react'
import api from '../lib/api'

const TIERS = ['free', 'streamer', 'super_streamer']

const UsersList = () => {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/admin/users', { params: { search, page, limit: 15 } })
    setItems(data.data)
    setPagination(data.pagination)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  const toggleBlock = async (id, isBlocked) => {
    await api.patch(`/admin/users/${id}/block`, { isBlocked: !isBlocked })
    load()
  }

  const changeTier = async (id, subscriptionType) => {
    await api.patch(`/admin/users/${id}/subscription`, { subscriptionType })
    load()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted">Everyone with a StreamX account.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="input-field w-72"
        />
        <button type="submit" className="btn-secondary">
          Search
        </button>
      </form>

      <div className="card p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wider border-b border-border">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id} className="border-b border-border last:border-0 hover:bg-surface2/40">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-muted font-mono text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.subscriptionType}
                    onChange={(e) => changeTier(u._id, e.target.value)}
                    className="input-field text-xs py-1"
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      u.isBlocked ? 'bg-accent/20 text-accent' : 'bg-success/20 text-success'
                    }`}
                  >
                    {u.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => toggleBlock(u._id, u.isBlocked)} className="btn-secondary text-xs py-1">
                    {u.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center gap-2 justify-end text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
            Prev
          </button>
          <span className="text-muted">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default UsersList
