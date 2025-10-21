import KpiCard from '../components/KpiCard'

export default function CitizenDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Citizen Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="My Open" value={0} />
        <KpiCard label="In Progress" value={0} />
        <KpiCard label="Resolved" value={0} />
      </div>
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-medium mb-2">My Complaints</h2>
        <p>Placeholder list of your complaints will appear here.</p>
      </div>
    </div>
  )
}
