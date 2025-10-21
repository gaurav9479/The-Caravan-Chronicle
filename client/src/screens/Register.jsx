import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

export default function Register() {
  const { register, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await register({ name, email, password, role })
    if (res.ok) navigate('/')
    else setError(res.message || 'Registration failed')
  }

  return (
    <AuthLayout title="Create account" subtitle="Join the Caravan and start reporting or resolving issues.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <p className="text-red-200 text-sm">{error}</p>}
        <input className="w-full rounded-lg bg-white/30 text-white placeholder-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-white/60" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full rounded-lg bg-white/30 text-white placeholder-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-white/60" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded-lg bg-white/30 text-white placeholder-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-white/60" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <select className="w-full rounded-lg bg-white/30 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-white/60" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option className="text-black" value="citizen">Citizen</option>
          <option className="text-black" value="staff">Staff</option>
          <option className="text-black" value="admin">Admin</option>
        </select>
        <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition">{loading? 'Creating...' : 'Create account'}</button>
        <p className="text-white/80 text-sm">Have an account? <Link to="/login" className="underline">Sign in</Link></p>
      </form>
    </AuthLayout>
  )
}
