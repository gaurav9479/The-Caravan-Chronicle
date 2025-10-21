import { useEffect, useState } from 'react'
import api from '../api/client'
import KpiCard from '../components/KpiCard'

export default function AdminDashboard() {
  const [data, setData] = useState({ total: 0, byStatus: {}, overdue: 0, categories: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, c] = await Promise.all([
          api.get('/api/analytics/summary'),
          api.get('/api/analytics/categories'),
        ])
        setData({ ...s.data, categories: c.data.categories })
      } catch (e) {
        // noop placeholder
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const by = data.byStatus || {}

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total" value={data.total} />
        <KpiCard label="Open" value={by.OPEN || 0} />
        <KpiCard label="In Progress" value={by.IN_PROGRESS || 0} />
        <KpiCard label="Overdue" value={data.overdue} />
      </div>
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-medium mb-2">Top Categories</h2>
        <ul className="list-disc ml-6">
          {loading ? <li>Loading…</li> : (data.categories || []).map(c => (
            <li key={c._id}>{c._id} — {c.count}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
