import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../auth/AuthContext'

export default function ProfileEdit() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    workArea: { city: '', zones: [] },
    isWorkingToday: true,
    contactPhone: '',
    contactEmail: '',
    skills: [],
    title: '',
    shiftStart: '',
    shiftEnd: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.profile?.phone || '',
        workArea: {
          city: user.staff?.workArea?.city || '',
          zones: user.staff?.workArea?.zones || [],
        },
        isWorkingToday: user.staff?.isWorkingToday ?? true,
        contactPhone: user.staff?.contactPhone || '',
        contactEmail: user.staff?.contactEmail || '',
        skills: user.staff?.skills || [],
        title: user.staff?.title || '',
        shiftStart: user.staff?.shiftStart || '',
        shiftEnd: user.staff?.shiftEnd || '',
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await api.patch('/api/users/profile', formData)
      setUser(data.user)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(s => s.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, [field]: array }))
  }

  if (!user) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl p-4 shadow space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              className="w-full border rounded p-2"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
        </div>

        {user.role === 'staff' && (
          <div className="bg-white rounded-xl p-4 shadow space-y-4">
            <h2 className="text-lg font-medium">Work Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full border rounded p-2"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Field Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
              <input
                className="w-full border rounded p-2"
                value={formData.skills.join(', ')}
                onChange={(e) => handleArrayChange('skills', e.target.value)}
                placeholder="e.g., plumbing, electrical, maintenance"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Shift Start</label>
                <input
                  type="time"
                  className="w-full border rounded p-2"
                  value={formData.shiftStart}
                  onChange={(e) => handleChange('shiftStart', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Shift End</label>
                <input
                  type="time"
                  className="w-full border rounded p-2"
                  value={formData.shiftEnd}
                  onChange={(e) => handleChange('shiftEnd', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isWorkingToday"
                checked={formData.isWorkingToday}
                onChange={(e) => handleChange('isWorkingToday', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isWorkingToday" className="text-sm font-medium">Working today</label>
            </div>
          </div>
        )}

        {user.role === 'staff' && (
          <div className="bg-white rounded-xl p-4 shadow space-y-4">
            <h2 className="text-lg font-medium">Work Area</h2>
            <div>
              <label className="block text-sm font-medium mb-1">City/Area</label>
              <input
                className="w-full border rounded p-2"
                value={formData.workArea.city}
                onChange={(e) => handleChange('workArea.city', e.target.value)}
                placeholder="e.g., New York, Manhattan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zones (comma-separated)</label>
              <input
                className="w-full border rounded p-2"
                value={formData.workArea.zones.join(', ')}
                onChange={(e) => handleArrayChange('workArea.zones', e.target.value)}
                placeholder="e.g., Zone A, North District, Downtown"
              />
            </div>
          </div>
        )}

        {user.role === 'staff' && (
          <div className="bg-white rounded-xl p-4 shadow space-y-4">
            <h2 className="text-lg font-medium">Contact Information</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                className="w-full border rounded p-2"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                placeholder="Phone for citizens to contact you"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={formData.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                placeholder="Email for citizens to contact you"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
