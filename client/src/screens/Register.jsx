import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

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
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Register</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <select className="w-full border rounded p-2" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option value="citizen">Citizen</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">{loading? 'Registering...' : 'Register'}</button>
        <p className="text-sm">Have an account? <Link to="/login" className="underline">Login</Link></p>
      </form>
    </div>
  )
}
