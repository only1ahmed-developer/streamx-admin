import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'

const CATEGORIES = ['movies', 'tv', 'anime', 'music', 'sports', 'news', 'live', 'education', 'kids', 'gaming', 'shorts']
const AGE_RATINGS = ['G', 'PG-13', '18+', 'TV-MA']
const ACCESS_LEVELS = ['free', 'streamer', 'super_streamer']

const emptyForm = {
  title: '',
  synopsis: '',
  category: 'movies',
  subType: '',
  genres: '',
  tags: '',
  poster: '',
  backdrop: '',
  thumbnail: '',
  trailerUrl: '',
  streamLinksSd: '',
  streamLinksHd: '',
  streamLinksUhd: '',
  captions: '',
  duration: '',
  allowDownload: false,
  cast: '',
  director: '',
  releaseYear: '',
  country: '',
  language: '',
  rating: '',
  ageRating: 'G',
  isKidsFriendly: false,
  accessLevel: 'free',
  isFeatured: false,
  isTrending: false,
  isLive: false,
  liveStatus: '',
  startTime: '',
}

const Field = ({ label, value, onChange, type = 'text', required = false }) => (
  <div>
    <label className="text-xs text-muted mb-1 block">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field w-full"
    />
  </div>
)

const ContentForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id && id !== 'new')
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.get(`/admin/content/${id}`).then(({ data }) => {
      const c = data.data
      setForm({
        title: c.title || '',
        synopsis: c.synopsis || '',
        category: c.category || 'movies',
        subType: c.subType || '',
        genres: (c.genres || []).join(', '),
        tags: (c.tags || []).join(', '),
        poster: c.poster || '',
        backdrop: c.backdrop || '',
        thumbnail: c.thumbnail || '',
        trailerUrl: c.trailerUrl || '',
        streamLinksSd: c.streamLinks?.sd || '',
        streamLinksHd: c.streamLinks?.hd || '',
        streamLinksUhd: c.streamLinks?.uhd || '',
        captions: (c.captions || []).map((cap) => `${cap.label}:${cap.language}:${cap.url}`).join(', '),
        duration: c.duration || '',
        allowDownload: !!c.allowDownload,
        cast: (c.cast || []).join(', '),
        director: c.director || '',
        releaseYear: c.releaseYear || '',
        country: c.country || '',
        language: c.language || '',
        rating: c.rating || '',
        ageRating: c.ageRating || 'G',
        isKidsFriendly: !!c.isKidsFriendly,
        accessLevel: c.accessLevel || 'free',
        isFeatured: !!c.isFeatured,
        isTrending: !!c.isTrending,
        isLive: !!c.isLive,
        liveStatus: c.liveStatus || '',
        startTime: c.startTime ? String(c.startTime).substring(0, 16) : '',
      })
      setLoading(false)
    })
  }, [id, isEdit])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      title: form.title,
      synopsis: form.synopsis,
      category: form.category,
      subType: form.subType,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
      tags: form.tags.split(',').map((g) => g.trim()).filter(Boolean),
      poster: form.poster,
      backdrop: form.backdrop,
      thumbnail: form.thumbnail,
      trailerUrl: form.trailerUrl,
      streamLinks: { sd: form.streamLinksSd, hd: form.streamLinksHd, uhd: form.streamLinksUhd },
      captions: form.captions
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [label, language, ...urlParts] = entry.split(':').map((p) => p.trim());
          return { label: label || '', language: language || '', url: urlParts.join(':') || '' };
        })
        .filter((c) => c.url),
      duration: Number(form.duration) || 0,
      allowDownload: form.allowDownload,
      cast: form.cast.split(',').map((g) => g.trim()).filter(Boolean),
      director: form.director,
      releaseYear: Number(form.releaseYear) || null,
      country: form.country,
      language: form.language,
      rating: Number(form.rating) || 0,
      ageRating: form.ageRating,
      isKidsFriendly: form.isKidsFriendly,
      accessLevel: form.accessLevel,
      isFeatured: form.isFeatured,
      isTrending: form.isTrending,
      isLive: form.isLive,
      liveStatus: form.liveStatus || null,
      startTime: form.startTime || null,
    }

    try {
      if (isEdit) {
        await api.put(`/admin/content/${id}`, payload)
      } else {
        await api.post('/admin/content', payload)
      }
      navigate('/content')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Check the required fields.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-semibold">{isEdit ? 'Edit title' : 'Add new title'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-sm text-accent">{error}</p>}

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Basics</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title" required value={form.title} onChange={(v) => update('title', v)} />
            <div>
              <label className="text-xs text-muted mb-1 block">Category</label>
              <select className="input-field w-full" value={form.category} onChange={(e) => update('category', e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Synopsis</label>
            <textarea
              className="input-field w-full"
              rows={3}
              value={form.synopsis}
              onChange={(e) => update('synopsis', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Genres (comma separated)" value={form.genres} onChange={(v) => update('genres', v)} />
            <Field label="Sub type" value={form.subType} onChange={(v) => update('subType', v)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Media</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Poster URL" value={form.poster} onChange={(v) => update('poster', v)} />
            <Field label="Backdrop URL" value={form.backdrop} onChange={(v) => update('backdrop', v)} />
            <Field label="Thumbnail URL" value={form.thumbnail} onChange={(v) => update('thumbnail', v)} />
            <Field label="Trailer URL" value={form.trailerUrl} onChange={(v) => update('trailerUrl', v)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Streaming links</h2>
          <p className="text-xs text-muted">Leave HD/4K blank if not available — the app hides those options automatically.</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="SD link" value={form.streamLinksSd} onChange={(v) => update('streamLinksSd', v)} />
            <Field label="HD link" value={form.streamLinksHd} onChange={(v) => update('streamLinksHd', v)} />
            <Field label="4K link" value={form.streamLinksUhd} onChange={(v) => update('streamLinksUhd', v)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.allowDownload} onChange={(e) => update('allowDownload', e.target.checked)} />
            Allow downloads for eligible plans
          </label>
          <div>
            <label className="text-xs text-muted mb-1 block">
              Captions (format: Label:lang:url, comma-separated for multiple tracks)
            </label>
            <input
              className="input-field w-full"
              placeholder="English:en:https://.../en.srt, Swahili:sw:https://.../sw.srt"
              value={form.captions}
              onChange={(e) => update('captions', e.target.value)}
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Metadata</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Cast (comma separated)" value={form.cast} onChange={(v) => update('cast', v)} />
            <Field label="Director" value={form.director} onChange={(v) => update('director', v)} />
            <Field label="Release year" type="number" value={form.releaseYear} onChange={(v) => update('releaseYear', v)} />
            <Field label="Country" value={form.country} onChange={(v) => update('country', v)} />
            <Field label="Language" value={form.language} onChange={(v) => update('language', v)} />
            <Field label="Rating (0-10)" type="number" value={form.rating} onChange={(v) => update('rating', v)} />
            <Field label="Duration (minutes)" type="number" value={form.duration} onChange={(v) => update('duration', v)} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Access & discovery</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Age rating</label>
              <select className="input-field w-full" value={form.ageRating} onChange={(e) => update('ageRating', e.target.value)}>
                {AGE_RATINGS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Minimum plan required</label>
              <select
                className="input-field w-full"
                value={form.accessLevel}
                onChange={(e) => update('accessLevel', e.target.value)}
              >
                {ACCESS_LEVELS.map((a) => (
                  <option key={a} value={a}>
                    {a.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isKidsFriendly}
                  onChange={(e) => update('isKidsFriendly', e.target.checked)}
                />
                Kids-friendly
              </label>
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />
              Featured on homepage hero
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isTrending} onChange={(e) => update('isTrending', e.target.checked)} />
              Mark as trending
            </label>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Live event (optional)</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isLive} onChange={(e) => update('isLive', e.target.checked)} />
            This is a live event
          </label>
          {form.isLive && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Live status</label>
                <select
                  className="input-field w-full"
                  value={form.liveStatus}
                  onChange={(e) => update('liveStatus', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live now</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
              <Field label="Start time" type="datetime-local" value={form.startTime} onChange={(v) => update('startTime', v)} />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create title'}
          </button>
          <button type="button" onClick={() => navigate('/content')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContentForm
