import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trash2, Pencil } from 'lucide-react'
import api from '../lib/api'

const CATEGORIES = ['movies', 'tv', 'anime', 'music', 'sports', 'news', 'live', 'education', 'kids', 'gaming', 'shorts']

const ContentList = () => {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/admin/content', { params: { search, category, page, limit: 15 } })
    setItems(data.data)
    setPagination(data.pagination)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  const toggleField = async (id, field, value) => {
    await api.patch(`/admin/content/${id}/toggle`, { field, value })
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this title permanently?')) return
    await api.delete(`/admin/content/${id}`)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Content</h1>
          <p className="text-sm text-muted">Movies, shows, music, sports, live events — everything lives here.</p>
        </div>
        <Link to="/content/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add title
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles…"
              className="input-field pl-9 w-64"
            />
          </div>
        </form>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
          className="input-field"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-0 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted uppercase tracking-wider border-b border-border">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Access</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Trending</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-border last:border-0 hover:bg-surface2/40">
                <td className="px-4 py-3 truncate max-w-[220px]">{item.title}</td>
                <td className="px-4 py-3 text-muted capitalize">{item.category}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface2 text-muted capitalize">
                    {item.accessLevel.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={item.isFeatured}
                    onChange={(e) => toggleField(item._id, 'isFeatured', e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={item.isTrending}
                    onChange={(e) => toggleField(item._id, 'isTrending', e.target.checked)}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{item.viewCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/content/${item._id}`}
                      className="p-1.5 rounded hover:bg-surface2 text-muted hover:text-white"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      onClick={() => remove(item._id)}
                      className="p-1.5 rounded hover:bg-surface2 text-muted hover:text-accent"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No content yet. Add your first title.
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

export default ContentList
