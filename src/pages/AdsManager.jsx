import { useEffect, useState } from 'react'
import api from '../lib/api'

const Field = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="text-xs text-muted mb-1 block">{label}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="input-field w-full" />
  </div>
)

const AdsManager = () => {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    api.get('/admin/config').then(({ data }) => setForm(data.data))
  }, [])

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSavedMsg('')
    const { data } = await api.put('/admin/config', form)
    setForm(data.data)
    setSavedMsg('Saved — changes apply to the app immediately, no update needed.')
    setSaving(false)
  }

  if (!form) return <p className="text-muted text-sm">Loading…</p>

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Ads &amp; App Config</h1>
        <p className="text-sm text-muted">The remote control for the app — changes apply instantly, no APK update required.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Maintenance mode</h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => update('maintenanceMode', e.target.checked)}
            />
            Put the app into maintenance mode
          </label>
          <div>
            <label className="text-xs text-muted mb-1 block">Maintenance message</label>
            <textarea
              className="input-field w-full"
              rows={2}
              value={form.maintenanceMessage}
              onChange={(e) => update('maintenanceMessage', e.target.value)}
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Version / force update</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latest version" value={form.latestVersion} onChange={(v) => update('latestVersion', v)} />
            <Field
              label="Minimum supported version"
              value={form.minSupportedVersion}
              onChange={(v) => update('minSupportedVersion', v)}
            />
          </div>
          <Field label="APK download URL" value={form.apkDownloadUrl} onChange={(v) => update('apkDownloadUrl', v)} />
          <div>
            <label className="text-xs text-muted mb-1 block">Update message</label>
            <textarea
              className="input-field w-full"
              rows={2}
              value={form.updateMessage}
              onChange={(e) => update('updateMessage', e.target.value)}
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">AdMob</h2>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.adsEnabled} onChange={(e) => update('adsEnabled', e.target.checked)} />
            Ads enabled
          </label>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Banner Ad Unit ID" value={form.admobBannerId} onChange={(v) => update('admobBannerId', v)} />
            <Field
              label="Interstitial Ad Unit ID"
              value={form.admobInterstitialId}
              onChange={(v) => update('admobInterstitialId', v)}
            />
            <Field
              label="Rewarded Ad Unit ID (for HD unlock)"
              value={form.admobRewardedId}
              onChange={(v) => update('admobRewardedId', v)}
            />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Custom / house banner</h2>
          <Field label="Banner image URL" value={form.customBannerImage} onChange={(v) => update('customBannerImage', v)} />
          <Field
            label="Banner link (e.g. your Telegram or sponsor)"
            value={form.customBannerLink}
            onChange={(v) => update('customBannerLink', v)}
          />
        </div>

        <div className="card space-y-4">
          <h2 className="font-display font-semibold text-sm text-muted uppercase tracking-wider">Community</h2>
          <Field label="Telegram channel URL" value={form.telegramChannelUrl} onChange={(v) => update('telegramChannelUrl', v)} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {savedMsg && <p className="text-sm text-success">{savedMsg}</p>}
        </div>
      </form>
    </div>
  )
}

export default AdsManager
