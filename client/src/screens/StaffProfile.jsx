import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'

export default function StaffProfile() {
  const { id } = useParams()
  const [staff, setStaff] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [u, r] = await Promise.all([
          api.get(`/api/users/${id}`),
          api.get(`/api/reviews/staff/${id}`),
        ])
        setStaff(u.data.user)
        setReviews(r.data.reviews || [])
      } catch {
        setStaff(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div className="p-6">Loading…</div>
  if (!staff) return <div className="p-6">Staff not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">{staff.name}</h1>
      <div className="bg-white rounded-xl p-4 shadow space-y-2">
        <div><span className="font-medium">Email:</span> {staff.email}</div>
        <div><span className="font-medium">Department:</span> {staff.departmentId?.name || 'N/A'}</div>
        {staff.staff?.title && <div><span className="font-medium">Title:</span> {staff.staff.title}</div>}
        {staff.staff?.skills?.length > 0 && <div><span className="font-medium">Skills:</span> {staff.staff.skills.join(', ')}</div>}
        {staff.staff?.workArea?.city && <div><span className="font-medium">Work Area:</span> {staff.staff.workArea.city}</div>}
        {staff.staff?.workArea?.zones?.length > 0 && <div><span className="font-medium">Zones:</span> {staff.staff.workArea.zones.join(', ')}</div>}
        {staff.staff?.contactPhone && <div><span className="font-medium">Contact:</span> {staff.staff.contactPhone}</div>}
        <div><span className="font-medium">Rating:</span> ⭐ {staff.ratings?.average?.toFixed(1) || 0} ({staff.ratings?.count || 0} reviews)</div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-lg font-medium mb-3">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-fade">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r._id} className="border-t pt-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{r.citizenId?.name || 'Anonymous'}</div>
                    <div className="text-sm text-fade">{r.complaintId?.title} • {r.complaintId?.category}</div>
                  </div>
                  <div className="text-yellow-600">{'⭐'.repeat(r.rating)}</div>
                </div>
                {r.comment && <p className="text-sm mt-2">{r.comment}</p>}
                <div className="text-xs text-fade mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

