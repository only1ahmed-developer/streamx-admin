const StatCard = ({ label, value, sublabel }) => (
  <div className="card relative overflow-hidden pt-6">
    <div className="pulse-bar absolute top-0 left-0" />
    <p className="text-xs uppercase tracking-wider text-muted font-medium mb-2">{label}</p>
    <p className="font-display text-3xl font-semibold">{value}</p>
    {sublabel && <p className="text-xs text-muted mt-1">{sublabel}</p>}
  </div>
)

export default StatCard
