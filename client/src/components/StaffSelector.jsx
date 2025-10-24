import { useEffect, useState } from 'react'
import api from '../api/client'

export default function StaffSelector({ lat, lng, category, onStaffSelect, selectedStaffId }) {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (lat && lng && category) {
      fetchNearbyStaff()
    }
  }, [lat, lng, category])

  const fetchNearbyStaff = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get(`/api/staff/nearby?lat=${lat}&lng=${lng}&category=${category}&radius=15`)
      setStaff(data.staff || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to find nearby staff')
    } finally {
      setLoading(false)
    }
  }

  if (!lat || !lng || !category) {
    return <div className="text-sm text-fade">Select location and category to see available staff</div>
  }

  if (loading) return <div className="text-sm text-fade">Finding nearby staff...</div>
  if (error) return <div className="text-sm text-red-600">{error}</div>
  if (staff.length === 0) return <div className="text-sm text-fade">No staff available in this area</div>

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-sm">Available Staff ({staff.length})</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {staff.map(s => (
          <div
            key={s._id}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedStaffId === s._id 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-gray-200 hover:border-emerald-300'
            }`}
            onClick={() => onStaffSelect(s._id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold">
                  {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-fade">{s.staff?.title || 'Staff Member'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">⭐ {s.ratings?.average?.toFixed(1) || 'N/A'}</div>
                <div className="text-xs text-fade">{s.distance} km away</div>
                <div className="text-xs text-fade">~{s.estimatedArrival} min</div>
              </div>
            </div>
            {s.staff?.skills?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {s.staff.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
                {s.staff.skills.length > 3 && (
                  <span className="text-xs text-fade">+{s.staff.skills.length - 3} more</span>
                )}
              </div>
            )}
            {s.staff?.contactPhone && (
              <div className="mt-1 text-xs text-fade">📞 {s.staff.contactPhone}</div>
            )}
          </div>
        ))}
      </div>
      {selectedStaffId && (
        <div className="text-xs text-emerald-600 font-medium">
          ✓ Staff selected - they will be notified of your complaint
        </div>
      )}
    </div>
  )
}
