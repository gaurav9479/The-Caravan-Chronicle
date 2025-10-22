import { useEffect, useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'
import MapPicker from '../components/MapPicker'

const categories = ['Road Damage','Water Leakage','Garbage','Other']

export default function NewComplaint() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [priority, setPriority] = useState('LOW')
  const [lat, setLat] = useState(28.6139)
  const [lng, setLng] = useState(77.2090)
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/departments')
        setDepartments(data.departments || [])
      } catch {}
    })()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        title,
        description,
        category,
        priority,
        location: {
          lat: lat ? Number(lat) : undefined,
          lng: lng ? Number(lng) : undefined,
        },
      }
      await api.post('/api/complaints', payload)
      navigate('/')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">New Complaint</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded p-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full border rounded p-2" rows={4} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select className="border rounded p-2" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="border rounded p-2" value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input className="border rounded p-2" placeholder="Department (auto)" value={(departments.find(d=>d.categoriesHandled?.includes(category))?.name)||''} readOnly />
        </div>
        <div>
          <label className="block text-sm mb-1">Location (click on map or enter coordinates)</label>
          <MapPicker lat={lat} lng={lng} onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); }} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input className="border rounded p-2 text-sm" placeholder="Latitude" value={lat} onChange={e=>setLat(Number(e.target.value))} />
            <input className="border rounded p-2 text-sm" placeholder="Longitude" value={lng} onChange={e=>setLng(Number(e.target.value))} />
          </div>
        </div>
        <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-50">{loading? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  )
}
