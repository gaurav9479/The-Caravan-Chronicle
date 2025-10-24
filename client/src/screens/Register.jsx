import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import api from '../api/client'
import MapPicker from '../components/MapPicker'

export default function Register() {
  const { register, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [phone, setPhone] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [title, setTitle] = useState('')
  const [skills, setSkills] = useState('')
  const [workCity, setWorkCity] = useState('')
  const [workZones, setWorkZones] = useState('')
  const [workLat, setWorkLat] = useState(28.6139)
  const [workLng, setWorkLng] = useState(77.2090)
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validatePhone = (value) => {
    if (!value) return { valid: null, msg: '' }
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length < 10) return { valid: false, msg: 'Min 10 digits' }
    if (cleaned.length > 15) return { valid: false, msg: 'Max 15 digits' }
    if (/[a-zA-Z]/.test(value)) return { valid: false, msg: 'Numbers only' }
    return { valid: true, msg: 'Valid' }
  }

  const phoneValidation = validatePhone(phone)

  useEffect(() => {
    if (role === 'staff') {
      (async () => {
        try {
          const { data } = await api.get('/api/departments')
          setDepartments(data.departments || [])
        } catch {}
      })()
    }
  }, [role])

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = { name, email, password, role }
    if (phone) payload.phone = phone
    if (role === 'staff' && departmentId) {
      if (workLat == null || workLng == null || Number.isNaN(workLat) || Number.isNaN(workLng)) {
        setError('Please select your working area on the map or use your location')
        return
      }
      payload.departmentId = departmentId
      payload.staff = {
        title,
        skills: skills.split(',').map(s=>s.trim()).filter(Boolean),
        workArea: {
          city: workCity,
          zones: workZones.split(',').map(s=>s.trim()).filter(Boolean),
          location: { lat: Number(workLat), lng: Number(workLng) },
        },
        contactPhone,
        contactEmail,
      }
    }
    const res = await register(payload)
    if (res.ok) navigate('/')
    else setError(res.message || 'Registration failed')
  }

  return (
    <AuthLayout title="Create account" subtitle="Join the Caravan and start reporting or resolving issues.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-red-200 text-sm">{error}</p>}
        <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <div className="relative">
          <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Phone (optional)" value={phone} onChange={(e)=>setPhone(e.target.value)} />
          {phone && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium ${phoneValidation.valid === true ? 'text-green-300' : phoneValidation.valid === false ? 'text-red-300' : 'text-white/60'}`}>
              {phoneValidation.msg}
            </span>
          )}
        </div>
        <select className="w-full rounded-lg bg-white/90 text-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="citizen">Citizen</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        {role === 'staff' && (
          <>
            <select className="w-full rounded-lg bg-white/90 text-gray-900 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" value={departmentId} onChange={(e)=>setDepartmentId(e.target.value)}>
              <option value="">Select Department</option>
              {departments.map(d=><option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
            <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Title (e.g., Field Engineer)" value={title} onChange={(e)=>setTitle(e.target.value)} />
            <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Skills (comma-separated)" value={skills} onChange={(e)=>setSkills(e.target.value)} />
            <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Work City/Area" value={workCity} onChange={(e)=>setWorkCity(e.target.value)} />
            <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Work Zones (comma-separated)" value={workZones} onChange={(e)=>setWorkZones(e.target.value)} />

            <div>
              <label className="block text-sm font-medium mb-1">Working Area Location</label>
              <div className="mb-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if ('geolocation' in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setWorkLat(pos.coords.latitude)
                          setWorkLng(pos.coords.longitude)
                        },
                        () => setError('Could not fetch your location, please allow permission or pick on map')
                      )
                    } else {
                      setError('Geolocation not supported in this browser')
                    }
                  }}
                  className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 text-sm"
                >
                  Use my location
                </button>
                <div className="text-xs text-fade self-center">Lat: {Number(workLat).toFixed(5)} • Lng: {Number(workLng).toFixed(5)}</div>
              </div>
              <MapPicker
                lat={workLat}
                lng={workLng}
                onLocationChange={(lat, lng) => { setWorkLat(lat); setWorkLng(lng) }}
              />
            </div>
            <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contact Phone" value={contactPhone} onChange={(e)=>setContactPhone(e.target.value)} />
            <input className="w-full rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Contact Email" value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} />
          </>
        )}
        <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition">{loading? 'Creating...' : 'Create account'}</button>
        <p className="text-white/80 text-sm">Have an account? <Link to="/login" className="underline">Sign in</Link></p>
      </form>
    </AuthLayout>
  )
}
