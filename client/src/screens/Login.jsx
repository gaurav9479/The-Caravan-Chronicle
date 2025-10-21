import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await login(email, password)
    if (res.ok) navigate('/')
    else setError(res.message || 'Login failed')
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">{loading? 'Logging in...' : 'Login'}</button>
        <p className="text-sm">No account? <Link to="/register" className="underline">Register</Link></p>
      </form>
    </div>
  )
}
