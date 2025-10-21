import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Dashboard from '../screens/Dashboard'
import AdminDashboard from '../screens/AdminDashboard'
import StaffDashboard from '../screens/StaffDashboard'
import CitizenDashboard from '../screens/CitizenDashboard'
import ProtectedRoute from '../auth/ProtectedRoute'
import { useAuth } from '../auth/AuthContext'

function RoleDashboard() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'admin') return <AdminDashboard />
  if (user.role === 'staff') return <StaffDashboard />
  return <CitizenDashboard />
}

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RoleDashboard />
      </ProtectedRoute>
    ),
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
